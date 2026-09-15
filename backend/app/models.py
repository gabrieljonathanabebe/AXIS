from enum import StrEnum
from typing import Any

from pydantic import BaseModel


class PhysicalType(StrEnum):
    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"


class SemanticType(StrEnum):
    NUMERICAL = "numeric"
    CATEGORIAL = "categorical"
    TEMPORAL = "temporal"
    IDENTIFIER = "identifier"


class Field(BaseModel):
    name: str
    physical_type: PhysicalType
    semantic_type: SemanticType


class DatasetSummary(BaseModel):
    id: str
    name: str
    row_count: int
    fields: list[Field]


class DatasetRows(BaseModel):
    dataset_id: str
    offset: int
    limit: int
    rows: list[dict[str, Any]]
