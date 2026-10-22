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

Die App Shell rahmt die Workspaces über eine globale TopBar und eine
Navigation Rail:

```text
AppShell
├── TopBar (Branding, später Workspace/Team, Account, Settings)
└── AppBody
    ├── NavigationRail (Top-Level-Views)
    └── Active View
        ├── Visualize Workspace
        │   ├── Build Panel
        │   └── Canvas (Bearbeitung am Objekt: Format-Popover, Toolbar)
        └── Data Workspace
            └── Data Panel (Profile | Table)
```

Der aktive Workspace (`WorkspaceView`) ist UI-State in
`useWorkspaceLayout`, nicht Teil des Workspace-Reducers und nicht
undo-fähig. Beide Workspaces bleiben gemountet und werden über `hidden`
umgeschaltet, damit Chart-Instanzen und lokaler UI-Zustand erhalten
bleiben.

Data und Visualize arbeiten auf demselben Dataset. `useDatasets` lädt
beim Start das Demo-Dataset aus dem Backend und nach einem Upload das
neue Dataset; Summary und `DatasetProfile` werden gemeinsam geladen und
gemeinsam gesetzt. Rows lädt das Frontend nicht als Ganzes: jede Ansicht
fragt im Backend genau das ab, was sie zeigt (Table: eine Seite Rows,
aggregierte Charts: Gruppen, Scatter: ein Sample). Der Data Workspace
hat keine eigene Dataset- oder Upload-Logik. Profile-Ansicht und Build Panel gruppieren
Fields über das `DatasetProfile` und dieselben Semantic Role Overrides
(siehe Abschnitt 11); die Table View liest daraus Role, Physical Type
und Verteilung. Ask Cevyn nutzt es als Kontext für Claude (siehe Ask
Cevyn).

Die Table lädt Rows seitenweise über die Table Query und rendert nur
die sichtbaren Zeilen; Sortierung und Table Filter laufen im Backend
über den ganzen Datensatz (siehe Table Query).

Ask Cevyn und Explore werden als integrierte Modi oder fokussierte
Ansichten angebunden. Sie bilden keine unabhängige Suite neben dem
Visual-Analytics-Workspace.

### Manual Build

```text
Build Panel
→ Canvas
→ Format-Popover am Objekt
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
- Anthropic Python SDK für AI Commands (Claude Sonnet 5.5)

Datasets liegen aktuell als Polars-DataFrames im In-Memory-Store.
Das Demo-Dataset ist ein reguläres Backend-Dataset: `demo.csv` wird beim
Start über `lifespan` mit der festen ID `demo` registriert, über
denselben Weg wie ein Upload (`read_csv_frame`, `register_dataset`).
Line-, Bar-, Pie- und Donut-Charts nutzen serverseitige
Gruppierungsaggregationen.
Scatter lädt Einzelpunkte über die Points Query, ab 2.000 Rows als
Sample; die Table lädt seitenweise über die Table Query.

Bei konkretem Bedarf vorgesehen:

- DuckDB
- NumPy, scikit-learn oder statsmodels für klar begrenzte statistische
  und spätere ML-Erweiterungen der visuellen Analyse

PostgreSQL kann später für Application Metadata und persistente
Projects verwendet werden.

### Code-Struktur

Frontend und Backend sind nach Domänen gegliedert, nicht nach
Dateiarten. Eine Domäne bündelt alles, was zu ihr gehört: Komponenten,
Hooks, Logik, Types und API-Zugriff.

Backend (`backend/app/`):

```text
main.py      App, CORS, Lifespan, Router-Registrierung
datasets/    Upload, Store, Schema Detection, Profiling
queries/     Chart-, Points-, Table- und Field-Values-Query, filters.py
ai/          Ask Cevyn: Claude-Aufruf und Kontext
```

- Jede Domäne hat ein eigenes `router.py` (Endpoints) und `models.py`
  (Pydantic Request/Result); die Logik liegt in eigenen Modulen
  daneben. `main.py` enthält keine Endpoints.
- `queries/filters.py` baut Filter-Ausdrücke und prüft Filter; Chart-
  und Table Query nutzen dieselben Funktionen.

Frontend (`frontend/src/`):

```text
app/         App Shell, Commands, Workspace-Layout
shared/      API-Client, UI-Controls, Formatierung, Text-Stil, Hooks
datasets/    Dataset laden, Profil, Semantic Roles, Data Panel
table/       Table View, Table Query, Table Filter
charts/      Chart Registry, ChartItem (Content), Queries, echarts/ (Adapter),
             format/ (Format-Popover und Widgets), data/ (Encodings, Aggregation)
objects/     Dashboard-Objekte: Modell, Registry, ObjectFrame, ObjectPicker,
             Format-Popover-Hülle, Container- und Titel-Widget
workspace/   Workspace State, Reducer, History, Canvas, Drag and Drop,
             Dashboard-Einstellungen
