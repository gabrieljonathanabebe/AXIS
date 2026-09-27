# Cevyn – Architecture

## 1. Architekturziele

Die Architektur von Cevyn soll:

- modular bleiben;
- externe Libraries vom Domain Model trennen;
- mehrere Produktmodi auf einem gemeinsamen Core ermöglichen;
- Visualisierungen unabhängig vom Renderer beschreiben;
- Data Handling auf Visual Analytics begrenzen;
- AI über validierte Cevyn Actions in den Core integrieren;
- Project State serialisierbar halten;
- spätere Persistenz und `.cevyn`-Dateien ermöglichen.

Cevyn wird zunächst als modularer Monolith entwickelt.

Microservices sind aktuell nicht vorgesehen.

## 2. High-Level Product Architecture

```mermaid
flowchart TB
    Shell[Visual Analytics Workspace]

    Shell --> Manual[Manual Build]
    Shell --> Ask[Ask Cevyn]
    Shell --> Explore[Explore]

    Manual --> Core[Shared Domain Core]
    Ask --> Actions[Cevyn Actions]
    Explore --> Actions
    Actions --> Core

    Core --> Dataset[Dataset Model]
    Core --> Profile[Profiles]
    Core --> Charts[Chart Specs]
    Core --> Dashboard[Dashboard State]
    Core --> Project[Project State]
```

Die Produktmodi sind unterschiedliche Zugänge zum selben Workspace.
Sie verwenden keine voneinander isolierten Datenmodelle.

## 3. App Shell

Die langfristige App Shell rahmt einen gemeinsamen
Visual-Analytics-Workspace:

```text
AppShell
├── TopBar
└── VisualAnalyticsWorkspace
    ├── Build Panel
    ├── Canvas
    └── Inspector
```

Data Understanding, Ask Cevyn und Explore werden als integrierte Modi
oder fokussierte Ansichten angebunden. Sie bilden keine unabhängige
Suite neben dem Visual-Analytics-Workspace.

### Manual Build

```text
Build Panel
→ Canvas
→ Inspector
```

### Ask Cevyn

```text
Natural Language
→ validated Cevyn Actions
→ ChartSpec / Dashboard State
```

### Explore

```text
Deterministic Candidate Insights
→ AI Ranking / Explanation
→ ChartSpec
```

## 4. Technical Stack

Aktueller bzw. geplanter Stack:

### Frontend

- React
- TypeScript
- Vite
- Apache ECharts
- dnd-kit
- Custom CSS
- Lucide React

Zustandsmanagement kann bei wachsender Komplexität zentralisiert
werden. Zustandstechnologie ist eine Implementierungsentscheidung und
nicht Teil des Domain Models.

### Backend

- FastAPI
- Python
- Polars für CSV-Daten und gruppierte Chart-Abfragen

Datasets liegen aktuell als Polars-DataFrames im In-Memory-Store.
Line-, Bar-, Pie- und Donut-Charts nutzen serverseitige
Gruppierungsaggregationen.
Scatter rendert bisher einen begrenzten Ausschnitt der Rohdaten.

Bei konkretem Bedarf vorgesehen:

- DuckDB
- NumPy, scikit-learn oder statsmodels für klar begrenzte statistische
  und spätere ML-Erweiterungen der visuellen Analyse

PostgreSQL kann später für Application Metadata und persistente
Projects verwendet werden.

## 5. Technical Architecture

```mermaid
flowchart TB
    UI[Visual Analytics Workspace]
    Core[Shared Domain Core]
    Adapter[ECharts Adapter]
    API[FastAPI API]
    Query[Visual Query Engine]
    Profile[Deterministic Profiling]
    Candidates[Candidate Insights]
    Prompt[Natural Language]
    AI[AI Ranking / Explanation]
    Actions[Validated Cevyn Actions]

    UI --> Core
    Core --> Adapter
    UI --> API
    API --> Query
    API --> Profile
    API --> Candidates
    Candidates --> AI
    Prompt --> AI
    AI --> Actions
    Actions --> Core

    Query --> Polars[Polars current]
    Profile --> Polars
    Candidates --> Polars

    API --> Metadata[Application Metadata]
    Metadata --> Postgres[PostgreSQL later]
```

Polars ist bereits im Einsatz. DuckDB ist noch nicht eingeführt.

Backend-Komponenten bleiben auf Profiling, Visual Queries, leichte
Transformationen und Candidate Generation begrenzt. Eine andere
Execution Engine wird erst bei einem konkreten Skalierungsbedarf
eingeführt.

