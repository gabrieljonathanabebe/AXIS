# Cevyn – Roadmap

## 1. Zweck

Diese Datei beschreibt den aktuellen Entwicklungsstand und die nächsten
Prioritäten. Sie ist bewusst kompakt:

- Abschnitt 3 sagt, was als Nächstes kommt. Ein neuer Chat beginnt mit
  dem ersten offenen Slice dort.
- Abgeschlossene Slices stehen nur als eine Zeile unter „Erreicht“. Wie
  etwas umgesetzt ist, beschreiben `ARCHITECTURE.md` und
  `DESIGN_SYSTEM.md`; die Details eines Slices stehen in der
  Git-Historie.
- Punkte außerhalb der Planung sammelt `TODO.md`.

Status: Idee · geplant · in Arbeit · implementiert · später. Nur
tatsächlich implementierte und verifizierte Funktionalität gilt als
implementiert.

## 2. Stand

Data-Bereich (Profiling, Semantic Roles), Visualize mit
Multi-Chart-Canvas, Cross-Highlighting, Cards, Ask Cevyn V1 und die
Bearbeitung am Objekt (Format-Popover statt Inspector) sind in einem
ersten vollständigen Stand. Die Appearance-Specs sind auf gemeinsame
Bausteine umgestellt (`TextStyle`, `StrokeStyle`, `NumberFormat`,
`Fill`, `ColorValue` mit Theme-Tokens).

Nächstes Ziel ist ein Alpha-Release.

## 3. Alpha

Ziel: ein vollständiger, vorzeigbarer Workflow für einen kleinen Kreis
von Testern: Daten laden, verstehen, Dashboard bauen (von Hand oder mit
Ask Cevyn), gestalten, speichern und wieder öffnen.

Reihenfolge (jeder Punkt ein eigener Slice oder eine kurze Folge von
Slices; Abhängigkeiten stehen beim Punkt):

1. Effect (Glow) für Marks – **nächster Slice**
2. Marks vervollständigen
3. Table-Objekt
4. Dashboard-Einstellungen
5. Ask Cevyn ausbauen
6. Unabhängigkeit vom App-Namen
7. Persistenz
8. Alpha-Infrastruktur und Vollbild

Kleine Lückenfüller zwischen den Slices: der Bug „Datenlabels bei
Line-Charts fehlen“ (`TODO.md`), einzelne offene Zeilen der Ist/Soll-Liste
in `DESIGN_SYSTEM.md` („Style-Bausteine und Abdeckung“).

### 3.1 Effect (Glow) für Marks (geplant, nächster Slice)

Marks sollen leuchten können („Glow“, Neon-Look): ein weichgezeichneter
Schatten ohne Versatz in der Farbe der Mark selbst.

- neuer Baustein `Effect` in `shared/effect.ts`, nach dem Muster der
  übrigen Bausteine (`DESIGN_SYSTEM.md`, „Style-Bausteine und
  Abdeckung“):

  ```ts
  type Effect = { kind: 'none' } | { kind: 'glow'; blur: number }
  // später ohne Migration: { kind: 'shadow'; … } für versetzte Schatten
  ```

  Glow hat keine eigene Farbe; er nimmt immer die Farbe der Mark bzw.
  Serie.

- neue Felder `line.effect` und `bar.effect` (Standard `none`); Scatter
  und Pie folgen in 3.2
- Adapter: zentraler Helper (analog `createStrokeStyleOption`), der
  `shadowBlur` und `shadowColor` (aufgelöste Serienfarbe, Versatz 0) auf
  `lineStyle` bzw. `itemStyle` setzt. Dieselbe Technik nutzt bereits
  `syncFormatFocus` (`lineGlow`)
- Zusammenspiel prüfen: abgeblendete Basis-Serien bei Cross-Highlight
  leuchten nicht oder abgeschwächt, Format-Fokus, helles Theme (Glow
  dort bei Bedarf über `ChartTheme` abschwächen)
- optional, wenn klein: stärkerer Glow beim Hover (`emphasis`)
- `EffectControls` in `shared/ui`: Effect (`SegmentedControl`
  None | Glow) und bei Glow Intensity (`ScrubbableNumber` für `blur`);
  im Marks-Popover nach den Fill- und Stroke-Zeilen
