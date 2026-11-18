from datetime import date, datetime

import polars as pl

from app.datasets import profiling, schema_detection
from app.datasets.models import TimeGrain


# ===== FIELDS ================================================================
def test_create_fields_carries_the_native_grain() -> None:
    """Date fields get the step of their dates; other fields get none."""
    frame = pl.DataFrame(
        {
            "month": [date(2025, 1, 1), date(2025, 2, 1), date(2025, 3, 1)],
            "day": [
                datetime(2025, 1, 1, 8),
                datetime(2025, 1, 2, 23),
                datetime(2025, 1, 3),
            ],
            "country": ["US", "DE", "FR"],
        }
    )
    profile = profiling.build_dataset_profile("test", frame)

    fields = schema_detection.create_fields(profile)

    assert [(field.name, field.native_grain) for field in fields] == [
        ("month", TimeGrain.MONTH),
        ("day", TimeGrain.DAY),
        ("country", None),
    ]


def test_field_profile_stays_flat_without_grain_in_statistics() -> None:
    """The profile repeats the field keys; statistics only describe."""
    frame = pl.DataFrame({"day": [date(2025, 1, 1), date(2025, 1, 2)]})

    field = profiling.build_dataset_profile("test", frame).fields[0]

    assert field.model_dump(exclude={"statistics"}) == {
        "name": "day",
        "physical_type": "date",
        "semantic_role": "temporal",
        "native_grain": "day",
        "missing_count": 0,
        "unique_count": 2,
    }
    assert field.statistics is not None
    assert "granularity" not in field.statistics.model_dump()
