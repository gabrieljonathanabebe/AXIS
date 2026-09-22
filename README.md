# Cevyn

Cevyn is a visual data analytics platform for transforming raw data
into analysis, visualizations, interactive dashboards and, eventually,
machine-learning workflows.

The goal is to provide a visual-first analytics workflow without
requiring users to write Python, SQL or a proprietary query language
for common analytical tasks.

> Cevyn is currently under active development.

## Product Direction

The long-term workflow is:

```text
Import
→ Understand
→ Clean
→ Transform
→ Calculate
→ Analyze
→ Visualize
→ Build Dashboard
→ Save / Share
→ ML / AI
```

Cevyn is organized around several product workspaces:

- **Visualize** — charts, dashboards, KPIs and interactions
- **Data** — data inspection, profiling, cleaning and transformations
- **AI** — forecasting, clustering, anomaly detection and ML
- **Share** — project files, exports and published dashboards

The current development focus is the Visualization Core and the
transition toward the first complete Data-to-Dashboard workflow.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Apache ECharts
- dnd-kit
- Lucide React
- Custom CSS

### Backend

- FastAPI
- Python

Planned analytical infrastructure includes DuckDB and Polars when the
current data layer reaches its practical limits.

## Documentation

The repository documentation acts as the project's source of truth:

- [Product Vision](docs/PRODUCT_VISION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Development Guidelines](docs/DEVELOPMENT.md)
- [Roadmap](docs/ROADMAP.md)

Instructions for coding agents are defined in
[AGENTS.md](AGENTS.md).

## Status

Cevyn is currently in active development and is not yet intended for
production use.