ai/          Ask Cevyn
actions/     Action Layer (Cevyn Actions)
```

- Jede Domäne hat eine `types.ts`. Backend-Zugriffe liegen in
  `<domäne>Api.ts` (z. B. `chartsApi.ts`) und laufen über
  `shared/api/client.ts` (`get`, `post` für FormData, `postJson` für
  JSON-Requests).
- Unterordner gibt es aktuell für abgegrenzte Gruppen innerhalb einer
  Domäne (z. B. `charts/echarts/content`, `charts/format`,
  `shared/ui`). Eine feste Regel für Unterordner ist noch nicht
  beschlossen.
- Styles liegen aktuell noch zentral unter `src/styles/<bereich>/`.

Abhängigkeitsrichtung im Frontend (beschlossen): Imports zeigen nur
nach unten, Objekt-Domänen importieren nie voneinander.

| Schicht | Ordner                                           | Inhalt                                                                            |
| ------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1       | `shared/`                                        | domänenfrei: UI-Controls, API-Client, Werteformatierung, generische Hooks         |
| 2       | `datasets/`, `queries/` (geplant)                | Daten-Vokabular: Fields, Semantic Roles, Aggregation, Filter                      |
| 3       | `objects/`                                       | was alle Dashboard-Objekte teilen: Frame, Layout, Container, Format-Popover-Hülle |
| 4       | `charts/`, `cards/`, `table/`, später `slicers/` | was nur ein Objekttyp braucht                                                     |
| 5       | `workspace/`, `app/`, `actions/`, `ai/`          | Orchestrierung; darf aus allen Schichten importieren                              |

- Faustregel: Braucht es nur ein Objekttyp, liegt es in dessen Ordner.
  Brauchen es mehrere, liegt es in der untersten Schicht, deren
  Bedeutung passt (domänenfrei → `shared/`, Daten oder Abfrage →
  `queries/`, Objekt → `objects/`).
- Ausnahme: Die Verteiler nach `kind` in `objects/` kennen alle
  Objekttypen (Union in `types.ts`, `objectDefinitions`,
  `createObject`, `getObjectLabel`). Sie bleiben klein und erhalten pro
  neuem Typ einen Fall.
- `queries/` spiegelt `backend/app/queries/`: gemeinsames Vokabular
  aller Queries (Aggregation, Filter), das Chart, Card, Table und Slicer
  teilen.

Laden von Backend-Daten: `shared/useQuery` kapselt das gemeinsame
Ladeverhalten. Der Hook lädt neu, sobald sich der Inhalt des Requests
ändert, verwirft veraltete Antworten und lädt bei `request === null`
nichts. Mit `keepPreviousResult` bleibt das letzte Ergebnis bis zur
neuen Antwort sichtbar. `useChartQuery`, `usePointsQuery` und
`useFieldValues` sind dünne Wrapper darum; `useTableRows` bleibt
eigenständig, weil es Seiten nachlädt.

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
    UI[UI / Format-Popover]
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

Renderer-spezifischer Code liegt unter `src/charts/echarts`.

`createEChartOption` ist ein kleiner Orchestrator. Er kombiniert allgemeine
Optionen wie Tooltip, Legend und Interaktion mit dem
charttypspezifischen Content.

### Zahlen- und Datumsformatierung

Zahlen und Datumswerte werden nur über `src/shared/format/`
formatiert (`formatNumber.ts`, `formatDate.ts`). Eigene
`Intl.NumberFormat`- oder `Intl.DateTimeFormat`-Instanzen außerhalb
davon gibt es nicht. Die Locale steht als `LOCALE` in
`src/shared/config.ts`, der Sammelstelle für app-weite
Frontend-Einstellungen; Domain-Konstanten bleiben in ihrem Ordner.

Ein Zahlenformat ist der Baustein `NumberFormat` aus
`src/shared/format/valueFormats.ts` (`style`, `currency`, `decimals`,
`compact`, `prefix`, `suffix`). Ihn tragen die Achsenbeschriftung
(`AxisLabelsAppearance.numberFormat`), der Card-Wert, die Datenlabels
und der Tooltip (`interaction.tooltip.numberFormat`). Ob eine Achse
Zahlen oder Datumswerte zeigt, ist ein eigenes Feld
(`AxisLabelsAppearance.valueType`), kein Teil des Zahlenformats.

`createNumberFormatter(format)` baut daraus einen Formatter auf Basis von
`Intl.NumberFormat`; `decimals: null` lässt den Stil entscheiden
(Number und Currency höchstens 2, Percent 1). `auto` formatiert wie
`number`, Orte mit eigenem Standard lösen es vorher auf:

- die Achse überlässt die Labels bei `auto` ECharts;
- der Card-Wert zeigt bei `auto` kompakt (`formatCompactNumber`);
- Datenlabels (Bar, Line, Scatter) und Tooltip übernehmen bei `auto`
  das ganze Format der Y-Achse (`resolveNumberFormat`,
  `createLabelNumberFormatter`); Pie zeigt Anteile (`{d}%`);
- die Enden der Colorbar nutzen `formatCompactNumber`;
- Datumsachsen nutzen `formatDate` wie Table und Filter.

### Text-Formatierung

Alle Texte auf der Canvas nutzen denselben Typ `TextStyle` aus
`src/shared/textStyle.ts` (`color`, `fontSize`, `fontStyle`,
`fontWeight`). Jedes Text-Element trägt ihn als `textStyle`, die Achse
zusätzlich als `titleStyle`; Extras wie Ausrichtung, Rotation, Position
oder Zahlenformat bleiben Felder des Elements.

- ECharts-Texte (Achsen, Legende, Data Labels) übersetzt
  `createTextStyleOption` im Adapter; HTML-Texte (Titel, Card-Wert,
  Selection-Label) setzt `getTextStyleCss` als Inline-Style
- `FONT_WEIGHT_VALUES` bildet `light | medium | bold` auf 200/500/800 ab,
  für CSS, ECharts und die Canvas-Messung der Legende
- der Titel ist `ObjectTitleAppearance` in `objects/types.ts`, weil
  alle Objekttypen ihn teilen; seinen Standard erzeugt
  `createDefaultTitle` in `objects/objectDefaults.ts`
- Sichtbarkeit eines dargestellten Elements heißt `visible`; `enabled`
  steht nur für Interaktion (Tooltip, Zoom, Animation, Legend-Auswahl)

Linien und Umrisse folgen demselben Muster: `StrokeStyle` aus
`src/shared/strokeStyle.ts` (`color`, `lineStyle`, `opacity`, `width`;
`LineStyle` liegt ebenfalls dort). Ihn nutzen der Rahmen des Containers
(`ObjectContainer.border`) und die Gridlines jeder Achse
(`GridAppearance.stroke`). Linien-Marks tragen `SeriesStrokeStyle`
(`StrokeStyle` ohne `color`), weil ihre Farbe aus der Serie kommt
(Palette oder `appearance.color`); `hasStrokeColor` unterscheidet beide.

- ECharts-Linien übersetzt `createStrokeStyleOption` im Adapter; bei
  Serien setzt der Aufrufer die Serienfarbe und multipliziert die
  Deckkraft mit dem Dimming der Selection
- HTML-Umrisse setzt `getStrokeBorderCss`

Flächen nutzen `Fill` aus `src/shared/fill.ts` (`kind: 'solid'`,
`color`, `opacity`); weitere Varianten wie Verläufe kommen als neue
`kind` hinzu. Die Fläche unter Linien (`line.area`, mit `areaFill` als
Sichtbarkeit) und Scatter-Punkte tragen `SeriesFill` ohne Farbe: Jede
Fläche nimmt die Farbe ihrer Serie (Palette oder `appearance.color`),
der Adapter setzt sie in `createAggregatedSeriesOption` wie bei der
Linie. `Fill` mit eigener Farbe hat derzeit keinen Nutzer und bleibt
als allgemeiner Typ (`hasFillColor` unterscheidet beide). ECharts übersetzt
`createFillOption`; eine CSS-Übersetzung folgt mit dem ersten
HTML-Nutzer. Der Container-Hintergrund bleibt `ObjectBackground`.

### Farbwerte

Jedes Farbfeld der Specs ist ein `ColorValue` aus
`src/shared/colorValue.ts`: `{ kind: 'token'; token }` folgt dem Theme,
`{ kind: 'custom'; color }` ist eine feste Hex-Farbe. Das gilt für
`TextStyle`, `StrokeStyle`, `Fill`, `ObjectBackground` mit
`kind: 'color'`, die Chartfarbe (`appearance.color`), die Enden der
kontinuierlichen Farbskala und `legend.inactiveColor`. Auch die
kategorische Palette ist `ColorValue[]`
(`colorScale.categorical.palette`): „Default“ besteht aus
`chart1`–`chart5`, die übrigen Presets (Vivid, Pastel, Contrast) aus
festen Farben; `resolvePalette` löst sie im Adapter auf.

- `ColorToken` hat fachliche Namen: Struktur (`text`, `textMuted`,
  `accent`, `gridLine`, `border`, `inactive`) und Daten
  (`chart1`–`chart5`); `COLOR_TOKEN_VARIABLES` ordnet jedem Token seine
  CSS-Variable aus `styles/themes.css` zu, damit gespeicherte Specs
  nicht an CSS-Namen hängen
- Standardwerte folgen dem Theme: Texte, Gridlines, Container-Rahmen
  und Legend-Inactive nutzen Struktur-Tokens, Markfarbe und
  Default-Palette die Daten-Tokens; nur die Enden der kontinuierlichen
  Farbskala sind `custom`
- Standardwerte liegen als Konstanten bei der Domain, die sie
  erzeugt: `objects/objectDefaults.ts` für alle Objekttypen
  (`TITLE_TEXT_STYLE`, `CONTAINER_BORDER`, `createDefaultTitle`,
  `createDefaultContainer`), `createChartInstance` für Charts
  (`CHART_TEXT_STYLE`, `CHART_GRID_LINES`), `createCardInstance` für
  Cards (`CARD_VALUE_TEXT_STYLE`, `CARD_SELECTION_LABEL_TEXT_STYLE`).
  Format-Widgets lesen daraus das „Default“-Feld des Farbwählers, damit
  es dem Ausgangszustand neuer Objekte entspricht
- HTML löst über `getColorCss` auf (`var(--…)` bzw. Hex); die
  CSS-Helper `getTextStyleCss` und `getStrokeBorderCss` nutzen ihn
- ECharts kennt keine CSS-Variablen: `readChartTheme` in
  `EChartCanvas` liest die aktuellen Werte in `ChartTheme.colors`,
  `resolveColor` im Adapter löst damit auf. `theme` hängt am
  `ChartContentContext`; `createTextStyleOption`,
  `createStrokeStyleOption` und `createFillOption` nehmen es als
  zweiten Parameter
- geplant: `{ kind: 'rule' }` für bedingte Formatierung und
  `{ kind: 'series' }` für Elemente, die der Serienfarbe folgen; beide
  sind neue Varianten ohne Formänderung
- `data-theme` steht fest auf `dark` in `index.html`; einen Umschalter
  gibt es noch nicht. Bei einem Theme-Wechsel müssten die Charts neu
  rendern, weil ECharts aufgelöste Farben erhält

### Container vs. Content

Jedes Objekt auf der Canvas besteht aus einem generischen Frame und
einem Content pro Objekttyp:

- `ObjectFrame` (`objects/`) besitzt den Container für jedes Objekt:
  Background, Rahmen, Radius, Padding, Position und Größe, Auswahl- und
  Hover-Ring, Fokus und Tastatur, Layout-Handles, Aktionsleiste und die
  Format-Region. Am Frame hängt `data-object-id`.
- `ChartItem` (`charts/`) ist der Content eines Charts: ECharts-Canvas,
  Titel-Header, Inline-Editing der Achsentitel und Drop-Slots für
  Felder. Es rendert ein Fragment direkt in den Frame, damit Rechtecke
  aus ECharts (`offsetLeft`/`offsetTop`) relativ zum Frame bleiben.
- ECharts besitzt nur den Inhalt des Plots: Grid, Achsen, Series,
  Labels, Legend, Tooltip, Visual Map, Zoom und Brush.

`ChartGrid` setzt beides zusammen: Der Frame erhält Objekt, Layout,
Auswahl und `label` (bei Charts `getChartTitle`), der Content kommt über
`children` als Funktion, die `showFormatHint` des Frames erhält. Ein
neuer Objekttyp liefert nur seinen Content; Auswahl, Verschieben,
Löschen und Format-Regionen kommen vom Frame. Die CSS-Klassen
(`chart-item*`, `--chart-*`) sind noch nicht in Frame und Content
getrennt; das folgt mit dem zweiten Objekttyp.

Container-Eigenschaften erreichen ECharts nicht. Die Option setzt
`backgroundColor: 'transparent'`, damit die Container-Fläche
durchscheint.

Der Charttitel wird als HTML-Header im `ChartItem` gerendert, nicht als
ECharts-`title`. Er bleibt Teil der `ChartSpec`
(`appearance.title`), weil er den Inhalt beschreibt. Der automatische
Titel („Y by X“) wird in `src/charts/getChartTitle.ts` abgeleitet und
von Header, Inline-Editing und `aria-label` gemeinsam genutzt. Dort
liegt auch `getDefaultAxisTitle` (X: Feldname, Y: Value Label wie
„Count of country“); es spiegelt die Achsennamen im Adapter und dient
Popover und Inline-Editing als Platzhalter.

Die Achsentitel rendert weiterhin ECharts. Für das Inline-Editing
übersetzt der Adapter (`createAxisTitleEditFromEvent.ts`) Klick und
Hover auf `axisName` in ein Domain-Event `AxisTitleEdit` mit Achse und
Bounding Box. `ChartItem` legt darüber ein `InlineTextInput` bzw. eine
Hover-Fläche. Während der Bearbeitung blendet `syncAxisTitleEdit` den
Original-Titel aus; ECharts-spezifische Aufrufe bleiben im Adapter.

```text
ECharts click/mouseover (axisName)
→ createAxisTitleEditFromEvent
→ AxisTitleEdit
→ ChartItem Overlay
→ chart/updateAppearance
```

Das Formatieren am Objekt startet über den Command `object.format`
(Pinsel in der Canvas-Toolbar). Er öffnet das Popover mit dem Element
`container` (das Objekt als Ganzes) oder schließt es; das Objekt als Anker findet
`App` über `data-object-id` am `ObjectFrame`. Solange das Popover für
ein Objekt offen ist, ist es im Format-Modus: Achsentitel, Achsen-Labels,
Legende und Marks melden ihren Hover über Adapter-Events
(`createAxisTitleEditFromEvent`, `createFormatHintFromEvent`; beide
messen mit `getElementRect`). Gemessen wird das Element als Ganzes: die
Legende bis zur Wurzel, die Labels einer Achse als ihre Label-Gruppe
(erste Gruppe über dem gehoverten Text). Marks sind die Ausnahme:
gemessen wird die Form unter dem Pointer (Punkt, Balken, Segment, bei
Linien der ganze Pfad), der Klick wählt trotzdem alle Marks des Charts.
Linien melden Events über `triggerEvent`; diese Events haben keinen
`dataIndex` und erzeugen deshalb keine Selection
(`createSelectionFromEvent`). Der HTML-Titel meldet sich
über `EditableText` (`onPointerEnter`) und misst sich mit
`getRectInFrame` (`objects/elementRect.ts`). Alle liefern ein `ElementRect` in
Koordinaten des Frames an `showFormatHint`. Der Frame hält genau einen
`formatHint` (`element`, `rect`) und zeigt im Format-Modus dafür eine
Region. Ein Klick darauf meldet nur Element und Frame als Anker nach
oben (`onFormatElement`); Frame und Content kennen keine
Format-Widgets.

```text
Pinsel (object.format)
→ App.openObjectFormat: Anker per data-object-id, Element container
Region im Format-Modus (ObjectFrame)
→ onFormatElement(element, anchor) → ChartGrid ergänzt objectId
beide
→ App: formatTarget (React State, nicht im Reducer)
→ ChartFormatPopover (charts/format/): Element-Auswahl + Abschnitte
→ chartActions.setAppearance → chart/updateAppearance
```

- `FormatTarget` (`objects/types.ts`) ist `anchor`, `element` und
  `objectId`. `ObjectFormatElement` ist die Union der formatierbaren
  Elemente aller Objekttypen (`ChartFormatElement | CardFormatElement`).
  Beide enthalten `ContainerFormatElement` (`'container'`, in
  `objects/types.ts`): das Objekt als Ganzes, im Dropdown „Chart“ bzw.
  „Card“, mit `ContainerWidget` (Background, Padding, Radius, Rahmen).
  Gewählt wird es im Format-Modus per Klick auf eine freie Fläche: Der
  Frame behandelt jeden Klick, der keinen Button und kein Handle trifft,
  als `container`; eine Region gibt es dafür nicht, nur eine Anzeige
  ohne Pointer-Events. Beim Container blenden `syncFormatFocus` und
  `getFormatFocusClassName` nichts ab.
- `ChartFormatElement` (`charts/types.ts`) sind die formatierbaren
  Elemente eines Charts: Schlüssel von `ChartAppearanceSpec`
  (`legend | title | xAxis | yAxis`) plus `xAxisLabels | yAxisLabels`
  für die Tick-Labels unter `xAxis.labels` bzw. `yAxis.labels` und
  `marks` für Farbe, Palette und die Marks des Charttyps (`color`,
  `colorScale.categorical`, `scatter`, `line`, `bar`).
  `ChartFormatPopover` ordnet sie in `getFormatSections` per `switch`
  ihren Abschnitten zu (`FormatSection`: Name, optionales Icon,
  Inhalt); Achse und Labels teilen `AxisWidget` mit `part`
  (`title` | `labels`) und dieselbe `AxisAppearance`, `marks` nutzt
  `MarkSeriesWidget`. Weitere Abschnitte gehören zum
  Element, das sie betreffen: `xAxis` und `yAxis` haben „Gridlines“
  (`AxisAppearance.gridLines`, im Adapter `splitLine` der Achse),
  `xAxis` zusätzlich „Zoom“ (`interaction.zoom`, wirkt auf die
  X-Achse), `legend` „Interaction“ (`interaction.legend`), `marks`
  „Labels“ (`appearance.labels`, Datenlabels sind kein eigenes Element,
  weil ein Klick auf ein Label als Serien-Event ohnehin bei den Marks
  landet).
- `getFormatElements(chart, fields)` (`charts/`) bestimmt, welche
  Elemente ein Chart hat: Container, Titel, Marks und Tooltip immer,
  Achsen und ihre Labels nur kartesisch, Legende wie `isLegendRelevant`,
  Color Scale bei kontinuierlicher Farbe (`getColorEncodingMode`).
  Tooltip und Color Scale haben keine Region, sie sind nur über das
  Dropdown erreichbar: Der Tooltip existiert nicht als Element im Chart,
  die ECharts-`visualMap` liefert keine Maus-Events und ist ohne
  interne APIs nicht auffindbar. Die Element-Auswahl im Popover setzt nur
  `formatTarget.element`.
- `formatTarget` ist flüchtiger Editor-Zustand: nicht undo-fähig, mit
  DOM-Anker, deshalb nicht im Workspace-Reducer. Das Popover gilt nur
  für das ausgewählte Objekt und schließt, sobald sich die Auswahl
  ändert. Pinsel, Region und Element-Auswahl schreiben denselben
  Zustand; der Format-Modus hat keinen eigenen State, er folgt aus
  `formattedElement !== null`.
- Floating UI schließt das Popover bei einem Druck außerhalb schon auf
  `pointerdown`, also vor dem Klick. Damit der Pinsel als Toggle und
  die Regionen ihren Klick erhalten, zählen die Canvas-Toolbar und das
  formatierte Objekt nicht als außerhalb (`Popover`-Prop `keepOpenOn`).
- `ChartFormatPopover` arbeitet auf dem ausgewählten Chart mit den
  `chartActions` (`createChartActions`); „Chart data“ im Build Panel
  nutzt dieselben Actions für Charttyp, Encodings und Aggregation.
- Solange das Popover offen ist, legt `syncFormatFocus`
  (`charts/echarts/syncFormatFocus.ts`) nach dem Rendern
  Editor-Zustand in die ECharts-Instanz: Serien, Legende und nicht
  bearbeitete Achsen gedimmt, die Legende oder der bearbeitete Teil
  einer Achse leuchtet (`xAxis`: Titel und Linie; `xAxisLabels`:
  Labels, Ticks bleiben normal); bei Pie und Donut werden keine Achsen
  gesetzt.
  Legenden-Icons erben die Deckkraft der Serien und werden beim Fokus
  auf die Legende zurückgesetzt. Analog zu `syncAxisTitleEdit` und
  `syncBrush`. Dieser Zustand gehört nicht zur `ChartSpec` und
  verschwindet mit dem nächsten vollständigen `setOption`.
- Im Format-Modus nimmt der Adapter dem Chart die Daten-Interaktion:
  `syncFormatTooltip` versteckt den Tooltip (`hideTip`, `show: false`),
  bei jedem Element einschließlich `container`. Beim Element `tooltip`
  (nur im Dropdown, ohne Region) pinnt er ihn stattdessen als Vorschau:
  `findPreviewPoint` sucht im gerenderten Option den größten Wert über
  alle Serien (Zahlen, `[x, y]`-Paare, Objekte mit `value`),
  `alwaysShowContent` und `triggerOn: 'none'` halten ihn fest, `showTip`
  öffnet ihn. Ist der Tooltip ausgeschaltet, gibt es keine Vorschau.
  `syncBrush` gibt den
  Brush-Cursor ab (`brushType: false`), eine bestehende Auswahl bleibt
  gezeichnet. Beides ist Editor-Zustand wie `syncFormatFocus`.
- Das Format-Label am Pointer gehört dem `ObjectFrame`: ein Element für
  alle Regionen und den Container, Text aus dem `formatHint` bzw. dem
  Objekttyp. Die Position schreibt `moveFormatLabel` bei `pointermove`
  direkt als CSS-Variablen ans Label, ohne React-State, damit
  Mausbewegungen weder Frame noch Content neu rendern.
- Der Chart-Titel ist HTML und liegt außerhalb von ECharts.
  `ChartItem` spiegelt den Fokus dort über eine CSS-Klasse
  (`is-formatted` leuchtet, `is-dimmed` tritt zurück).

Das Plot-Grid kartesischer Charts (`createGridOption`) weicht einer
sichtbaren Legende aus: Rand der Legende (`LEGEND_EDGE_OFFSETS`, auch
für ihre Platzierung genutzt), ihre Größe (eine Zeile oben und unten,
breitester Eintrag per Canvas-Messung links und rechts) und ein
Abstand zum Plot pro Seite. Pie und Donut weichen über `getPieCenter`
aus.

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

Eine Selection besteht aus einer Liste von Filtern, die gemeinsam gelten
(UND). Ein Filter ist entweder eine Werteliste (`values`) oder ein
numerischer Bereich (`range`).

Quellen:

- Klick in Line, Bar, Pie und Donut: Wertefilter auf die Kategorie des
  X-Felds;
- Klick in Scatter: Wertefilter auf die Kategorie eines kategorialen
  Color-Felds (Serienname);
- Brush in Scatter: zwei Bereichsfilter auf das X- und das Y-Feld
  (`createSelectionFromBrush`).

Ein erneuter Klick auf dieselbe Kategorie oder ein Klick auf eine leere
Fläche im Chart hebt die Selection auf.

Der Brush ist im Scatter immer aktiv: Ziehen erzeugt ein Rechteck,
Mausrad-Zoom bleibt erhalten. Weil `setOption` den Brush-Zustand
zurücksetzt, gleicht `syncBrush` nach jedem Rendering den Brush-Modus
und das sichtbare Rechteck mit der Selection ab. Das Rechteck wird also
aus dem Domain State gezeichnet und verschwindet, sobald die Selection
aus einem anderen Chart stammt oder gelöscht wird. Das eigene Abblenden
von ECharts (`outOfBrush`) ist deaktiviert; abgeblendet wird
ausschließlich über die Selection.

Die Selection gilt global und unabhängig davon, ob ein Chart das
Selection-Feld selbst codiert. Jeder Chart hebt den Anteil seiner eigenen
Kennzahl hervor, der auf die ausgewählten Zeilen entfällt:

- Line und Bar: Zusätzlich zur Basis-Query läuft eine Highlight-Query mit
  der Selection als Filter. Die Basis-Serien werden abgeblendet, die
  Highlight-Serien liegen auf einer versteckten zweiten X-Achse mit
  denselben Kategorien darüber. Die Highlight-Linie verbindet Lücken.
- Pie und Donut: Bei aktiver Selection werden nur die gefilterten Werte
  gezeigt. Die Farben hängen am Kategorienamen der Basis-Query.
- Scatter: Punkte des Samples, die nicht zur Selection passen, werden im
  Frontend abgeblendet, ohne zusätzliche Query.
- Card: Die `card-query` trägt die Selection als Filter; die Card zeigt
  den gefilterten Wert und darunter die Selection als Label in
  Akzentfarbe (z. B. „United States“), bei einem Bereich (Brush) nur
  „Filtered“. Ohne Selection bleibt das Label leer; seine Zeile ist
  immer reserviert, damit der Wert nicht springt.

Die Bedeutung einer Selection (Zeilenzugehörigkeit, Vergleich,
Beschriftung, Query-Filter über `getSelectionQueryFilters`) liegt in
`src/workspace/dataSelection.ts` und wird von Charts, Cards, Tooltip und
Canvas gemeinsam genutzt.

Der Tooltip benennt Highlight-Werte mit der ausgewählten Kategorie bzw.
dem ausgewählten Bereich. Im
Quell-Chart entfallen die Highlight-Zeilen, weil sie dort die Basiswerte
nur wiederholen würden. Gemeinsame Konstanten wie die Abblend-Opacity
liegen in `content/selectionStyle.ts`.

## 7. ChartDefinition vs. ChartSpec

### ChartDefinition

Beschreibt Regeln eines Charttyps.

Beispiele:

- verfügbare Encodings;
- kompatible Semantic Roles;
- verfügbare Format-Elemente und -Abschnitte (über `coordinates`);
- Defaults;
- Aggregation Rules;
- Fähigkeiten (`dataMode`, `coordinates`).

Alle Definitionen liegen in `src/charts/chartDefinitions.ts`,
typisiert als `Record<ChartType, ChartDefinition>`. Typabhängiges
Verhalten fragt die Fähigkeiten einer Definition ab, nicht den
Typnamen:

| Fähigkeit     | Werte                  | steuert                                                                             |
| ------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `dataMode`    | `aggregated`, `points` | Chart- oder Points-Query, Titel „vs.“/„by“, Selection per Klick oder Brush, Tooltip |
| `coordinates` | `cartesian`, `radial`  | Grid, Zoom, Tooltip-Trigger, Farbmodus, Format-Elemente (Achsen nur kartesisch)     |

Abfragen laufen über Helper in `chartDefinitions.ts`:
`isPointsChartType`, `isRadialChartType`, `hasAggregatedColor`
(aggregierter Chart mit `color`-Encoding in der Definition und gesetztem
Color-Feld; dann wird das Color-Feld mitaggregiert) und
`getMissingEncodings` (Encodings mit `required: true`, die noch leer
sind; Grundlage des Empty State im Chart).

Ein neuer Charttyp braucht damit einen Eintrag in `chartDefinitions`,
einen Content-Builder in der Registry (siehe Abschnitt 6) und ggf.
eigene Mark-Appearance. Wo sich ein Typ tatsächlich anders darstellt,
bleibt die Abfrage bewusst am Typnamen: Mark-Controls im
`MarkSeriesWidget`, die Line-Series in `createAggregatedSeriesOption`
und der Donut-Radius. Ein neuer Wert für `dataMode` oder `coordinates`
(z. B. für Histogram oder Radar) erweitert die Union und die
betroffenen Helper.

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

Neue Charts starten mit leerem Encoding (`createDefaultChartSpec`
kennt den Datensatz nicht); Cevyn rät keine Felder. Beim Typwechsel
behält `carryOverEncoding` im Reducer die Encodings, die der neue Typ
kennt; zwischen `points` und `aggregated` startet das Encoding leer.
Wechselt dabei `coordinates` (kartesisch ↔ radial), übernimmt das Chart
Label-Sichtbarkeit und Legend-Position aus dem Default des neuen Typs.

### Abgeleitete Aggregation

Was ein aggregiertes Chart tatsächlich abfragt, wird beim Lesen aus
Spec und Feldern abgeleitet (`getEffectiveAggregation.ts`), nicht beim
Setzen von Y gespeichert:

- `getValueField`: Feld des Werts; ist Y leer, zählt das Chart X
  (`y = x`).
- `isCountOnly`: Y leer oder Y kein Measure → es wird gezählt.
- `getEffectiveAggregation`: `count` in diesen Fällen, sonst die
  gespeicherte `aggregation`.
- `getValueLabel`: Name des Werts für Achse, Tooltip und Titel, z. B.
  „Count of country“.

Query, „Chart data“ im Build Panel (Aggregation-Select deaktiviert mit „Count“),
Beschriftung und Default-Titel lesen dieselbe Ableitung. Die
gespeicherte Aggregation bleibt erhalten und gilt wieder, sobald ein
Measure auf Y liegt. Y ist deshalb bei Bar, Line, Pie und Donut nicht
`required` und akzeptiert alle Roles; Measures bleiben `recommended`.

Encodings referenzieren Fields nur über den Namen
(`ChartEncoding = { x?: string, … }`). Semantic Role und Physical Type
werden beim Lesen aus `dataset.fields` nachgeschlagen. Der Spec kopiert
keine Field-Metadaten, bleibt serialisierbar und kann nach einem Role
Override nicht veralten.

## 8. Dashboard-Objekte und Workspace State

Alles auf der Canvas ist ein `DashboardObject` (`objects/types.ts`):
eine Union über `kind` mit gemeinsamer Basis. Inhalt, Layout und
Container bleiben getrennt:

```ts
type ObjectLayout = {
  x: number
  y: number
  width: number
  height: number
}

