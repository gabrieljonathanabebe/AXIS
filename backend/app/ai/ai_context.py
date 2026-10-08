from app.ai.models import AiChartRule, AiEncodingRule
from app.datasets.models import (
    DatasetProfile,
    DimensionStatistics,
    Field,
    FieldProfile,
    MeasureStatistics,
    SemanticRole,
)


# ===== DATASET ===============================================================
def build_dataset_context(profile: DatasetProfile, fields: list[Field]) -> str:
    """
    Describe the dataset for Claude, one line per field.
    Args:
        profile: Profile with statistics of every field.
        fields: Current fields; their roles include the user's overrides.
    Returns:
        A row-count line followed by lines like
        "revenue | integer | measure | max 980, mean 412, ...".
    """
    roles = {field.name: field.semantic_role for field in fields}
    lines = [
        describe_field(field, roles.get(field.name, field.semantic_role))
        for field in profile.fields
    ]
    return f"rows: {profile.row_count}\n" + "\n".join(lines)


def describe_field(field: FieldProfile, role: SemanticRole) -> str:
    """Join name, physical type, role, values and missing count with " | "."""
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
    """
    Summarize the values of a field according to its role.
    Args:
        field: Profile of the field.
        role: Current role, possibly overridden by the user.
    Returns:
        Statistics for the role, or only the distinct count if the
        statistics belong to the detected role and no longer fit.
    """
    statistics = field.statistics
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
    """Describe the aggregations and encoding roles of every chart type."""
    return "\n".join(describe_chart_rule(rule) for rule in chart_rules)


def describe_chart_rule(rule: AiChartRule) -> str:
    """Describe one chart type: a header line, then one line per encoding."""
    aggregations = ", ".join(rule.supported_aggregations)
    encodings = [
        describe_encoding_rule(encoding) for encoding in rule.encodings
    ]
    return "\n".join(
        [f"{rule.type} (aggregations: {aggregations})", *encodings]
    )


def describe_encoding_rule(rule: AiEncodingRule) -> str:
    """Describe an encoding like "  x, required: dimension; also temporal"."""
    label = f"{rule.key}, required" if rule.required else rule.key
    roles = ", ".join(rule.recommended_roles)
    if rule.supported_roles:
        roles += f"; also {', '.join(rule.supported_roles)}"
    return f"  {label}: {roles}"


# ===== HELPERS ===============================================================
def format_number(value: float) -> str:
    """Round large numbers to integers and others to three digits."""
    if abs(value) >= 1000:
        return f"{value:.0f}"
    return f"{value:.3g}"
