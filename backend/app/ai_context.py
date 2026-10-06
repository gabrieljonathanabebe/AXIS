from app.models import (
    AiChartRule,
    AiEncodingRule,
    DatasetProfile,
    DimensionStatistics,
    Field,
    FieldProfile,
    MeasureStatistics,
    SemanticRole,
)


# ===== DATASET ===============================================================
def build_dataset_context(profile: DatasetProfile, fields: list[Field]) -> str:
    roles = {field.name: field.semantic_role for field in fields}
    lines = [
        describe_field(field, roles.get(field.name, field.semantic_role))
        for field in profile.fields
    ]
    return f"rows: {profile.row_count}\n" + "\n".join(lines)


def describe_field(field: FieldProfile, role: SemanticRole) -> str:
    parts = [
        field.name,
        field.physical_type,
        role,
        describe_values(field, role),
    ]
    if field.missing_count:
        parts.append(f"{field.missing_count} missing")
    return " | ".join(parts)


def describe_values(field: FieldProfile, role: SemanticRole) -> str:
    statistics = field.statistics
    # Statistics follow the detected role; after an override they no longer fit.
    if statistics is None or statistics.kind != role:
        return f"{field.unique_count} distinct values"
    if isinstance(statistics, MeasureStatistics):
        values = {
            "max": statistics.max,
            "mean": statistics.mean,
            "median": statistics.median,
            "min": statistics.min,
        }
        return ", ".join(
            f"{name} {format_number(value)}"
            for name, value in values.items()
            if value is not None
        )
    if isinstance(statistics, DimensionStatistics):
        top = ", ".join(
            f"{count.value} ({count.count})"
            for count in statistics.value_counts
        )
        return f"{field.unique_count} distinct values, top: {top}"
    period = f"{statistics.min} to {statistics.max}"
    if statistics.granularity is None:
        return period
    return f"{period}, by {statistics.granularity}"


# ===== CHART RULES ===========================================================
def build_chart_rules_context(chart_rules: list[AiChartRule]) -> str:
    return "\n".join(describe_chart_rule(rule) for rule in chart_rules)


def describe_chart_rule(rule: AiChartRule) -> str:
    aggregations = ", ".join(rule.supported_aggregations)
    encodings = [
        describe_encoding_rule(encoding) for encoding in rule.encodings
    ]
    return "\n".join(
        [f"{rule.type} (aggregations: {aggregations})", *encodings]
    )


def describe_encoding_rule(rule: AiEncodingRule) -> str:
    label = f"{rule.key}, required" if rule.required else rule.key
    roles = ", ".join(rule.recommended_roles)
    if rule.supported_roles:
        roles += f"; also {', '.join(rule.supported_roles)}"
    return f"  {label}: {roles}"


# ===== HELPERS ===============================================================
def format_number(value: float) -> str:
    if abs(value) >= 1000:
        return f"{value:.0f}"
    return f"{value:.3g}"
