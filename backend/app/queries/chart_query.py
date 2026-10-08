import polars as pl

from app.datasets.models import DatasetSummary, PhysicalType
from app.queries import filters
from app.queries.models import (
    ChartQueryPoint,
    ChartQueryRequest,
    ChartQueryResult,
    GroupAggregation,
    PointsQueryRequest,
    PointsQueryResult,
)

MAX_CHART_POINTS = 2_000


def build_aggregation_expression(
    field_name: str,
    aggregation: GroupAggregation,
    result_name: str,
) -> pl.Expr:
    """
    Build the Polars aggregation for one value of a chart group.
    Args:
        field_name: Field to aggregate; ignored for count.
        aggregation: Sum, mean, median, min, max or count.
        result_name: Column name of the result.
    Returns:
        An aggregation expression for group_by().agg().
    """
    if aggregation is GroupAggregation.COUNT:
        return pl.len().alias(result_name)
    column = pl.col(field_name)
    if aggregation is GroupAggregation.SUM:
        return column.sum().alias(result_name)
    if aggregation is GroupAggregation.MEAN:
        return column.mean().alias(result_name)
    if aggregation is GroupAggregation.MEDIAN:
        return column.median().alias(result_name)
    if aggregation is GroupAggregation.MIN:
        return column.min().alias(result_name)
    if aggregation is GroupAggregation.MAX:
        return column.max().alias(result_name)
    raise ValueError(f"Unsupported aggregation: {aggregation}")


def aggregate_chart_frame(
    frame: pl.DataFrame,
    query: ChartQueryRequest,
) -> pl.DataFrame:
    """
    Group rows by X (and series) and aggregate Y (and color).
    Args:
        frame: Filtered rows of the dataset.
        query: Encoding and aggregations of the chart.
    Returns:
        One row per group with columns x, series, value and color_value.
    """
    group_fields = [pl.col(query.x).alias("x")]
    if query.series is not None:
        group_fields.append(pl.col(query.series).alias("series"))
    expressions = [
        build_aggregation_expression(
            query.y,
            query.aggregation,
            "value",
        )
    ]
    if query.color is not None and query.color_aggregation is not None:
        expressions.append(
            build_aggregation_expression(
                query.color,
                query.color_aggregation,
                "color_value",
            )
        )
    return frame.group_by(
        group_fields,
        maintain_order=True,
    ).agg(expressions)


def build_chart_query_result(
    frame: pl.DataFrame,
    query: ChartQueryRequest,
) -> ChartQueryResult:
    """
    Filter and aggregate the dataset for a bar, line, pie or donut chart.
    Args:
        frame: Full dataset of the request.
        query: Encoding, aggregations and filters of the chart.
    Returns:
        One point per group; X and series values are sent as text.
    Raises:
        ValueError: If the result has more than MAX_CHART_POINTS groups.
    """
    filtered = filters.apply_filters(frame, query.filters)
    aggregated = aggregate_chart_frame(filtered, query)
    if aggregated.height > MAX_CHART_POINTS:
        raise ValueError("Chart result exceeds 2000 points.")
    points: list[ChartQueryPoint] = []
    for row in aggregated.iter_rows(named=True):
        x_value = row["x"]
        series_value = row.get("series")
        points.append(
            ChartQueryPoint(
                x=str(x_value) if x_value is not None else None,
                series=(
                    str(series_value) if series_value is not None else None
                ),
                value=row["value"],
                color_value=row.get("color_value"),
            )
        )
    return ChartQueryResult(points=points)


def build_points_query_result(
    frame: pl.DataFrame,
    query: PointsQueryRequest,
) -> PointsQueryResult:
    """
    Select the encoded fields of single rows for a scatter chart.
    Args:
        frame: Full dataset of the request.
        query: Fields the scatter chart encodes.
    Returns:
        The rows, sampled to MAX_CHART_POINTS with a fixed seed so the same
        points return on every request, and the dataset row count.
    """
    points = frame.select(query.fields)
    if points.height > MAX_CHART_POINTS:
        points = points.sample(MAX_CHART_POINTS, seed=0)
    return PointsQueryResult(rows=points.to_dicts(), total_count=frame.height)


def validate_points_query(
    summary: DatasetSummary,
    query: PointsQueryRequest,
) -> None:
    """Reject an empty field list and unknown fields."""
    field_names = {field.name for field in summary.fields}
    if not query.fields:
        raise ValueError("Points need at least one field.")
    for name in query.fields:
        if name not in field_names:
            raise ValueError(f"Unknown field: {name}")


def validate_chart_query(
    summary: DatasetSummary,
    query: ChartQueryRequest,
) -> None:
    """
    Check that the encoding and filters form a valid aggregated query.
    Args:
        summary: Dataset whose fields the query addresses.
        query: Encoding, aggregations and filters of the chart.
    Raises:
        ValueError: If fields are unknown, duplicated across encodings or
            not numeric where an aggregation needs numbers.
    """
    fields = {field.name: field for field in summary.fields}
    has_color = query.color is not None
    has_color_aggregation = query.color_aggregation is not None
    if has_color != has_color_aggregation:
        raise ValueError("Color and color aggregation must be set together.")
    requested = [query.x, query.y]
    if query.series is not None:
        requested.append(query.series)
    if query.color is not None:
        requested.append(query.color)
    for name in requested:
        if name not in fields:
            raise ValueError(f"Unknown field: {name}")
    if query.series == query.x:
        raise ValueError("Series must differ from X.")
    if query.color is not None:
        if query.color in (query.x, query.series):
            raise ValueError("Color must differ from X and Series.")
        color_type = fields[query.color].physical_type
        if color_type not in (
            PhysicalType.INTEGER,
            PhysicalType.FLOAT,
        ):
            raise ValueError("Color must be numeric.")
    filters.validate_filters(summary, query.filters)
    if query.aggregation is not GroupAggregation.COUNT:
        y_type = fields[query.y].physical_type
        if y_type not in (PhysicalType.INTEGER, PhysicalType.FLOAT):
            raise ValueError("Y must be numeric for this aggregation.")
