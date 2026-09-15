from dataclasses import dataclass

import polars as pl

from app.models import DatasetSummary


@dataclass
class StoredDataset:
    summary: DatasetSummary
    frame: pl.DataFrame


datasets: dict[str, StoredDataset] = {}