type ObjectContainer = {
  background: ObjectBackground
  border: StrokeStyle // width 0: kein Rahmen
  padding: number
  borderRadius: number
}

type ObjectBackground =
  | { kind: 'surface' | 'glass' | 'blue' | 'violet' }
  | { kind: 'color'; color: string }

type DashboardObjectBase = {
  id: string
  layout: ObjectLayout
  container: ObjectContainer
}

// charts/types.ts
type ChartInstance = DashboardObjectBase & {
  kind: 'chart'
  type: ChartType
  spec: ChartSpec
}

// cards/types.ts
type CardInstance = DashboardObjectBase & {
  kind: 'card'
  spec: CardSpec // data: field + aggregation, appearance: title + value
}

type DashboardObject = ChartInstance | CardInstance // später | Table | …
```

- Jede Domäne definiert ihre Variante aus der Basis (`ChartInstance` in
  `charts/`, `CardInstance` in `cards/`), `objects/types.ts` sammelt sie
  zur Union. `DashboardObjectKind` leitet sich aus der Union ab.
- Eine Card zeigt einen auf einen Wert reduzierten Wert. Ob Zahl oder
  später Text, folgt aus der Reduktion des Felds, nicht aus einer
  Variante. `CardAppearanceSpec` hat einen Eintrag pro Element (`title`,
  `value`); `CardFormatElement` leitet sich daraus ab, ein späterer
  Trend oder ein Histogramm kommt als weiteres Element dazu.
- Ohne Feld zählt die Card die Zeilen („Count of rows“). Beim Drop
  eines Felds setzt `createCardData` die Aggregation aus der Semantic
  Role (Measure → `sum`, sonst `count`); `getCardAggregations` begrenzt
  die Auswahl im Popover entsprechend.
- `container` beschreibt die Formatierung des Containers und ist bewusst
  nicht Teil des Inhalts (siehe Abschnitt 6, Container vs. Content). Die
  Background-Presets verweisen auf Design-Tokens; nur `color` trägt
  einen freien Farbwert. Weitere Overrides wie Rahmenfarbe oder Shadow
  sollen später als zusätzliche optionale Felder ergänzt werden, ohne
  die Presets zu ersetzen.
- `findChart(objects, id)` (`objects/findChart.ts`) liefert ein Objekt
  nur, wenn es ein Chart ist. Code, der Chart-Inhalt braucht (Format-Popover,
  Ask-Cevyn-Validierung, `chart/setTitle`), sucht darüber.

Die Objekt-Registry `objectDefinitions` (`objects/objectDefinitions.ts`)
beschreibt pro `kind`, was die Canvas braucht, nach dem Vorbild von
`chartDefinitions`:

- `defaultSize` für Hinzufügen, Ask Cevyn und die Drop-Vorschau,
  `minSize` für das Verkleinern;
- `label` als Name in Command- und Griff-Labels („Delete card“);
- `group` als Section des Pickers (`objectGroups`: Charts,
  Cards & Table);
- `options` für den Picker im Build Panel; bei Charts aus
  `chartDefinitionList` abgeleitet. Eine Option trägt Icon, Label,
  `addLabel` und ein `ObjectTemplate` (`{ kind: 'chart', chartType }`
  oder `{ kind: 'card' }`).

`getGroupPickerOptions(group)` liefert die Optionen einer Section für
den `ObjectPicker`.
`createObject(template, objects)` erzeugt daraus das Objekt mit Defaults
und freiem Layout; ein `switch` über `kind` erzwingt einen Fall pro
Objekttyp.

Der Workspace hält alle Objekte, das Dashboard, die Editor-Auswahl und
die Datenauswahl:

```text
WorkspaceState
├── dashboard: DashboardSpec
├── objects: DashboardObject[]
├── selectedObjectId: string | null
└── selection: DataSelection | null
```

`useChartWorkspace` leitet daraus `charts` (für Ask Cevyn) und
`selectedChart` (für Format-Popover und „Chart data“) ab; `App` leitet
`selectedCard` für das Card-Format-Popover ab.

Format-Popover: Die Hülle `ObjectFormatPopover` (`objects/`) übernimmt
Position, Offenhalten, Element-Auswahl im Kopf und das Umschalten der
Abschnitte für jedes Objekt; der Inhalt pro Typ kommt als `sections`.
Der aktive Abschnitt ist lokaler UI-Zustand des Popovers. `ChartFormatPopover`
(`charts/format/`) und `CardFormatPopover` (`cards/`) liegen in ihrer
Domäne, zusammen mit ihren Widgets; was alle Objekte teilen
(`ContainerWidget`, `ObjectTitleWidget`), liegt in `objects/`, der
Rahmen der Widget-Zeilen (`FormatWidget`) in `shared/ui`.
`isChartFormatElement` und `isCardFormatElement` grenzen
`FormatTarget.element` auf den Elementtyp des Objekts ein.

```ts
type DashboardLayout = {
  gap: number
}