- undo-fähig über die bestehende Action für Mark-Appearance
- `effect` ist ein neues Feld, keine Formänderung bestehender Felder

### 3.2 Marks vervollständigen (geplant)

Lücken der Ist/Soll-Liste, die alle Marks betreffen; dieselben Typen und
dasselbe Marks-Popover wie 3.1:

- Balken: `bar.fill` (`SeriesFill`), `bar.border` (`StrokeStyle`)
- Scatter: `scatter.border` (`StrokeStyle`), `scatter.effect` mit
  Obergrenze (weichgezeichnete Schatten sind bei bis zu 2.000 Punkten
  teuer)
- Pie und Donut bekommen erstmals eine Appearance: `pie.fill`,
  `pie.border`, `pie.innerRadius` (heute fest im Adapter,
  `createPieChartContent`), `pie.effect`
- Achsenlinie: `xAxis.line` / `yAxis.line` mit `visible` und `stroke`
  (heute nur an/aus über `visible`, Stil fest im Adapter)
- Konsistenz: Die Achse hat `title: string` und `titleStyle`; überall
  sonst `title: { text, textStyle }` (`ObjectTitleAppearance`) –
  vereinheitlichen, solange es noch keine gespeicherten Dateien gibt

### 3.3 Table-Objekt (geplant)

Dritter Objekttyp neben Chart und Card, auf Basis von `DataTable` und
`table-query`:

- Vorbereitung, weil der dritte Objekttyp sie sichtbar macht:
  - Abhängigkeitsregel: gemeinsames Query-Vokabular (Aggregation,
    Filter) in `queries/` statt Imports von `cards/` aus `charts/`
    (siehe `ARCHITECTURE.md`)
  - CSS-Trennung von Frame und Content (`chart-item*` am
    `ObjectFrame`, `encoding-drop-slot*`)
- `TableInstance` in `DashboardObject`, Registry-Eintrag in
  `objectDefinitions`, Picker-Gruppe „Cards & Table“
- Format über die Bausteine: Kopfzeile (`TextStyle`, `Fill`), Zellen
  (`TextStyle`, `NumberFormat`), Zeilen- und Spaltenlinien
  (`StrokeStyle`), Zebra-Streifen (`Fill`), Container wie bei Chart und
  Card
- zu klären: welche Spalten die Table zeigt (alle, Auswahl per Drop),
  und ob sie wie die Card der Selection folgt

### 3.4 Dashboard-Einstellungen (geplant)

Im Dashboard-Popover der Canvas-Toolbar, undo-fähig; als Unterobjekte
der `DashboardSpec` (wie `animation`), weil sich ihre Form vor der
Persistenz festlegen soll:

- `canvas.background` mit den Presets des Containers (Glass, Surface,
  None, eigene Farbe)
- `layout.padding` (Innenabstand der Canvas)
- `format.locale` statt der Konstante `LOCALE` in `shared/config.ts`;
  heute zeigt Cevyn `1,234.56` auch für deutsches Publikum
- `interaction.crossHighlight`: ob ein Klick auf eine Mark die übrigen
  Objekte filtert
- später: `theme` (Palette, Schrift, Hell/Dunkel), `pageSize` (Voraussetzung
  für Zoom), `objectDefaults` (Container-Stil für neue Objekte)

### 3.5 Ask Cevyn ausbauen (geplant)

Ziel: Ask Cevyn erstellt eigenständig ganze Dashboards und formatiert
sie. Die Architektur bleibt: Claude erzeugt nur Cevyn Actions, das
Frontend prüft sie und wendet sie als ein Undo-Schritt an. Hängt an
3.3 und 3.4, weil die KI nur kann, was es als Action gibt.

- Action-Schema nur noch einmal beschreiben: Frontend-Types bzw.
  Strukturprüfung per Codegen aus dem OpenAPI-Schema des Backends
  (heute doppelt in `backend/app/ai/models.py` und
  `frontend/src/actions/parseCevynActions.ts`)
- neue Actions:
  - `card/create`, später `table/create`
  - Layout über Reihenfolge und Größenklassen (z. B. klein, halb,
    volle Breite); der Code berechnet die Grid-Positionen
  - Formatierung über die Bausteine („Element + Baustein“, z. B.
    `numberFormat` der Y-Achsenbeschriftung), Farben als Theme-Tokens
  - Dashboard-Einstellungen
  - Verweise innerhalb eines Batches: neue Objekte bekommen einen
    eigenen Namen (`ref`), damit spätere Actions im selben Aufruf sie
    ansprechen können
