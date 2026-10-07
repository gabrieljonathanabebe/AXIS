from collections.abc import Sequence

import polars as pl

from app.models import (
    ChartFilter,
    ChartQueryPoint,
    ChartQueryRequest,
    ChartQueryResult,
    DatasetSummary,
    GroupAggregation,
    PhysicalType,
    PointsQueryRequest,
    PointsQueryResult,
    RangeChartFilter,
    TableFilter,
)

MAX_CHART_POINTS = 2_000


def build_aggregation_expression(
    field_name: str,
    aggregation: GroupAggregation,
    result_name: str,
) -> pl.Expr:
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


# Shared by numeric and date ranges; at least one bound is set.
def build_bounds_expression(
    column: pl.Expr,
    lower: object | None,
    upper: object | None,
) -> pl.Expr:
    if lower is None:
        return column <= upper
    if upper is None:
        return column >= lower
    return column.is_between(lower, upper)


def build_filter_expression(chart_filter: ChartFilter) -> pl.Expr:
    if isinstance(chart_filter, RangeChartFilter):
        return build_bounds_expression(
            pl.col(chart_filter.field),
            chart_filter.min,
            chart_filter.max,
        )
    return pl.col(chart_filter.field).cast(pl.Utf8).is_in(chart_filter.values)


def apply_chart_filters(
    frame: pl.DataFrame,
    filters: list[ChartFilter],
) -> pl.DataFrame:
    for chart_filter in filters:
        frame = frame.filter(build_filter_expression(chart_filter))
    return frame


def aggregate_chart_frame(
    frame: pl.DataFrame,
    query: ChartQueryRequest,
) -> pl.DataFrame:
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
    frame: pl.DataFrame, query: ChartQueryRequest
) -> ChartQueryResult:
    filtered = apply_chart_filters(frame, query.filters)
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


# Scatter draws single rows; large datasets are sampled, not cut off.
# A fixed seed keeps the same points between requests.
def build_points_query_result(
    frame: pl.DataFrame,
    query: PointsQueryRequest,
) -> PointsQueryResult:
    points = frame.select(query.fields)
    if points.height > MAX_CHART_POINTS:
        points = points.sample(MAX_CHART_POINTS, seed=0)
    return PointsQueryResult(rows=points.to_dicts(), total_count=frame.height)


def validate_points_query(
    summary: DatasetSummary,
    query: PointsQueryRequest,
) -> None:
    field_names = {field.name for field in summary.fields}
    if not query.fields:
        raise ValueError("Points need at least one field.")
    for name in query.fields:
        if name not in field_names:
            raise ValueError(f"Unknown field: {name}")


def validate_filters(
    summary: DatasetSummary,
    filters: Sequence[TableFilter],
) -> None:
    fields = {field.name: field for field in summary.fields}
    for item in filters:
        if item.field not in fields:
            raise ValueError(f"Unknown field: {item.field}")
        if not isinstance(item, RangeChartFilter):
            continue
        if item.min is None and item.max is None:
            raise ValueError("Range filters need a min or max.")
        filter_type = fields[item.field].physical_type
        if filter_type not in (PhysicalType.INTEGER, PhysicalType.FLOAT):
            raise ValueError("Range filters require a numeric field.")


def validate_chart_query(
    summary: DatasetSummary,
    query: ChartQueryRequest,
) -> None:
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
    validate_filters(summary, query.filters)
    if query.aggregation is not GroupAggregation.COUNT:
        y_type = fields[query.y].physical_type
        if y_type not in (PhysicalType.INTEGER, PhysicalType.FLOAT):
            raise ValueError("Y must be numeric for this aggregation.")