type DashboardAnimation = {
  duration: number
  easing: AnimationEasing // 'linear' | 'cubicOut' | 'cubicInOut'
  enabled: boolean
}

type DashboardSpec = {
  animation: DashboardAnimation
  layout: DashboardLayout
  name: string
}
```

`DashboardSpec` beschreibt Einstellungen, die für das ganze Dashboard
gelten (`src/workspace/types.ts`). `layout.gap` ist der Abstand in Pixeln
zwischen den Grid-Zellen. `animation` gilt für alle Charts: Sie ist
keine Chart-Eigenschaft mehr (`ChartInteractionSpec` hat kein
`animation`), sondern läuft als Domain-Wert `CanvasPanel` → `ChartGrid`
→ `ChartItem` → `EChartCanvas` → `createEChartOption({ animation })`;
erst der Adapter setzt `animation`, `animationDuration` und
`animationEasing`. Spaltenzahl und Zeilenhöhe bleiben Konstanten
(siehe Canvas Layout), damit bestehende `ObjectLayout`s ihre Bedeutung
behalten. Aktuell gibt es genau ein Dashboard, daher tragen
Dashboard-Actions keine ID.

```ts
type SelectionFilter =
  | { kind: 'values'; field: string; values: DataValue[] }
  | { kind: 'range'; field: string; min: number; max: number }

