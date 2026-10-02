from datetime import date

import polars as pl

from app.models import (
    DatasetProfile,
    DimensionStatistics,
    FieldProfile,
    FieldStatistics,
    MeasureStatistics,
    SemanticRole,
    TemporalStatistics,
    ValueCount,
)
from app.schema_detection import infer_physical_type, infer_semantic_role

# ===== CONSTANTS =============================================================
VALUE_COUNT_LIMIT = 5
HISTOGRAM_BIN_LIMIT = 20


# ===== PROFILE ===============================================================
def build_dataset_profile(
    dataset_id: str, frame: pl.DataFrame
) -> DatasetProfile:
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
    physical_type = infer_physical_type(column.dtype)
    values = column.drop_nulls()
    unique_count = values.n_unique()
    semantic_role = infer_semantic_role(
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
    if semantic_role == SemanticRole.MEASURE:
        return build_measure_statistics(values)
    if semantic_role == SemanticRole.DIMENSION:
        return build_dimension_statistics(values)
    if semantic_role == SemanticRole.TEMPORAL:
        return build_temporal_statistics(values)
    return None


def build_measure_statistics(values: pl.Series) -> MeasureStatistics:
    return MeasureStatistics(
        min=to_float(values.min()),
        max=to_float(values.max()),
        mean=to_float(values.mean()),
        median=to_float(values.median()),
        histogram=build_histogram(values),
    )


def build_dimension_statistics(values: pl.Series) -> DimensionStatistics:
    counts = (
        values.cast(pl.String)
        .alias("value")
        .value_counts(name="count")
        .sort(["count", "value"], descending=[True, False])
        .head(VALUE_COUNT_LIMIT)
    )
    return DimensionStatistics(
        value_counts=[
            ValueCount(value=value, count=count)
            for value, count in counts.iter_rows()
        ]
    )


def build_temporal_statistics(values: pl.Series) -> TemporalStatistics:
    return TemporalStatistics(
        min=format_temporal(values.min()),
        max=format_temporal(values.max()),
        histogram=build_histogram(values),
    )


def build_histogram(values: pl.Series) -> list[int]:
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
    return value.isoformat() if isinstance(value, date) else None


def to_float(value: object) -> float | None:
    return float(value) if isinstance(value, int | float) else None