- Gestaltungsregeln im System-Prompt (z. B. KPI-Cards oben, wenige
  Charts, passender Charttyp je Rolle, kurze Titel)
- kompakter Appearance-Kontext für bestehende Objekte
- Chat mit Verlauf: das Frontend schickt den Verlauf mit, das Backend
  bleibt zustandslos; Fehler des Validators gehen an Claude zurück, das
  sich korrigiert; der Verlauf wird nur angehängt, nie umgeschrieben
- Chatfenster im Build Panel (z. B. per `SegmentedControl` neben den
  bisherigen Inhalten); genaue Form zu Beginn des Slices klären
- kleines Testset typischer Anfragen mit einfachen Prüfungen, um
  Verschlechterungen bei Prompt-Änderungen zu erkennen; Effort je nach
  Anfrage (ganzes Dashboard höher, kleine Änderungen niedriger)

### 3.6 Unabhängigkeit vom App-Namen (geplant)

Vor der Persistenz, weil der Name in Dateiendung und Dateiformat eingeht:

- Code-Bezeichner beschreiben die Funktion statt der Marke (z. B.
  `CevynAction` → `AssistantAction`, `AskCevynBar`, `useAskCevyn`,
  `run_cevyn_actions`)
- angezeigter Name als Konstante: `APP_NAME` und `ASSISTANT_NAME` in
  `shared/config.ts`, im Backend in einer `app/config.py` (API-Titel,
  System-Prompt)
- Doku, `AGENTS.md` und `README.md` anpassen
- der neue Name selbst ist noch offen

### 3.7 Persistenz (geplant)

- `serializeProject()` / `deserializeProject()` über den Workspace State
- `.cevyn`-Datei (JSON mit Format-Kennung und Version) speichern und
  öffnen; Autosave im Browser
- die Daten selbst: Uploads liegen im Backend nur im Arbeitsspeicher;
  das Projekt bringt sie mit (CSV oder Parquet in der Datei) oder lädt
  sie beim Öffnen neu hoch – zu Beginn des Slices entscheiden
- pro Version eine Migration; beim Laden prüfen wie bei
  `parseCevynActions`
- offene Schulden, die hier fällig werden: Semantic-Role-Overrides in
  den Project State, Scroll- und Fokusverhalten beim Laden (siehe
  Abschnitt 7)

### 3.8 Alpha-Infrastruktur und Vollbild (geplant)

- Docker-Images für Frontend und Backend
- CI mit GitHub Actions: `npm run format`, `npm run build`,
  `npm run lint`, `uv run pytest`
- Betrieb: Empfehlung gehostete Web-App für einen eingeladenen Kreis;
  noch zu entscheiden
- Zugangsschutz (Einladungscode oder Magic Link über einen Anbieter),
  Upload-Limit, Datasets nach einer Zeit aus dem Speicher entfernen,
  Rate-Limit für Ask Cevyn
- Datenschutz-Hinweis für Tester (Daten gehen bei Ask Cevyn an die
  Claude-API)
- Vollbild für die Canvas als Command mit Shortcut

### Nicht im Alpha

- Slicer und dashboard-weite Filter (Abschnitt 4); die Selection
  deckt gemeinsames Filtern für den ersten Eindruck ab

## 4. Nach dem Alpha

### Slicer und Filterebenen (geplant)

Beschlossen:

- ein Objekttyp `slicer`; das Steuerelement (Dropdown, Liste, Range,
  Datum) folgt aus der Semantic Role und ist umschaltbar
- drei getrennte Filterebenen: Slicer (Dashboard), Selection
  (Cross-Highlight), Table-View-Filter (lokal, unverändert)
- die wirksamen Filter eines Objekts berechnet eine reine Funktion in
  der Workspace-Domäne; die Basis-Query trägt die Slicer-Filter, die
  Highlight-Query zusätzlich die Selection
- Slicer untereinander UND, Werte eines Slicers ODER; ein leerer Slicer
  filtert nicht, ein Slicer filtert sich nicht selbst