type DataSelection = {
  sourceChartId: string
  filters: SelectionFilter[]
}
```

Format-Popover, Aktionsleiste und „Chart data“ arbeiten auf dem
selektierten Objekt. Einstellungen des ganzen Dashboards liegen im
Dashboard-Popover der Canvas-Toolbar und brauchen keine Auswahl; es gibt
keinen eigenen Auswahl-State für das Dashboard.

`selectedObjectId` und `selection` sind getrennte Konzepte:

- `selectedObjectId` ist die Editor-Auswahl und bestimmt, welches
  Objekt Format-Popover, Aktionsleiste und Pinsel bearbeiten.
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

- Struktur jedes Objekts: `object/add`, `object/duplicate`,
  `object/remove`, `object/select`, `object/updateContainer`,
  `object/updateLayout` (adressiert über `objectId`);
- Inhalt eines Charts: `chart/setType`, `chart/updateAggregation`,
  `chart/updateEncoding`, `chart/updateAppearance`,
  `chart/updateMarkAppearance`, `chart/updateInteraction` (adressiert
  über `chartId`);
- `dashboard/update` (Name, Animation), `dashboard/updateLayout`;
- `selection/set`, `selection/clear`.

`chart/*`-Actions ändern nur Objekte mit `kind === 'chart'`
(`updateChart` auf Basis von `updateObject`); die ID eines anderen
Objekttyps bleibt ohne Wirkung. `selection/set` wird ignoriert, wenn
das Quell-Objekt nicht existiert. `object/remove` verwirft die
Selection, wenn ihr Quell-Chart entfernt wird. War das entfernte Objekt
selektiert, wählt `object/remove` das nächste Objekt in Lesereihenfolge
(nach `y`, dann `x`) bzw. das vorherige aus (`findNeighborObjectId`).

Format-Popover und Inline-Editing auf der Canvas verwenden dieselben
Actions. Charttitel und Achsentitel werden z. B. im Popover und direkt
im Chart über `chart/updateAppearance` geändert, der Dashboard-Name im
Canvas-Header über `dashboard/update`. Gap und
Animation ändert das Dashboard-Popover der Canvas-Toolbar
(`DashboardSettingsPopover`) über die `CanvasActions`
`updateDashboardLayout` und `updateDashboard`.

Regeln:

- Jede Objekt-Action adressiert ihr Objekt explizit über `objectId`,
  jede Chart-Action ihren Chart über `chartId`.
- `update*`-Actions tragen einen `patch` statt einzelner Key/Value-Paare.
- Der Reducer bleibt deterministisch. Nicht-deterministische oder
  dataset-abhängige Werte wie neue IDs, Default Specs und freie
  Layout-Positionen werden vor dem Dispatch erzeugt und in der Action
  übergeben.
- Reiner UI-State wie Drag-Zustand oder selektiertes Field gehört nicht
  in den Workspace State.

Die Actions sind die gemeinsame Grundlage für manuelle Bedienung und
später für Ask Cevyn und Explore (siehe Abschnitt 16). Externe
Aufträge laufen nicht direkt als `WorkspaceAction`, sondern über den
Action Layer.

### Callback-Bündel in der UI

`useChartWorkspace` hält den Workspace State und reicht Änderungen als
Callbacks an die UI. Zusammengehörige Callbacks, die durch mehrere
Komponenten-Ebenen gereicht werden, werden zu einem typisierten
`<Bereich>Actions`-Objekt gebündelt und als ein Prop `actions`
übergeben. Einzelne Callbacks oder solche, die nur eine Ebene tief
gehen, bleiben `on…`-Props.

| Objekt          | Type                 | erzeugt in           | Weg                                                                         |
| --------------- | -------------------- | -------------------- | --------------------------------------------------------------------------- |
| `ChartActions`  | `charts/types.ts`    | `createChartActions` | `App` → `ChartFormatPopover` → Widgets; `App` → `BuildPanel` („Chart data“) |
| `CanvasActions` | `workspace/types.ts` | `useChartWorkspace`  | `CanvasPanel` → `ChartGrid` → `ObjectFrame` / `ChartItem` → `EChartCanvas`  |

- `ChartActions` bearbeiten den ausgewählten Chart und brauchen deshalb
  keine `chartId`. Den Container ändern sie über
  `object/updateContainer`.
- Das Dashboard ändern `CanvasActions` (`updateDashboard`,
  `updateDashboardLayout`); Cards ihr Format ebenfalls über
  `CanvasActions`.
- `CanvasActions` adressieren ihr Ziel explizit: `selectObject` und
  `updateObjectLayout` das Objekt (aus dem Frame), `updateChartAppearance`
  sowie Daten-Selection den Chart (aus dem Content).
- Bewusst einzeln bleiben z. B. `onAskCevyn`, `onRenameDashboard` sowie
  `onEditAxisTitle` und `onHoverAxisTitle` (lokaler State in
  `ChartItem`).
- Diese Objekte sind UI-Verdrahtung, keine Domain-Actions. Sie
  dispatchen intern `WorkspaceAction`s.

Drag and Drop liegt in `useWorkspaceDnd` (Sensoren, aktiver Drag,
Drop-Auswertung) und wird von `useChartWorkspace` eingebunden.

### Action Layer

`CevynAction`s sind externe, absichtsbasierte Aufträge, z. B. später von
AI Commands (`src/actions/types.ts`). Sie adressieren Fields per Name
und bestehende Charts per `chartId`; neue IDs, Layouts oder Default
Specs enthalten sie nicht. Der Action Layer
prüft sie und übersetzt sie in bestehende `WorkspaceAction`s
(`src/actions/`):

```text
unknown (JSON)
→ parseCevynActions      (Struktur → CevynAction[])
→ validateCevynAction    (Chart Registry, Semantic Roles, Draft-State)
→ translateCevynActions  (→ WorkspaceAction[], Draft-State)
→ history/applyBatch     (ein Undo-Schritt)
```

- `parseCevynActions` prüft ungeprüften Input nur auf seine Form:
  Array, bekannter Action-Typ, Pflichtfelder, Property-Typen, bekannte
  Encoding-Keys; unbekannte Properties sind Fehler. Werte wie Charttyp,
  Aggregation oder Field-Namen prüft erst `validateCevynAction`. Die
  Regeln stehen deklarativ in `actionShapes`; TypeScript erzwingt, dass
  sie zu `CevynAction` passen. Strukturfehler werden gesammelt; vor
  Validierung und Übersetzung wird abgebrochen.
- `validateCevynAction` prüft gegen dieselben Regeln wie die manuelle
  Bedienung: Charttyp in `chartDefinitions`, Aggregation in
  `supportedAggregations`, Field existiert in `dataset.fields` und ist
  laut `getSemanticCompatibility` nicht `invalid`. Alle Fehler werden
  gesammelt zurückgegeben.
- Geprüft wird gegen den Draft-State, nicht gegen den gespeicherten
  State: Eine Action sieht den Effekt aller vorherigen Actions im
  Batch. Chart-Actions schlagen fehl, wenn `findChart` dort keinen Chart
  findet (auch bei der ID eines anderen Objekttyps); Encoding und
  Aggregation werden gegen den Charttyp des
  Draft-Charts geprüft (z. B. nach `chart/setType` im selben Batch).
- `translateCevynActions` übersetzt jede `CevynAction` in genau eine
  bestehende `WorkspaceAction` und ergänzt dabei, was der Reducer
  braucht: IDs, freie Layouts und Defaults über `createChartInstance`
  und `findFreeLayout` (Größe aus `objectDefinitions`), Default Specs über
  `createDefaultChartSpec`, bestehende Titel-Einstellungen aus dem
  Draft. Angegebene Werte überschreiben die Defaults. Jede übersetzte
  Action wird auf den Draft-State angewendet.
- Alles oder nichts: Ist eine Action ungültig, wird keine ausgeführt;
  das Ergebnis (`CevynActionResult`) enthält dann die Fehler mit Index.
  Fehler ohne Index betreffen den ganzen Batch (z. B. kein Array).
- `useChartWorkspace.runActions` ist der einzige Einstieg und nimmt
  `unknown` entgegen. Im Dev-Build
  ist er zusätzlich als `window.cevyn.run` für die Browser-Konsole
  verfügbar.
- Aktuelle Actions:
  - `chart/create` (Charttyp, optional Encoding und Aggregation)
    → `object/add`;
  - `chart/setType` → `chart/setType`; wie im Build Panel bleiben
    passende Encodings erhalten (`carryOverEncoding`), die Aggregation
    kommt aus dem Default des neuen Typs;
  - `chart/updateEncoding` → `chart/updateEncoding`;
  - `chart/updateAggregation` (nur `aggregation`)
    → `chart/updateAggregation`;
  - `chart/setTitle` (Text) → `chart/updateAppearance`; schaltet den
    Titel ein;
  - `chart/remove` → `object/remove`.
- Das Cevyn-Vokabular bleibt bewusst chart-bezogen (`chart/*`,
  `chartId`), ebenso das Backend-Schema in `app/ai/models.py`; nur die
  Übersetzung führt Struktur-Actions auf `object/*` zurück. Actions für
  weitere Objekttypen sind noch nicht geplant.
- Charts, die im selben Batch erst erstellt werden, können noch nicht
  adressiert werden, da ihre ID erst bei der Übersetzung entsteht.
- Die Strukturprüfung bleibt im Frontend, weil dort ausgeführt wird und
  Actions aus mehreren Quellen kommen können. Das JSON Schema für das
  AI Tool Calling liegt im Backend (siehe Ask Cevyn) und beschreibt
  dieselbe Form wie `actionShapes`; der Abgleich ist manuell.

### Ask Cevyn

AI Commands laufen über den Action Layer, nicht über eigene
Workspace-Logik:

```text
AskCevynBar (Canvas)
→ useAskCevyn          (dataset.fields, Charts, Chart-Regeln)
→ POST /datasets/{id}/ai-commands   (backend/app/ai/ai_commands.py)
→ Kontext aus DatasetProfile + Chart-Regeln   (ai_context.py)
→ Claude, Tool run_cevyn_actions
→ AiCommandResult      ({ actions: unknown[] | null, message })
→ runActions
```

- Das Backend beschreibt die Actions als Pydantic-Modelle
  (`CevynActionBatch` in `models.py`): camelCase-Aliase, `extra="forbid"`
  (`additionalProperties: false`), optionale Felder ohne `null` im Schema
  (`SkipJsonSchema[None]`), Charttyp und Aggregation als Enum. Daraus
  entsteht das `input_schema` des einzigen Tools.
- Das Schema wird pro Request gebaut (`build_input_schema`): Encodings
  erhalten die Field-Namen als Enum. Eine leere Liste bleibt ein freier
  String, da ein leeres Enum ungültig ist. `chartId` bleibt bewusst ohne
  Enum, damit das Schema pro Dataset stabil und cachebar bleibt; falsche
  IDs lehnt die Validierung ab.
- `tool_choice` ist `auto` ohne parallele Aufrufe. Claude liefert also
  höchstens einen Aufruf mit allen Actions oder nur Text, wenn keine
  Action passt.
- Das Tool ist bewusst nicht `strict`. Strict Tool Use erzwingt die
  Keys von `ChartEncoding` in Schema-Reihenfolge; schreibt Claude
  `x, y` vor `color`, fällt `color` weg (oder landet im String von `y`)
  und die Action wird wiederholt. Ohne `strict` sind die Enums Hinweise,
  keine Garantie.
- Das Backend reicht `actions` ungeprüft weiter; Form und Werte prüft
  ausschließlich `runActions`.
- Der Kontext entsteht aus zwei Quellen. Das Frontend schickt, was nur
  dort existiert: `dataset.fields` mit effektiven Roles (Overrides), pro
  Chart ID, Typ, Encoding, Aggregation und sichtbaren Titel sowie die
  aus `chartDefinitions` abgeleiteten Chart-Regeln (`AiChartRule`). Das
  Backend ergänzt das `DatasetProfile` aus dem Store.
- `ai_context.py` formt daraus kompakten Text: `<chart_rules>` mit
  Aggregationen und Roles je Encoding, `<dataset>` mit einer Zeile pro
  Field (Name, Physical Type, effektive Role, Werte). Statistiken gehen
  nur mit, wenn ihr `kind` zur effektiven Role passt, sonst nur die
  Anzahl der Werte; Histogramme nie.
- Prompt Caching: `tools` → `system` → `messages` bilden den Prefix.
  Tool-Schema, System-Prompt und Kontext hängen nur von Dataset,
  Overrides und Chart Registry ab; der Cache-Breakpoint liegt am Ende des
  Kontexts. Charts und Prompt stehen in der User-Message, damit neue
  Charts den Cache nicht invalidieren. Das Log zeigt gelesene und
  geschriebene Cache-Tokens.
- Der Endpoint ist zustandslos: jeder Prompt ist unabhängig, es gibt
  keinen Gesprächsverlauf. Der aktuelle Workspace ist der Kontext.
- `useAskCevyn` hält nur UI-State (Status, Meldungen), nicht den
  Workspace State. Die Antwort wird über einen Ref mit dem aktuellen
  `runActions` ausgeführt, damit Änderungen während der Wartezeit nicht
  überschrieben werden.
- Fehler von Claude werden als `502` mit `detail` gemeldet; der
  API-Client übernimmt `detail` als Fehlermeldung.
- Konfiguration über `backend/.env`: `ANTHROPIC_API_KEY`; mit
  `CEVYN_AI_STUB=1` antwortet ein Stub ohne Claude.

### Undo/Redo

Die History liegt als eigener Reducer um den `workspaceReducer`
(`src/workspace/workspaceHistory.ts`):

```text
WorkspaceHistoryState
├── past: WorkspaceSnapshot[]
├── present: WorkspaceState
└── future: WorkspaceSnapshot[]
```

`useChartWorkspace` dispatcht jede `WorkspaceAction` verpackt als
`history/apply` mit Timestamp; dazu kommen `history/undo` und
`history/redo`. `history/applyBatch` wendet mehrere `WorkspaceAction`s
nacheinander an und speichert davor genau einen Snapshot; ein Batch
wird nie mit anderen Schritten zusammengefasst. Der `workspaceReducer`
selbst kennt keine History.

Regeln:

- Undo-fähig sind alle `chart/*`-, `dashboard/*`- und `object/*`-Actions
  außer `object/select` (Positivliste der Präfixe). `object/select` und
  `selection/*` ändern nur `present`.
- Eine Action, die den State nicht verändert, erzeugt keinen Schritt.
- Ein Snapshot enthält `objects`, `dashboard` und `selectedObjectId`.
  Undo stellt damit auch die Auswahl wieder her, z. B. nach einem
  Delete.
  Die Datenauswahl bleibt erhalten, solange ihr Quell-Chart existiert.
- `update*`-Actions mit gleichem Coalesce-Key (Action-Typ, `objectId`
  bzw. `chartId`, ggf. Mark, Patch-Keys) innerhalb von 500 ms werden zu einem
  Schritt zusammengefasst. Dadurch ergeben Scrubbing, Slider,
  Farbpicker, Pfeil-Nudges und Tippen in Textfeldern einen Schritt, ohne
  dass die Controls Gesten melden.
- Die History ist auf 100 Schritte begrenzt und wird nicht persistiert.

### Commands

Workspace-Befehle sind als `WorkspaceCommand` beschrieben (Label, Icon,
Shortcuts, `isEnabled`, optional `isActive`, `run`, Scope) und werden in
`useWorkspaceCommands` zentral erzeugt. Dieselbe Registry speist
Shortcuts und Buttons:

```text
useWorkspaceCommands
├── useCommandShortcuts → globaler Keydown-Listener
└── CommandButton       → Canvas-Toolbar, Aktionsleiste im ObjectFrame
```

- Aktuelle Commands: `history.undo`, `history.redo`, `object.duplicate`,
  `object.delete`, `object.format`, Build Panel umschalten. Die Objekt-Commands wirken auf `selectedObjectId`; ihre
  Labels lauten vorerst noch „… chart“.
- Toggle-Commands wie Format setzen `isActive`; `CommandButton` zeigt
  sie dann als gedrückten Button.
- Scope `global` greift überall, Scope `object` nur, wenn der Frame
  selbst fokussiert ist (`[data-object-id]`).
- In Textfeldern und `contenteditable` greift kein Shortcut; dort bleibt
  z. B. das native Text-Undo erhalten.
- Control-lokale Tastaturbedienung (Slider, `ScrubbableNumber`,
  `RotationDial`, `InlineTextInput`) sowie Pfeiltasten
  und Escape auf dem fokussierten Objekt bleiben in den Komponenten
  (`ObjectFrame`).

### Canvas Layout

`ObjectLayout` wird in Grid-Zellen angegeben, nicht in Pixeln. Die
Canvas verwendet ein 24-spaltiges Grid mit fester Zeilenhöhe
(`src/workspace/chartLayout.ts`).

- Neue und duplizierte Objekte werden auf der ersten freien Fläche
  platziert (`findFreeLayout`, Standardgröße aus `objectDefinitions`).
- Move und Resize sind reine Layout-Funktionen mit Grenzen für
  Grid-Rand und Mindestgröße. Maus-Drag und Tastaturbedienung verwenden
  dieselben Funktionen.
- Während eines Drags wird nur eine lokale Vorschau gerendert. Beim
  Loslassen entsteht genau eine `object/updateLayout`-Action.
- Überlappende Objekte werden aktuell nicht automatisch aufgelöst.

### Drag and Drop

Drag Sources und Drop Targets beschreiben ihre Bedeutung über typisierte
Daten statt über ID-Strings:

- `DragPayload`: `field`, `object-option` (Option aus dem
  `ObjectPicker` mit ihrem `ObjectTemplate`) oder `object-layout`
  (Griff am `ObjectFrame` mit `objectId` und Modus);
- `DropTarget`: `canvas` oder `encoding` mit `chartId` und
  `encodingKey`.

Ein Drop einer Option auf die Canvas ruft `addObject(template)` auf;
die Drop-Vorschau nutzt die Standardgröße des gezogenen Typs.

Das gezogene Feld (`draggedField`) wird von `App` bis `ChartItem`
gereicht. `EncodingDropSlots` bewertet jeden Slot über
`getSemanticCompatibility` und deaktiviert ungültige Droppables.
`useWorkspaceDnd` erhält deshalb nur gültige Encoding-Drops und prüft
die Kompatibilität nicht erneut.

## 9. Bearbeitung am Objekt

Es gibt kein Einstellungs-Panel. Jede Einstellung hat genau eine Heimat:
Was ein sichtbares Element betrifft, wird im Format-Popover dieses
Elements bearbeitet; Verhalten ohne eigenes Element gehört als
Abschnitt zum Element, das es betrifft. Was Daten zuordnet, liegt im
Build Panel, was das ganze Dashboard betrifft, im Dashboard-Popover der
Canvas-Toolbar.

| Bereich                            | Ort                                                                   |
| ---------------------------------- | --------------------------------------------------------------------- |
| Container, Rahmen                  | Element „Chart“/„Card“ (Klick auf freie Fläche, Pinsel)               |
| Titel                              | Element „Title“, inline editierbar                                    |
| Marks, Datenlabels                 | Element „Marks“: Abschnitte Marks \| Labels                           |
| Tooltip                            | Element „Tooltip“ (Dropdown, Vorschau am größten Wert)                |
| Achsen, Gridlines, Zoom            | Elemente „X/Y Axis“ (Axis \| Gridlines \| Zoom) und „X/Y Axis Labels“ |
| Legende, Legend Selection Mode     | Element „Legend“: Abschnitte Legend \| Interaction                    |
| Color Scale                        | Element „Color Scale“ (Dropdown, bei kontinuierlicher Farbe)          |
| Charttyp, Encodings, Aggregation   | Build Panel, Abschnitt „Chart data“                                   |
| Dashboard-Name                     | inline im Canvas-Titel                                                |
| Layout-Gap, Animation aller Charts | Dashboard-Popover (Zahnrad in der Canvas-Toolbar)                     |

Die Widgets liegen in ihrer Domäne (`charts/format/`, `charts/data/`,
`cards/`, `objects/`, `workspace/`) und rendern ihre Zeilen über
`FormatWidget` (`shared/ui`); welche Elemente ein Objekt hat,
bestimmen `getFormatElements` und die Fähigkeiten der Chart Registry.

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

- Color mit Role Measure verwendet eine kontinuierliche Color Scale;
- Color mit anderer Role verwendet eine kategorische Palette und Legend;
- ohne Color kann Series den kategorischen Farbkanal übernehmen.

Series bleibt bei gleichzeitigem numerischem Color als Gruppierung erhalten,
besitzt aber nicht mehr den Farbkanal. Deshalb wird in diesem Fall keine
farbige Series-Legend angezeigt.

Die Entscheidung trifft allein `getColorEncodingMode` über die
effektive Semantic Role des Color-Fields. Adapter (Serien, Visual Map,
Selection), Legend und Format-Elemente (Legende bzw. Color Scale) folgen
diesem Modus.

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
→ Physical Types und Semantic Roles
→ Summary Statistics
→ Missing Values und Duplicates
→ Profile Result
```

Profile Results sind deterministische Datenprodukte. AI kann sie
priorisieren und erklären, berechnet sie aber nicht selbst.

Implementiert in `backend/app/datasets/profiling.py`:

- Das `DatasetProfile` wird beim Upload einmal berechnet, im
  `StoredDataset` gehalten und über `GET /datasets/{id}/profile`
  ausgeliefert. Die Upload-Response (`DatasetSummary`) bleibt schlank.
- Dataset-Ebene: `row_count`, `column_count`, `missing_count` (Summe
  der Null-Zellen), `duplicate_rows` (überzählige identische Zeilen).
- Field-Ebene: `name`, `physical_type`, `semantic_role`,
  `missing_count`, `unique_count` (ohne Nulls) und `statistics`.
- `statistics` ist eine über `kind` unterschiedene Union und hängt von
  der Semantic Role ab: Measure (min, max, mean, median), Dimension
  (häufigste Werte, bei Gleichstand nach Wert sortiert), Temporal
  (min/max als ISO-String und `granularity`). Identifier haben keine
  Statistiken.
- `granularity` (`day`, `week`, `month`, `quarter`, `year` oder `null`)
  ergibt sich aus dem häufigsten Abstand in Tagen zwischen aufeinander
  folgenden eindeutigen Datumswerten; Monate, Quartale und Jahre über
  Bereiche (z. B. 28–31 Tage).
- Measure und Temporal enthalten ein Histogramm (`histogram`): Anzahl
  der Werte in gleich breiten Bins zwischen min und max, höchstens 20
  Bins und nicht mehr als eindeutige Werte. Die Bin-Grenzen werden
  nicht übertragen, sondern aus min, max und Bin-Anzahl abgeleitet.
  Date/Datetime werden über ihre physische Zahl gebinnt.
- Die Semantic Role wird nur an einer Stelle erkannt
  (`infer_semantic_role` in `schema_detection.py`). Die Fields der
  `DatasetSummary` tragen dieselbe erkannte `semantic_role`.
- Im Frontend liegen die Types in `src/datasets/types.ts`, der Abruf
  in `fetchDatasetProfile`.
- `groupFieldProfiles` (`src/datasets/fieldGroups.ts`) gruppiert Field
  Profiles nach Semantic Role mit denselben Gruppen wie das Build
  Panel. `createDistributionBars` (`src/datasets/fieldDistribution.ts`)
  übersetzt Histogramm bzw. `value_counts` in UI-Balken; Dimensions
  erhalten zusätzlich „Other“ für die übrigen Werte.

### Semantic Role Overrides

Die erkannte Semantic Role kann vom Nutzer korrigiert werden. Overrides
sind Nutzerentscheidungen und kein Teil des Profiling-Ergebnisses:

```text
DatasetProfile.fields[].semantic_role   erkannte Role (unverändert)
SemanticRoleOverrides                   { fieldName: SemanticRole }
→ getSemanticRole(field, overrides)     effektive Role
```

- `SemanticRoleOverrides` liegt im Frontend in `useDatasets` neben dem
  geladenen Dataset und wird beim Laden eines neuen Datensatzes
  geleert. Ein Override, der der erkannten Role entspricht, wird
  entfernt.
- `src/datasets/semanticRoles.ts` enthält die effektive Role
  (`getSemanticRole`), die Labels und die je Physical Type erlaubten
  Roles (`getAllowedSemanticRoles`); die erkannte Role ist immer
  erlaubt.
- `groupFieldProfiles` (Profile View) und `groupFields` (Build Panel)
  gruppieren nach der effektiven Role über `getFieldGroupKey`;
  `getFieldGroupDefinition` liefert daraus Icon und Label, z. B. für
  die Spaltenköpfe der Table View.
- Das Backend kennt die Overrides nicht. Statistiken bleiben die der
  erkannten Role; die Chart-Query-Validierung prüft Physical Types und
  ist davon nicht betroffen.
- Die Table View zeigt eine Verteilung nur, wenn `statistics.kind` zur
  effektiven Role passt; nach einem Override auf eine andere Role
  bleibt der Platz leer.
- `useDatasets` wendet die Overrides über `applySemanticRoleOverrides`
  auf die `DataField`s an und gibt ein Dataset mit effektiven Roles
  aus. Compatibility, abgeleitete Aggregation, Color Mode und der
  ECharts-Adapter lesen nur `field.semantic_role` und kennen weder
  Profil noch Overrides.
- Geplant: Overrides werden Teil des serialisierbaren Project State
  (Abschnitt 17) und damit undo-fähig und speicherbar.

### Aggregated Chart Query

Line-, Bar-, Pie- und Donut-Charts verwenden ein gruppiertes
Backend-Resultset. Der Request enthält:

- `x` und `y`;
- optional `series`;
- `aggregation` für den Y-Wert;
- optional `color` und `color_aggregation`;
- `filters` als Liste von Wertefiltern `{ kind: 'values', field,
values }` und Bereichsfiltern `{ kind: 'range', field, min, max }`;
  bei Bereichsfiltern darf eine Grenze `null` (offen) sein, aber nicht
  beide.

Filter werden vor der Gruppierung angewendet und untereinander mit UND
verknüpft. Wertefilter vergleichen auf dem als String gecasteten
Feldwert, damit Kategorien aus dem Resultset direkt als Filterwerte
dienen können. Bereichsfilter vergleichen numerisch inklusive der
Grenzen und sind nur für numerische Felder erlaubt. Unbekannte
Filterfelder und Bereichsfilter auf nicht numerischen Feldern werden mit
422 abgelehnt.

Das Resultset enthält pro Gruppe:

- `x`;
- optional `series`;
- `value`;
- optional `color_value`.

Reihenfolge der Gruppen: Ist X numerisch oder temporal, sortiert das
Backend aufsteigend nach X; sonst absteigend nach der Summe von `value`
je X über alle Series (größte Kategorie zuerst). `null` steht zuletzt,
die Series-Reihenfolge innerhalb eines X bleibt stabil. Das Frontend
übernimmt die Reihenfolge unverändert.

`color_value` ist ein zusätzlich aggregiertes Ergebnisfeld und verändert
weder die Gruppierung noch `value`. Color darf dasselbe Feld wie Y mit einer
eigenen Aggregation redundant codieren, aber nicht dasselbe Feld wie X oder
Series verwenden.

Der Request wird in der Chart-Domäne aus der `ChartInstance` abgeleitet
(`createChartQuery`) und nicht in React-Komponenten zusammengesetzt. Bei
aktiver Selection leitet `createHighlightQuery` daraus eine zweite
Query ab, die die Selection als Filter trägt. Die Basis-Query bleibt
dabei unverändert und wird nicht erneut geladen.

### Card Query

Cards nutzen `POST /datasets/{id}/card-query` (`queries/card_query.py`):
Feld (optional), Aggregation und Filter rein, `{ value }` raus. Ohne
Feld liefert die Query die Zeilenzahl nach den Filtern. Die Aggregation
nutzt `build_aggregation_expression` der Chart Query. Das Ergebnis ist
bewusst ein Objekt, damit spätere Teile (z. B. ein Trend) dazukommen
können. Filter trägt der Request schon; gefüllt werden sie mit der
Filterebene (Slicer).

### Points Query

Scatter zeichnet Einzelzeilen statt Gruppen und nutzt deshalb
`POST /datasets/{id}/points-query`:

- Request: `fields`, die encodierten Felder (x, y, optional size und
  color), abgeleitet über `createPointsQuery` aus der `ChartInstance`;
- Ergebnis: `rows` mit nur diesen Spalten und `total_count` des
  Datensatzes;
- über `MAX_CHART_POINTS` (2.000) wird gesampelt statt abgeschnitten
  (fester Seed, damit das Sample stabil bleibt); so zeigt der Scatter die
  Verteilung des ganzen Datensatzes.

Pro Chart ist genau eine Query aktiv: `createChartQuery` liefert für
Charts mit `dataMode: 'points'` (Scatter) `null`, `createPointsQuery`
für alle anderen (siehe Abschnitt 7).
`ChartContentContext.points` trägt das Sample in den ECharts-Adapter.

### Table Query und Table Filter

Die Table nutzt `POST /datasets/{id}/table-query` mit `offset`, `limit`
(max. 500), optional `sort` (`field`, `direction`) und `filters`. Das
Backend filtert, sortiert stabil (`maintain_order`, `null` zuletzt) und
liefert eine Seite `rows` sowie `total_count` nach dem Filtern.

```text
DataTable (sort, filters)
→ useTableRows (Seite 0, weitere Seiten beim Scrollen)
→ table-query
→ Rows im Virtualizer (@tanstack/react-virtual)
```

`TableFilter` ist `ChartFilter` plus `date_range` (`start`, `end` als
ISO-Datum, eine Seite darf offen sein). Werte- und Bereichsfilter laufen
über dieselbe `build_filter_expression` wie die Chart Query; offene
Grenzen über `build_bounds_expression` für Zahlen und Datumswerte.
Validierung (unbekanntes Field, Range nur numerisch, Date Range nur auf
Datumsfeldern) ist mit der Chart Query geteilt.

Die Werteliste für Wertefilter liefert
`GET /datasets/{id}/fields/{field}/values` (optional `search`,
höchstens 100 Werte, häufigste zuerst, `total_count` der passenden
Werte). Gezählt wird mit derselben Funktion wie im Profiling
(`count_values`).

Entscheidung: Table Filter gelten nur für die Table View. Sie wirken
nicht auf Charts und sind lokaler UI-State der `DataTable`. Slicer und
dashboard-weite Filter sind eine eigene, spätere Ebene.

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

Umgesetzt sind diese Semantic Types als Semantic Roles (`measure`,
`dimension`, `temporal`, `identifier`), erkannt allein im Profiling
(siehe Abschnitt 11). Ein separates `semantic_type` gibt es nicht mehr.

Das Build Panel gruppiert Fields über `groupFields`
(`src/datasets/fieldGroups.ts`). Die Zuordnung Field → Gruppe liegt
allein in `getFieldGroupKey` und leitet sich aus der effektiven
Semantic Role (inklusive Overrides) ab.

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
(siehe Abschnitt 8). Ask Cevyn nutzt sie über den Action Layer, Explore
noch nicht.

## 17. Project State

Langfristiges Domain Model:

```text
Project
├── Dataset[]
├── DataProfile[]
├── LightTransformation[]
├── CalculatedField[]
├── Metric[]
├── DashboardObject[]
├── Dashboard[]
├── SharedFilter[]
└── SelectionState
```

Vom `SelectionState` existiert aktuell eine erste Form als `selection`
im `WorkspaceState` (Abschnitt 8). Von `Dashboard` existiert eine erste
Form als einzelne `DashboardSpec` im `WorkspaceState`; mehrere
Dashboards und die Zuordnung von Objekten zu Dashboards sind noch nicht
umgesetzt.

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
