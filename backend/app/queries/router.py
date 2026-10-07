from fastapi import APIRouter, HTTPException

from app.datasets.dependencies import StoredDatasetDep
from app.queries import chart_query, table_query
from app.queries.models import (
    ChartQueryRequest,
    ChartQueryResult,
    FieldValues,
    PointsQueryRequest,
    PointsQueryResult,
    TableQueryRequest,
    TableQueryResult,
)

router = APIRouter(prefix="/datasets/{dataset_id}", tags=["queries"])


@router.get("/fields/{field_name:path}/values")
def get_field_values(
    stored: StoredDatasetDep,
    field_name: str,
    search: str = "",
    limit: int = 100,
) -> FieldValues:
    """Return the most frequent values of a field for the values filter."""
    if field_name not in stored.frame.columns:
        raise HTTPException(status_code=404, detail="Field not found.")
    return table_query.build_field_values(
        stored.frame, field_name, search, limit
    )


@router.post("/chart-query")
def query_chart(
    stored: StoredDatasetDep,
    query: ChartQueryRequest,
) -> ChartQueryResult:
    """Return the aggregated points of a bar, line, pie or donut chart."""
    chart_query.validate_chart_query(stored.summary, query)
    return chart_query.build_chart_query_result(stored.frame, query)


@router.post("/table-query")
def query_table(
    stored: StoredDatasetDep,
    query: TableQueryRequest,
) -> TableQueryResult:
    """Return one page of filtered and sorted table rows."""
    table_query.validate_table_query(stored.summary, query)
    return table_query.build_table_query_result(stored.frame, query)


@router.post("/points-query")
def query_points(
    stored: StoredDatasetDep,
    query: PointsQueryRequest,
) -> PointsQueryResult:
    """Return single rows for a scatter chart, sampled if large."""
    chart_query.validate_points_query(stored.summary, query)
    return chart_query.build_points_query_result(stored.frame, query)