AI erzeugt keine ECharts-Optionen. AI-Ausgaben werden als Cevyn Actions
validiert und verändern ausschließlich das bestehende Domain Model.

## 6. Chart Architecture

ECharts ist Rendering Engine und nicht das Cevyn-Produktmodell.

Der zentrale Datenfluss lautet:

```mermaid
flowchart LR
    UI[UI / Inspector]
    Spec[ChartSpec]
    Adapter[ECharts Adapter]
    Option[EChartsOption]
    ECharts[ECharts]

    UI --> Spec
    Spec --> Adapter
    Adapter --> Option
    Option --> ECharts
```

Regel:

```text
UI
→ Cevyn Domain Model
→ Renderer Adapter
→ Renderer
```

Raw ECharts Options sollen nicht unkontrolliert über React-Komponenten
verteilt werden.

### ECharts Adapter

Renderer-spezifischer Code liegt unter `src/chart/echarts`.

`createEChartOption` ist ein kleiner Orchestrator. Er kombiniert allgemeine
Optionen wie Titel, Tooltip, Legend und Interaktion mit dem
charttypspezifischen Content.

Chart-Content wird über eine typsichere Registry erzeugt:

```text
ChartType
→ ChartContentBuilder
→ Series sowie optionale Visual Maps und Achsen
```

Aktuell existieren getrennte Builder für:

- Scatter-Content auf Basis der geladenen Rohdaten;
- aggregierten Line-/Bar-Content auf Basis des Backend-Resultsets;
- radialen Pie-/Donut-Content auf Basis des Backend-Resultsets.

Neue Charttypen erhalten einen eigenen Builder oder verwenden einen
gemeinsamen Builder, wenn Datenvertrag und Renderingstruktur tatsächlich
identisch sind. Die Registry stellt sicher, dass jeder `ChartType` einem
Builder zugeordnet ist.

### Selection und Cross-Highlighting

ECharts-Events werden ausschließlich im Adapter in die Domain übersetzt
(`createSelectionFromEvent`). React-Komponenten sehen nur
`DataSelection`, keine ECharts-Event-Parameter.

```text
ECharts click
→ createSelectionFromEvent
→ DataSelection
→ selection/set
→ WorkspaceState.selection
→ alle Charts
```

Klickquellen:

- Line, Bar, Pie und Donut: Kategorie des X-Felds;
- Scatter: Kategorie eines kategorialen Color-Felds (Serienname).

Ein erneuter Klick auf dieselbe Kategorie oder ein Klick auf eine leere
Fläche im Chart hebt die Selection auf.

Die Selection gilt global und unabhängig davon, ob ein Chart das
Selection-Feld selbst codiert. Jeder Chart hebt den Anteil seiner eigenen
Kennzahl hervor, der auf die ausgewählten Zeilen entfällt:

- Line und Bar: Zusätzlich zur Basis-Query läuft eine Highlight-Query mit
  der Selection als Filter. Die Basis-Serien werden abgeblendet, die
  Highlight-Serien liegen auf einer versteckten zweiten X-Achse mit
  denselben Kategorien darüber. Die Highlight-Linie verbindet Lücken.
- Pie und Donut: Bei aktiver Selection werden nur die gefilterten Werte
  gezeigt. Die Farben hängen am Kategorienamen der Basis-Query.
- Scatter: Zeilen, die nicht zur Selection passen, werden im Frontend
  abgeblendet, ohne zusätzliche Query.

Der Tooltip benennt Highlight-Werte mit der ausgewählten Kategorie. Im
Quell-Chart entfallen die Highlight-Zeilen, weil sie dort die Basiswerte
nur wiederholen würden. Gemeinsame Konstanten wie die Abblend-Opacity
liegen in `content/selectionStyle.ts`.

## 7. ChartDefinition vs. ChartSpec

### ChartDefinition

Beschreibt Regeln eines Charttyps.

Beispiele:

- verfügbare Encodings;
- kompatible Semantic Types;
- verfügbare Inspector Properties;
- Defaults;
- Aggregation Rules.

### ChartSpec

Beschreibt die konkrete Instanz einer Visualisierung.

Beispiel:

```text
Line Chart

X = Date
Y = Revenue
Series = Country
Aggregation = Sum
```

ChartDefinition ist die Regel.

ChartSpec ist die konkrete Konfiguration.

## 8. Chart Instances und Workspace State

Für Multi-Chart-Dashboards bleiben Visualisierung und Layout getrennt:

```ts
type ChartLayout = {
  x: number
  y: number
  width: number
  height: number
}

type ChartInstance = {
  id: string
  type: ChartType
  spec: ChartSpec
  layout: ChartLayout
}
```

Der Workspace hält alle Chart-Instanzen, die Editor-Auswahl und die
Datenauswahl:

```text
WorkspaceState
├── charts: ChartInstance[]
├── selectedChartId: string | null
└── selection: DataSelection | null
```

```ts
type DataSelection = {
  sourceChartId: string
  field: string
  values: DataValue[]
}
```

Der Inspector arbeitet auf dem selektierten Objekt.

`selectedChartId` und `selection` sind getrennte Konzepte:

- `selectedChartId` ist die Editor-Auswahl und bestimmt, welchen Chart
  der Inspector bearbeitet.
- `selection` ist die Datenauswahl für Dashboard-Interaktion. Sie ist
  feldbasiert, an keine Achse gebunden und gilt für alle Charts
  (siehe Abschnitt 6, Selection und Cross-Highlighting).

### Workspace Actions

Änderungen am Workspace laufen ausschließlich über typisierte,
serialisierbare `WorkspaceAction`s und den reinen `workspaceReducer`
(`src/workspace/workspaceReducer.ts`):

```text
UI Event
→ WorkspaceAction
→ workspaceReducer
→ WorkspaceState
→ Render
```

Aktuelle Actions:

- `chart/add`, `chart/duplicate`, `chart/remove`, `chart/select`;
- `chart/setType`;
- `chart/updateAggregation`, `chart/updateEncoding`;
- `chart/updateAppearance`, `chart/updateMarkAppearance`;
- `chart/updateInteraction`;
- `chart/updateLayout`;
- `selection/set`, `selection/clear`.

`selection/set` wird ignoriert, wenn das Quell-Chart nicht existiert.
`chart/remove` verwirft die Selection, wenn ihr Quell-Chart entfernt
wird.

Regeln:

- Jede Chart-Action adressiert ihren Chart explizit über `chartId`.
- `update*`-Actions tragen einen `patch` statt einzelner Key/Value-Paare.
- Der Reducer bleibt deterministisch. Nicht-deterministische oder
  dataset-abhängige Werte wie neue IDs, Default Specs und freie
  Layout-Positionen werden vor dem Dispatch erzeugt und in der Action
  übergeben.
- Reiner UI-State wie Drag-Zustand oder selektiertes Field gehört nicht
  in den Workspace State.

Die Actions sind die gemeinsame Grundlage für manuelle Bedienung und
später für Ask Cevyn und Explore (siehe Abschnitt 16). Eine
Validierungsschicht für AI-generierte Actions ist noch nicht
implementiert.

### Canvas Layout

`ChartLayout` wird in Grid-Zellen angegeben, nicht in Pixeln. Die Canvas
verwendet ein 24-spaltiges Grid mit fester Zeilenhöhe
(`src/workspace/chartLayout.ts`).

- Neue und duplizierte Charts werden auf der ersten freien Fläche
  platziert.
- Move und Resize sind reine Layout-Funktionen mit Grenzen für
  Grid-Rand und Mindestgröße.
- Während eines Drags wird nur eine lokale Vorschau gerendert. Beim
  Loslassen entsteht genau eine `chart/updateLayout`-Action.
- Überlappende Charts werden aktuell nicht automatisch aufgelöst.

### Drag and Drop

Drag Sources und Drop Targets beschreiben ihre Bedeutung über typisierte
Daten statt über ID-Strings:

- `DragPayload`: `field`, `chart-type` oder `chart-layout`;
- `DropTarget`: `canvas` oder `encoding` mit `chartId` und
  `encodingKey`.

## 9. Inspector Architecture

Chart Inspector:

```text
Inspector
├── Data
├── Appearance
└── Interaction
```

### Data

Beschreibt, welche Daten verwendet werden.

Beispiele:

- X
- Y
- Color
- Size
- Series
- Aggregation
- Stack
- Sort

### Appearance

Beschreibt visuelle Darstellung.

Beispiele:

- Mark / Series
- Labels
- Grid
- Axes
- Legend
- Color Scale

### Interaction

Beschreibt Verhalten.

Beispiele:

- Tooltip
- Hover / Emphasis
- Zoom
- Selection
- Animation
- Legend Interaction

## 10. Encoding Semantics

Diskrete und kontinuierliche Encodings müssen unterschieden werden.

### Discrete

Beispiel:

```text
Color = Country
```

Darstellung:

```text
Legend
```