- der Slicer-Wert ist nicht undo-fähig (wie `selection`) und wird mit dem
  Projekt gespeichert; im MVP gilt ein Slicer für das ganze Dashboard
- Backend: ein gemeinsames Filtervokabular inklusive `date_range` für
  alle Queries, Filter auch für die Points Query; gemeinsame
  Filter-Controls mit der Table prüfen (`DataTableFilterForm`)

Ideen: Scope pro Slicer, kaskadierende Slicer-Optionen,
dashboard-weiter Filterbereich, Cross Filtering als Modus.

### Bearbeitung am Objekt (Rest)

- Encodings im Build Panel über ein X entfernen (wie in Power BI)
- eigene HTML-Farbskala statt der ECharts-`visualMap`, damit die Color
  Scale wie Legende und Achsen anklickbar wird
- Direct Manipulation von Elementen über ihre Regionen (z. B. Legende
  frei verschieben)

### Visualisierung

- Picker für viele Charttypen: Schnellauswahl in der Section „Charts“,
  „More“ als Popover mit Suche und Kategorien nach Zweck; Empfehlungen
  passend zu den gewählten Feldern (Idee)
- weitere Charttypen und Varianten: siehe `TODO.md` (Stacked, Horizontal,
  Heatmap, Histogramm, Kombi-Chart); danach bei Bedarf Boxplot,
  Treemap, Sankey, Radar, Maps
- Drill-down, Referenzlinien, Mehrfachauswahl, Range-Selection für Line
  und Bar

### Canvas und Dashboard-Objekte

- Text-, Bild- und Vergleichs-Objekte
- Kollisionsauflösung, Smart Guides, Gruppen, Mehrfachauswahl,
  Layers Panel, Z-Order
- Zoom (braucht `pageSize`, siehe 3.4)

### Daten

- Light Data Operations (Filter, Sort, Group) und Calculated Fields
  (`+ − × ÷`, Felder verbinden), die danach als normale Fields
  erscheinen
- Datenskala bei Bedarf: DuckDB, Parquet, Sampling, Caching – keine
  Migration nur aus Architekturgründen

### Explore und Machine Learning

- Explore: Python erzeugt Candidate Insights, die KI priorisiert und
  erklärt, Cevyn visualisiert über dieselbe Chart Engine
- Forecasts, Cluster und Anomalien als Erweiterung von Visual Analytics,
  kein eigenes ML-Studio

### Share

- Export: PNG, SVG, PDF, CSV, interaktives HTML
- Publish: Share Link, veröffentlichte Dashboards
- Collaboration: Accounts, Organisationen, Rechte, Kommentare,
  Versionen; Speichern auf dem Server

## 5. MVP-Definition

Der erste echte Cevyn-MVP soll mindestens folgenden Workflow
ermöglichen:

```text
Upload Dataset
→ Understand Data
→ Review Types and Profile
→ Filter / Aggregate
→ Create Visualizations
→ Create Multiple Visualizations
→ Arrange Dashboard
→ Use Shared Filters and Selection
→ Save Project
→ Reopen Project
```

Das Ziel ist nicht maximale Feature-Anzahl, sondern ein vollständiger,
verständlicher und wiederholbarer Visual-Analytics-Workflow.

## 6. Erreicht

Kurzfassung der abgeschlossenen Slices; Details in `ARCHITECTURE.md`,
`DESIGN_SYSTEM.md` und der Git-Historie.

Daten

- CSV-Upload, Demo-Dataset im Backend (24.000 Rows), lesbare
  Upload-Fehler (422 statt 500)
- deterministisches `DatasetProfile` mit Physical Types, Semantic Roles,
  Statistiken und Histogrammen; Semantic-Role-Overrides, die Build
  Panel, Charts und Ask Cevyn sofort übernehmen
- Data-Bereich mit Profile (Kennzahl-Kacheln, Field-Kacheln) und Table
  (virtualisiert, Filter, Sortierung, Paging über `table-query`)
- Full Data Access: das Backend rechnet über den ganzen Datensatz
  (`chart-query`, `points-query` mit Sampling, `card-query`)

Visualisierung und Canvas

- Scatter, Line, Bar, Pie und Donut über den ECharts-Adapter mit
  Registry pro Charttyp; Series, Color- und Size-Encodings, Legende,
  kontinuierliche Farbskala
