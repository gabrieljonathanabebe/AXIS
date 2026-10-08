from datetime import date

import polars as pl

from app.datasets import schema_detection
from app.datasets.models import (
    DatasetProfile,
    DimensionStatistics,
    FieldProfile,
    FieldStatistics,
    MeasureStatistics,
    SemanticRole,
    TemporalGranularity,
    TemporalStatistics,
    ValueCount,
)

# ===== CONSTANTS =============================================================
VALUE_COUNT_LIMIT = 5
HISTOGRAM_BIN_LIMIT = 20

GRANULARITY_DAY_RANGES = [
    (TemporalGranularity.DAY, 1, 1),
    (TemporalGranularity.WEEK, 7, 7),
    (TemporalGranularity.MONTH, 28, 31),
    (TemporalGranularity.QUARTER, 89, 92),
    (TemporalGranularity.YEAR, 365, 366),
]


# ===== PROFILE ===============================================================
def build_dataset_profile(
    dataset_id: str,
    frame: pl.DataFrame,
) -> DatasetProfile:
    """
    Profile every column and the dataset as a whole.
    Args:
        dataset_id: Id stored in the profile.
        frame: Rows of the dataset.
    Returns:
        Row, column, missing and duplicate counts plus one profile per field.
    """
    fields = [build_field_profile(column) for column in frame.get_columns()]
    return DatasetProfile(
        dataset_id=dataset_id,
        row_count=frame.height,
        column_count=frame.width,
        missing_count=sum(field.missing_count for field in fields),
        duplicate_rows=frame.height - frame.unique().height,
        fields=fields,
    )


def build_field_profile(column: pl.Series) -> FieldProfile:
    """
    Detect type and role of a column and compute its statistics.
    Args:
        column: One column of the dataset.
    Returns:
        The field profile; statistics follow the detected role.
    """
    physical_type = schema_detection.infer_physical_type(column.dtype)
    values = column.drop_nulls()
    unique_count = values.n_unique()
    semantic_role = schema_detection.infer_semantic_role(
        column.name,
        physical_type,
        unique_count,
        values.len(),
    )
    return FieldProfile(
        name=column.name,
        physical_type=physical_type,
        semantic_role=semantic_role,
        missing_count=column.null_count(),
        unique_count=unique_count,
        statistics=build_statistics(values, semantic_role),
    )


# ===== STATISTICS ============================================================
def build_statistics(
    values: pl.Series,
    semantic_role: SemanticRole,
) -> FieldStatistics | None:
    """Build the statistics that fit the role; identifiers get none."""
    if semantic_role == SemanticRole.MEASURE:
        return build_measure_statistics(values)
    if semantic_role == SemanticRole.DIMENSION:
        return build_dimension_statistics(values)
    if semantic_role == SemanticRole.TEMPORAL:
        return build_temporal_statistics(values)
    return None


def build_measure_statistics(values: pl.Series) -> MeasureStatistics:
    """Compute min, max, mean, median and histogram of a numeric field."""
    return MeasureStatistics(
        min=to_float(values.min()),
        max=to_float(values.max()),
        mean=to_float(values.mean()),
        median=to_float(values.median()),
        histogram=build_histogram(values),
    )


def count_values(values: pl.Series) -> pl.DataFrame:
    """
    Count how often each value occurs, shared by profile and values filter.
    Args:
        values: Non-null values of a column.
    Returns:
        Columns value (as text) and count; most frequent first, equal
        counts in alphabetical order.
    """
    return (
        values.cast(pl.String)
        .alias("value")
        .value_counts(name="count")
        .sort(["count", "value"], descending=[True, False])
    )


def build_dimension_statistics(values: pl.Series) -> DimensionStatistics:
    """List the most frequent values of a categorical field."""
    counts = count_values(values).head(VALUE_COUNT_LIMIT)
    return DimensionStatistics(
        value_counts=[
            ValueCount(value=value, count=count)
            for value, count in counts.iter_rows()
        ]
    )


def build_temporal_statistics(values: pl.Series) -> TemporalStatistics:
    """Compute date range, granularity and histogram of a date field."""
    return TemporalStatistics(
        min=format_temporal(values.min()),
        max=format_temporal(values.max()),
        granularity=detect_granularity(values),
        histogram=build_histogram(values),
    )


def detect_granularity(values: pl.Series) -> TemporalGranularity | None:
    """
    Detect the typical step between consecutive distinct dates.
    Args:
        values: Non-null date or datetime values.
    Returns:
        The granularity whose day range contains the most common gap, or
        None for a single date or an irregular gap.
    """
    gaps = values.cast(pl.Date).unique().sort().diff().drop_nulls()
    if gaps.is_empty():
        return None
    days = gaps.dt.total_days().mode().min()
    return next(
        (
            granularity
            for granularity, low, high in GRANULARITY_DAY_RANGES
            if low <= days <= high  # type: ignore
        ),
        None,
    )


def build_histogram(values: pl.Series) -> list[int]:
    """
    Count values in equal-width bins between min and max.
    Args:
        values: Non-null numeric, date or datetime values.
    Returns:
        Up to HISTOGRAM_BIN_LIMIT counts, fewer if there are fewer distinct
        values; a single count if all values are equal.
    """
    numbers = values.to_physical().cast(pl.Float64)
    if numbers.is_empty():
        return []
    low = numbers.min()
    high = numbers.max()
    if high == low:
        return [numbers.len()]
    bin_count = min(HISTOGRAM_BIN_LIMIT, numbers.n_unique())
    positions = (
        ((numbers - low) / (high - low) * bin_count)  # type: ignore
        .floor()
        .clip(0, bin_count - 1)
        .cast(pl.Int64)
    )
    histogram = [0] * bin_count
    for position, count in positions.value_counts().iter_rows():
        histogram[position] = count
    return histogram


# ===== HELPERS ===============================================================
def format_temporal(value: object) -> str | None:
    """Return a date as ISO text, anything else as None."""
    return value.isoformat() if isinstance(value, date) else None


def to_float(value: object) -> float | None:
    """Return a number as float, anything else as None."""
    return float(value) if isinstance(value, int | float) else None
