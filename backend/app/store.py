from dataclasses import dataclass

import polars as pl

from app.models import DatasetProfile, DatasetSummary


@dataclass
class StoredDataset:
    summary: DatasetSummary
    profile: DatasetProfile
    frame: pl.DataFrame


datasets: dict[str, StoredDataset] = {}