### Continuous

Beispiel:

```text
Color = Revenue
```

Darstellung:

```text
Color Scale
```

ECharts kann dafür intern `visualMap` verwenden.

Der Begriff `visualMap` soll jedoch nicht das Cevyn Domain Model
bestimmen.

### Color Channel Ownership

Ein explizites Color-Encoding besitzt Vorrang vor Series:

- numerisches Color verwendet eine kontinuierliche Color Scale;
- diskretes Color verwendet eine kategorische Palette und Legend;
- ohne Color kann Series den kategorischen Farbkanal übernehmen.

Series bleibt bei gleichzeitigem numerischem Color als Gruppierung erhalten,
besitzt aber nicht mehr den Farbkanal. Deshalb wird in diesem Fall keine
farbige Series-Legend angezeigt.

## 11. Data Architecture

Der Datenfluss ist auf Visual Analytics begrenzt. Er unterstützt
Verständnis, Visual Queries und leichte Vorbereitung, aber keine
allgemeinen ETL-Pipelines.

```mermaid
flowchart LR
    Source[Dataset]
    Filter[Filter]
    Calculate[Calculate]
    Aggregate[Aggregate]
    Sort[Sort]
    Result[Analytical Result]
    Visual[Visualization]

    Source --> Filter
    Filter --> Calculate
    Calculate --> Aggregate
    Aggregate --> Sort
    Sort --> Result
    Result --> Visual
```

Nicht jeder Workflow benötigt jeden Schritt.

### Deterministic Profiling

Profiling wird zunächst im Python-Backend ausgeführt:

```text
Dataset
→ Physical und Semantic Types
→ Summary Statistics
→ Missing Values und Duplicates
→ Profile Result
```

Profile Results sind deterministische Datenprodukte. AI kann sie
priorisieren und erklären, berechnet sie aber nicht selbst.

### Aggregated Chart Query

Line-, Bar-, Pie- und Donut-Charts verwenden ein gruppiertes
Backend-Resultset. Der Request enthält:

- `x` und `y`;
- optional `series`;
- `aggregation` für den Y-Wert;
- optional `color` und `color_aggregation`;
- `filters` als Liste von `{ field, values }`.

Filter werden vor der Gruppierung angewendet und untereinander mit UND
verknüpft. Der Vergleich erfolgt auf dem als String gecasteten Feldwert,
damit Kategorien aus dem Resultset direkt als Filterwerte dienen können.
Unbekannte Filterfelder werden wie andere Felder mit 422 abgelehnt.

Das Resultset enthält pro Gruppe:

- `x`;
- optional `series`;
- `value`;
- optional `color_value`.

`color_value` ist ein zusätzlich aggregiertes Ergebnisfeld und verändert
weder die Gruppierung noch `value`. Color darf dasselbe Feld wie Y mit einer
eigenen Aggregation redundant codieren, aber nicht dasselbe Feld wie X oder
Series verwenden.

Der Request wird in der Chart-Domäne aus der `ChartInstance` abgeleitet
(`createChartQuery`) und nicht in React-Komponenten zusammengesetzt. Bei
aktiver Selection leitet `createHighlightQuery` daraus eine zweite
Query ab, die die Selection als Filter trägt. Die Basis-Query bleibt
dabei unverändert und wird nicht erneut geladen.

### Explore Candidate Pipeline

Explore verwendet denselben Daten- und Chartpfad wie manuell erstellte
Visualisierungen:

```text
Dataset und Profile Results
→ Python Candidate Generation
→ Candidate Insights
→ AI Ranking / Explanation
→ validated Cevyn Actions
→ ChartSpec
→ ECharts Adapter
```

Candidate Generation bleibt deterministisch. AI priorisiert und
erklärt Kandidaten, erzeugt aber weder analytische Ergebnisse noch
direkten ECharts-Code.

## 12. Calculated Fields

Calculated Fields sind Row-Level Expressions.

Sie bleiben auf leichte Ableitungen begrenzt, die für Encodings,
Aggregationen und visuelle Analyse benötigt werden.

Beispiel:

```text
Home Goals + ":" + Away Goals
→ Result
```

Die Definition soll unabhängig von Python, Polars oder SQL gespeichert
werden.

Konzeptionelles AST:

```ts
{
  type: "concat",
  values: [
    {
      type: "field",
      field: "home_goals"
    },
    {
      type: "literal",
      value: ":"
    },
    {
      type: "field",
      field: "away_goals"
    }
  ]
}
```

Execution:

