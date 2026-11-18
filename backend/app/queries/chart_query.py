import polars as pl

from app.datasets import schema_detection
from app.datasets.models import (
    DatasetSummary,
    PhysicalType,
    TimeGrain,
)
from app.queries import filters
from app.queries.models import (
    ChartLimit,
    ChartQueryPoint,
    ChartQueryRequest,
    ChartQueryResult,
    ChartSort,
    GroupAggregation,
    PointsQueryRequest,
    PointsQueryResult,
)

MAX_CHART_POINTS = 2_000

TRUNCATE_EVERY: dict[TimeGrain, str] = {
    TimeGrain.DAY: "1d",
    TimeGrain.WEEK: "1w",
    TimeGrain.MONTH: "1mo",
    TimeGrain.QUARTER: "1q",
    TimeGrain.YEAR: "1y",
}

DEFAULT_SORT = ChartSort(by="value", order="desc")


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


def build_x_expression(query: ChartQueryRequest) -> pl.Expr:
    """
    Build the X column of the chart groups.
    Args:
        query: Encoding of the chart; a time grain truncates dates to it.
    Returns:
        X as is, or as date at the start of its day, week (Monday),
        month, quarter or year.
    """
    column = pl.col(query.x)
    if query.time_grain is None:
        return column.alias("x")
    every = TRUNCATE_EVERY[query.time_grain]
    return column.dt.truncate(every).cast(pl.Date).alias("x")


def select_categories(
    frame: pl.DataFrame,
    categories: list[str | None],
) -> pl.DataFrame:
    """
    Keep the given categories in their order, e.g. those of the base query.
    Args:
        frame: Aggregated groups with a text or boolean X.
        categories: X values as the chart result sends them; None is the
            group without category.
    Returns:
        The groups of these categories in this order; series keep their
        order within a category, categories without groups are left out.
    """
    order = pl.DataFrame(
        {"x_text": categories, "position": range(len(categories))},
        schema={"x_text": pl.Utf8, "position": pl.Int64},
    )
    return (
        frame.with_columns(pl.col("x").cast(pl.Utf8).alias("x_text"))
        .join(
            order,
            on="x_text",
            how="inner",
            nulls_equal=True,
            maintain_order="left",
        )
        .sort("position", maintain_order=True)
        .drop("x_text", "position")
    )


def limit_categories(
    frame: pl.DataFrame,
    limit: ChartLimit,
) -> pl.DataFrame:
    """
    Keep the categories with the largest or smallest total value.
    Args:
        frame: Aggregated groups with a text or boolean X.
        limit: Top or bottom and how many categories stay.
    Returns:
        The groups of the kept categories in their previous order; the
        total adds the values of all series of a category.
    """
    totals = frame.group_by("x", maintain_order=True).agg(
        pl.col("value").sum()
    )
    kept = totals.sort(
        "value",
        descending=limit.kind == "top",
        maintain_order=True,
        nulls_last=True,
    ).head(limit.count)
    return frame.filter(
        pl.col("x").is_in(kept.get_column("x").implode(), nulls_equal=True)
    )


def sort_categories(
    frame: pl.DataFrame,
    sort: ChartSort,
) -> pl.DataFrame:
    """
    Order the groups by the total value or the name of their category.
    Args:
        frame: Aggregated groups with a text or boolean X.
        sort: Value or category, ascending or descending.
    Returns:
        The groups category by category. Names compare without case and
        false before true; the group without category comes last when
        sorted by name. Ties keep the order of first occurrence.
    """
    if sort.by == "value":
        key = pl.col("value").sum().over("x")
    elif frame.schema["x"] == pl.String:
        key = pl.col("x").str.to_lowercase()
    else:
        key = pl.col("x")
    first_position = pl.int_range(pl.len()).min().over("x")
    return frame.sort(
        [key, first_position],
        descending=[sort.order == "desc", False],
        maintain_order=True,
        nulls_last=True,
    )


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
        A numeric or temporal X is sorted by X; a text or boolean X keeps
        the given categories, or is limited and then sorted by the query,
        by default by total value in descending order.
    """
    group_fields = [build_x_expression(query)]
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
    aggregated = frame.group_by(
        group_fields,
        maintain_order=True,
    ).agg(expressions)
    x_dtype = aggregated.schema["x"]
    if x_dtype.is_numeric() or x_dtype.is_temporal():
        return aggregated.sort("x", maintain_order=True, nulls_last=True)
    if query.categories is not None:
        return select_categories(aggregated, query.categories)
    if query.limit is not None:
        aggregated = limit_categories(aggregated, query.limit)
    return sort_categories(aggregated, query.sort or DEFAULT_SORT)


def format_group_value(value: object) -> str | None:
    """
    Turn an X or series value into the text the chart result sends.
    Args:
        value: Value of a group column.
    Returns:
        The value as text; booleans as "true" or "false", like the text
        that values filters and categories compare with. None stays None.
    """
    if value is None:
        return None
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


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
        points.append(
            ChartQueryPoint(
                x=format_group_value(row["x"]),
                series=format_group_value(row.get("series")),
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
        ValueError: If fields are unknown, duplicated across encodings,
            not numeric where an aggregation needs numbers, if a time
            grain is set on X that is no date, if sort, limit or
            categories are set on X that is no category, or if limit and
            categories are combined.
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
    x_type = fields[query.x].physical_type
    if query.time_grain is not None and not schema_detection.is_date_type(
        x_type
    ):
        raise ValueError("Time grain needs a date field on X.")
    has_category_order = (
        query.sort is not None
        or query.limit is not None
        or query.categories is not None
    )
    if has_category_order and not schema_detection.is_category_type(x_type):
        raise ValueError("Category order needs a text or boolean X.")
    if query.limit is not None and query.categories is not None:
        raise ValueError("Limit and categories cannot be combined.")
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