- Multi-Object-Canvas: `DashboardObject` (Chart, Card) mit Frame und
  Content, Grid-Layout, Move, Resize, Duplicate, Delete, Tastatur
- Cross-Highlighting über eine globale Selection (Klick und Brush), auch
  für Cards mit Selection-Label
- Undo/Redo mit Coalescing, Command-Registry mit Shortcuts und
  Hover-Titeln
- Cards mit Feld per Drop, Aggregation, Zahlenformat

Bearbeitung am Objekt

- Format-Modus: Pinsel oder Enter öffnet das Format-Popover, Regionen
  für Titel, Achsen, Achsenbeschriftungen, Legende, Marks und die freie
  Fläche (Element „Chart“ bzw. „Card“), Hover-Label im Format-Modus
- Tooltip als Element mit festgehaltener Vorschau, Datenlabels und
  Color Scale im Popover
- Inspector entfernt; Widgets in ihren Domänen; Dashboard-Einstellungen
  (Gap, Animation) im Zahnrad der Canvas-Toolbar

Style-Bausteine und Farben

- `TextStyle`, `StrokeStyle`, `NumberFormat`, `Fill`/`SeriesFill` mit
  je einer `…Controls`-Komponente
- `ColorValue` mit Theme-Tokens (Text, Muted, Accent, Grid line,
  Border, Inactive, Chart 1–5), Paletten als `ColorValue[]`, Farbauswahl
  je Einsatzort mit Default-Feld; Flächen unter Linien in der
  Serienfarbe

Ask Cevyn V1

- Action Layer: `CevynAction`s, Strukturprüfung, Validierung,
  Übersetzung in Workspace Actions, ein Undo-Schritt
- Claude mit Tool `run_cevyn_actions`, Dataset-Profil und
  Chart-Regeln als gecachter Kontext; Eingabeleiste mit Thinking Glow

Entwicklung

- Backend nach Domänen, Frontend nach Domänen mit `shared/useQuery`
- pytest-Tests für Queries, Uploads und API (`uv run pytest`)

## 7. Bekannte technische Schulden

- `npm run lint` meldet eine Warnung (`react-hooks/incompatible-library`)
  für `useVirtualizer` in `DataTable`; sie kommt aus der Library.
- Table Filter und Sortierung sind lokaler State der `DataTable` und
  gehen beim Wechsel auf Profile oder beim Neuladen verloren.
- Cmd/Ctrl + B schaltet auch im Data-Workspace das ausgeblendete Build
  Panel von Visualize um.
- In Safari kann die gesamte App horizontal scrollen, wenn die Inhalte
  breiter als das Fenster werden. Die Ursache ist noch nicht geklärt.
- Neue Charts werden beim Mount ins Bild gescrollt. Beim späteren Laden
  eines Projekts muss dieses Verhalten auf neu hinzugefügte Charts
  begrenzt werden.
- Ein ausgewählter Chart fokussiert sich selbst. Beim späteren Laden
  eines Projekts darf das nicht ungewollt den Fokus verschieben.
- Semantic-Role-Overrides sind nicht undo-fähig und gehen beim Neuladen
  verloren; sie gehören in den serialisierbaren Project State (3.7).
- `formatDate` formatiert in UTC. Datetime-Werte ohne Zeitzone können
  am Tagesrand um einen Tag abweichen.
- Selection-Werte werden als Strings verglichen. Boolean-Felder
  (`True` in Python gegenüber `true` in Polars), Float-Formatierung und
  leere Kategorien (`''`, `(empty)`, `No category`) treffen daher nicht
  in allen Charts einheitlich.
- Die Selection unterstützt nur einen Wert; es gibt keine
  Mehrfachauswahl.
- Ein späterer PNG-/SVG-Export über ECharts enthält den HTML-Titel und
  den Container nicht und muss beides selbst zusammensetzen.
- ECharts zeichnet mit `sans-serif`, nicht mit Inter.
- Große Schrift bei Achsen-Labels kann über den festen Plot-Rand
  (`BASE_GRID`) hinausragen.
- Das Schema der Cevyn Actions existiert doppelt (Pydantic im Backend,
  `actionShapes` im Frontend); wird in 3.5 aufgelöst.