```mermaid
flowchart LR
    AST[Cevyn Expression AST]
    Compiler[Expression Compiler]

    AST --> Compiler
    Compiler --> Polars[Polars Expression]
    Compiler --> SQL[DuckDB SQL]
```

Die konkrete Engine kann sich ändern, ohne das gespeicherte
Calculated Field zu verändern.

## 13. Calculated Fields vs. Metrics

```mermaid
flowchart LR
    Raw[Raw Rows]
    Calc[Calculated Field]
    Rows[Derived Rows]
    Agg[Metric / Aggregation]
    Result[Analytical Result]

    Raw --> Calc
    Calc --> Rows
    Rows --> Agg
    Agg --> Result
```

Calculated Field:

```text
row → row
```

Metric:

```text
rows → aggregated value
```

## 14. Semantic Types

Physical Type und Semantic Type sollen getrennt betrachtet werden.

Beispiele Physical Types:

- integer
- float
- string
- boolean
- date
- datetime

Beispiele Semantic Types:

- numeric
- categorical
- temporal
- identifier

Später möglich:

- geographic
- text

Chart-Kompatibilität soll primär auf Semantic Types basieren.

## 15. Compatibility

Fields können für einen Slot unterschiedliche Kompatibilität besitzen:

```text
recommended
supported
invalid
```

Inkompatible Fields sollen nicht zwingend global versteckt werden.

Drop Targets können den Zustand visuell kommunizieren.

## 16. Shared State Across Product Modes

Alle Produktmodi verwenden denselben Shared Core.

```mermaid
flowchart TB
    Core[Shared Data Model]

    Manual[Manual Build]
    Ask[Ask Cevyn]
    Explore[Explore]

    Manual --> Core
    Ask --> Core
    Explore --> Core

    Core --> Result[Fields / Metrics / ChartSpecs / Dashboard State]

    Result --> Manual
    Result --> Ask
    Result --> Explore
```

Eine manuelle Änderung, ein AI Command und ein Explore-Vorschlag
erzeugen dieselben Actions und ChartSpecs. Dadurch bleiben Ergebnisse
editierbar und zwischen den Modi konsistent.

Implementiert ist aktuell die Action-Grundlage für Charts im Workspace
(siehe Abschnitt 8). Ask Cevyn und Explore nutzen sie noch nicht.

## 17. Project State

Langfristiges Domain Model:

```text
Project
├── Dataset[]
├── DataProfile[]
├── LightTransformation[]
├── CalculatedField[]
├── Metric[]
├── ChartInstance[]
├── Dashboard[]
├── SharedFilter[]
└── SelectionState
```

Vom `SelectionState` existiert aktuell eine erste Form als `selection`
im `WorkspaceState` (Abschnitt 8).

Ein Wert soll möglichst einmal definiert und anschließend
wiederverwendet werden.

Beispiel:

```text
Profit = Revenue - Cost

├── Bar Chart
├── KPI
└── Dashboard Filter
```

## 18. Persistence

Project State soll serialisierbar bleiben.

Dadurch können unterschiedliche Persistence Targets denselben State
verwenden.

```mermaid
flowchart LR
    State[Project State]
    Serialize[serializeProject]

    State --> Serialize

    Serialize --> Local[Local Storage]
    Serialize --> File[.cevyn File]
    Serialize --> Backend[Backend Persistence]
    Serialize --> Cloud[Cloud Project later]
```

Gegenrichtung:

```text
deserializeProject()
→ Project State
→ React renders Workspace
```

## 19. `.cevyn` Project Format

Die erste Version kann ein JSON-basiertes Format sein.

Beispiel:

```json
{
  "format": "cevyn",
  "version": 1,
  "project": {},
  "datasets": [],
  "dashboard": {}
}
```

Von Anfang an muss eine Formatversion vorhanden sein.

```text
format
version
```

Dadurch können später Migrationspfade für ältere Projektdateien
implementiert werden.

Langfristig kann `.cevyn` ein Container sein:

```text
project.cevyn
├── manifest.json
├── project.json
├── dashboard.json
├── data/
│   └── dataset.parquet
└── assets/
    └── image.png
```

Diese Containerstruktur ist kein MVP-Ziel.

## 20. Architekturprinzip

Bei neuen Features zuerst fragen:

> Gehört diese Funktion in das bestehende Domain Model oder entsteht
> gerade unnötig eine zweite parallele Struktur?

Gemeinsame Konzepte sollen zentral modelliert und von Manual Build,
Ask Cevyn und Explore wiederverwendet werden.
