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
- Punkte außerhalb der Planung, auch Bugs und bekannte technische
  Schulden, sind GitHub Issues mit Labels und Prioritäten
  (`DEVELOPMENT.md`, „Issues und Labels“).

Status: Idee · geplant · in Arbeit · implementiert · später. Nur
tatsächlich implementierte und verifizierte Funktionalität gilt als
implementiert.

## 2. Stand

Data-Bereich (Profiling, Semantic Roles), Visualize mit
Multi-Chart-Canvas, Cross-Highlighting, Cards, Ask Cevyn V1 und die
Bearbeitung am Objekt (Format-Panel statt Inspector) sind in einem
ersten vollständigen Stand. Die Appearance-Specs sind auf gemeinsame
Bausteine umgestellt (`TextStyle`, `StrokeStyle`, `NumberFormat`,
`Fill`, `Paint`, `Effect`, `Layout`, `ColorValue` als feste Farbe), das
Format-Panel rechts der Arbeitsfläche zeigt alle Gruppen eines Elements
in fester Reihenfolge und in kompakten Controls im Figma-Stil, mit
Position und Layout auch für Chart und Card. Die App ist neutral
(Akzent nur für Zustände); das Dashboard trägt seine Farben selbst und
bekommt sie aus Dashboard-Styles (Rezept plus Material, Galerie im
Dashboard-Panel, Anwenden als ein Undo-Schritt). Canvas und Container
tragen eine echte Füllung (`Fill`) mit Deckkraft. Flächen und Linien
können Verläufe tragen, Serien einen Fade in ihrer Farbe. Marks haben
Glow oder Schatten, Container eine Liste von Effekten (Schatten,
Innenschatten, Background Blur, Korn).

Nächstes Ziel ist ein Alpha-Release.

## 3. Alpha

Ziel: ein vollständiger, vorzeigbarer Workflow für einen kleinen Kreis
von Testern: Daten laden, verstehen, Dashboard bauen (von Hand oder mit
Ask Cevyn), gestalten, speichern und wieder öffnen.

Reihenfolge (jeder Punkt ein eigener Slice oder eine kurze Folge von
Slices; Abhängigkeiten stehen beim Punkt):

1. Effect (Glow) für Marks – implementiert
2. Marks vervollständigen – implementiert
3. Format-Popover: Gruppen statt Sections – implementiert
4. Kompakte Controls im Figma-Stil – implementiert
5. Neutrale Farben und Hintergründe – implementiert
6. Verläufe für Flächen und Linien – implementiert
7. Effekte: Schatten, Background Blur und Korn – implementiert
8. Dashboard-Styles – implementiert
9. Arbeitsfläche, Format-Panel und Objekt-Layout – implementiert
10. Format-Panel-Zeilen, Legende, Tooltip und Farbskala
11. DateFormat
12. Sortierung und Top N
13. Theme-Umschalter in der TopBar (provisorisch)
14. Table-Objekt
15. Tooltip-Felder
16. Dashboard-Einstellungen
17. Ask Cevyn ausbauen
18. Unabhängigkeit vom App-Namen
19. Persistenz
20. Alpha-Infrastruktur und Vollbild

Kleine Lückenfüller zwischen den Slices: einzelne offene Zeilen der
Ist/Soll-Liste in `DESIGN_SYSTEM.md` („Style-Bausteine und Abdeckung“).

### 3.10 Format-Panel-Zeilen, Legende, Tooltip und Farbskala (geplant)

Die neuen Zeilen entstehen gleich im Format-Panel (3.9), als Gruppen
und nach dem Muster aus `DESIGN_SYSTEM.md`, Abschnitt 6 „Kompakte Controls im
Figma-Stil“ (Farbzeile mit `PaintControl`, Felder mit Icon und Einheit,
Seltenes hinter ⚙, Auge bzw. ＋/− statt Schaltern, Icon und Wort für
Verhalten; Icon-Check am Slice-Ende).

Zuerst das Panel selbst: Menüs nicht schmaler als ihr Inhalt (z. B. die
Namen im Menü der Palette).

Danach die Bausteine:

- Legende: Fill (Hintergrund, Farbzeile), Stroke (Rahmen), Radius als
  Feld; Text ist da
- Tooltip: Text, Fill, Stroke, Radius und Zahlenformat
  (`NumberFormatControls` für `interaction.tooltip.numberFormat`, das
  heute ausgewertet wird, aber kein Control hat)
- Farbskala als HTML: die ECharts-`visualMap` bleibt mit `show: false`
  für die Farbzuordnung, nur der Balken wird HTML: Text und Zahlenformat
  für die Werte, Fill und Stroke, eigene Format-Region wie die Legende
  (damit wird die Color Scale anklickbar); das Element regelt nur die
  Komponente selbst, ihre Farben gehören zur Datenfarbe der Marks
  - eigener Platz statt den Plot zu überlappen: Die Farbskala sitzt im
    Layout neben dem Chart-Canvas (der Canvas schrumpft), nicht darüber
  - Position über `PositionGrid` wie die Legende (`continuous.layout` als
    `Pick<Layout, 'alignment' | 'position'>`); `orientation` folgt aus der
    Position (beschlossen in 3.9: oben oder unten horizontal, links oder
    rechts vertikal; das Richtungs-Control ist seit 3.9 entfallen)
  - ob `orientation` dann entfällt, wird vor der Persistenz entschieden
- Kasten-Modell (`ARCHITECTURE.md`, „Platzierung“): ein gemeinsamer
  Baustein für die Fläche (Fill, Stroke, Radius, Padding) statt je
  Element; Entscheidung, ob die Spec Position und Anordnung trennt (wäre
  eine Formänderung); Breite und Höhe nutzen `BoxFieldsRow` aus dem
  Objekt-Layout wieder
- lange Legende oben oder unten: Ausrichtung wirkt gespiegelt (#55)
- Effekte über den gemeinsamen Kasten-Baustein (Fill, Stroke, Radius, Padding, Effects),
  soweit der Renderer sie zeichnen kann; Standard-Optik unverändert
- neue Felder, keine Formänderung

### 3.11 DateFormat (geplant)

Baustein für Datumswerte nach dem Muster von `NumberFormat`. Heute gibt
es ein festes Format: `formatDate` (`shared/format/formatDate.ts`) nutzt
immer `dateStyle: 'medium'` in UTC, an der Achse z. B. „Jan 1, 2025 ·
Feb 1, 2025“ auch bei Monatsdaten.

- Typ in `shared/format/` (Vorschlag):

  ```ts
  type DateFormat = {
    style: 'auto' | 'custom'
    unit: 'year' | 'quarter' | 'month' | 'day' // feinste Einheit
    month: 'numeric' | 'short' | 'long' // 03 · Mar · March
    year: 'numeric' | '2-digit' // 2025 · 25
    time: boolean // Uhrzeit bei Datetime-Feldern
  }
  ```

- `auto` richtet sich nach der erkannten Granularität des Felds
  (`TemporalStatistics.granularity`): Monatsdaten „Jan 2025“,
  Jahresdaten „2025“, Tagesdaten „1 Jan 2025“
- Formatter auf Basis von `Intl.DateTimeFormat` mit der Locale aus
  `shared/config.ts` (später aus den Dashboard-Einstellungen, 3.16);
  Quartale („Q1 2025“) selbst zusammensetzen
- `DateFormatControls` in `shared/ui` wie `NumberFormatControls`: bei
  Auto nur das Select, bei Custom Einheit in der Zeile, Monat, Jahr und
  Uhrzeit hinter ⚙ (`DetailsPopover`)
- Nutzer: Achsenbeschriftung (`labels.dateFormat` neben `numberFormat`;
  im `AxisWidget`, sobald im Format-Select Date gewählt ist, statt
  bisher nichts), Überschrift des Tooltips bei Datums-X, später die
  Datums-Spalten der Table (3.14)
- neues Feld, keine Formänderung
- die neuen Zeilen entstehen direkt in der Gruppen-Struktur aus 3.3 und
  im kompakten Stil aus 3.4

### 3.12 Sortierung und Top N (geplant)

Die Spec kennt heute keine Sortierung; die Reihenfolge der Kategorien
kommt aus der Query. Balken nach Wert absteigend oder „Top 10 Länder“
sind in BI-Dashboards Alltag.

- neue Felder in `ChartDataSpec`: Sortierung nach Wert oder Kategorie,
  auf- oder absteigend, und eine Begrenzung (Top N); Standard je
  Charttyp zu Beginn festlegen (z. B. Balken nach Wert absteigend)
- Datums-X bleibt chronologisch; nach Wert sortiert nur eine
  kategorische X
- das Backend sortiert und begrenzt in der `chart-query` über den ganzen
  Datensatz, nicht das Frontend
- die Highlight-Query übernimmt die Kategorien der Basis-Query; ein
  eigenes Top N unter der Selection würde andere Kategorien zeigen
- Bedienung im Build Panel beim Encoding oder als Gruppe im Element
  „Chart“; zu Beginn klären
- „Other“ für die übrigen Kategorien bleibt eine Idee (Nach dem Alpha)
- neue Felder, keine Formänderung

### 3.13 Theme-Umschalter in der TopBar (geplant, provisorisch)

Entwicklungshilfe, um das helle Theme ohne JavaScript-Konsole zu
prüfen; wird später wieder entfernt oder durch eine echte Einstellung
ersetzt. Das Dashboard folgt dem Editor-Theme nicht: Seine Farben
stehen seit den Dashboard-Styles (3.8) als echte Werte in der Spec.

- `IconButton` rechts in der `TopBar` (Sonne/Mond), schaltet
  `data-theme` am `<html>` zwischen `dark` und `light` um; Standard
  bleibt `dark` aus `index.html`
- die App folgt den CSS-Variablen von selbst; die Charts lesen aus dem
  Editor-Theme nur noch den Format-Fokus (`readChartTheme`),
  `useDocumentTheme` (`charts/`) beobachtet `data-theme` und zeichnet
  sie dann neu
- keine Persistenz, kein Platz in der `DashboardSpec`, kein Undo
- schlicht halten; nicht in `DESIGN_SYSTEM.md` aufnehmen, weil
  provisorisch

### 3.14 Table-Objekt (geplant)

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
  (`TextStyle`, `NumberFormat`, `DateFormat`), Zeilen- und Spaltenlinien
  (`StrokeStyle`), Zebra-Streifen (`Fill`), Container wie bei Chart und
  Card
- zu klären: welche Spalten die Table zeigt (alle, Auswahl per Drop),
  und ob sie wie die Card der Selection folgt

### 3.15 Tooltip-Felder (geplant)

Direkt nach dem Table-Objekt:

- frei wählbare Zusatzfelder im Tooltip (wie in Power BI), z. B.
  `customers` im Scatter von revenue und profit
- `interaction.tooltip.fields: string[]` existiert, wird aber nicht
  genutzt; für aggregierte Charts braucht jedes Feld eine Aggregation,
  daher Form `{ field, aggregation }[]` – Formänderung, also vor der
  Persistenz
- Scatter: Felder zusätzlich in der `points-query`; Bar, Line, Pie:
  `chart-query` liefert pro Gruppe zusätzliche aggregierte Werte
- Bedienung über dieselbe Feldliste wie die Spaltenauswahl der Table
  (Felder ziehen, sortieren, entfernen, Aggregation)
- dieselbe Feldwahl bestimmt auch den Inhalt der Datenlabels (heute fest
  Wert bzw. Anteil), z. B. Kategorie oder ein weiteres Feld

### 3.16 Dashboard-Einstellungen (geplant)

Im Format-Panel ohne Auswahl (aus 3.9), undo-fähig; als Unterobjekte
der `DashboardSpec` (wie `animation`), weil sich ihre Form vor der
Persistenz festlegen soll:

- `canvas.background` ist seit 3.5 da (`Fill`, Gruppe Background)
- feste Seitengröße: `pageSize` (`Auto` wie heute oder fest, z. B.
  1280 × 720) als Voraussetzung für Zoom; bei fester Größe steht die
  Seite aus 3.9 zentriert auf der Arbeitsfläche; Dokumentname und
  sichtbarer Titel können sich später trennen
- `layout.padding` (Innenabstand der Seite; in 3.9 ein fester Wert für
  Titel und Grid)
- `format.locale` statt der Konstante `LOCALE` in `shared/config.ts`;
  heute zeigt Cevyn `1,234.56` auch für deutsches Publikum
- `interaction.crossHighlight`: ob ein Klick auf eine Mark die übrigen
  Objekte filtert
- später: Palette und Schrift als Teil der Dashboard-Styles (3.8)

### 3.17 Ask Cevyn ausbauen (geplant)

Ziel: Ask Cevyn erstellt eigenständig ganze Dashboards und formatiert
sie. Die Architektur bleibt: Claude erzeugt nur Cevyn Actions, das
Frontend prüft sie und wendet sie als ein Undo-Schritt an. Hängt an
3.14 und 3.16, weil die KI nur kann, was es als Action gibt.

- Action-Schema nur noch einmal beschreiben (#30): Frontend-Types bzw.
  Strukturprüfung per Codegen aus dem OpenAPI-Schema des Backends
  (heute doppelt in `backend/app/ai/models.py` und
  `frontend/src/actions/parseCevynActions.ts`)
- neue Actions:
  - `card/create`, später `table/create`
  - Layout über Reihenfolge und Größenklassen (z. B. klein, halb,
    volle Breite); der Code berechnet die Grid-Positionen
  - Formatierung über die Bausteine („Element + Baustein“, z. B.
    `numberFormat` der Y-Achsenbeschriftung), Farben als echte Werte
  - Dashboard-Styles anwenden (3.8) und Dashboard-Einstellungen
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

### 3.18 Unabhängigkeit vom App-Namen (geplant)

Vor der Persistenz, weil der Name in Dateiendung und Dateiformat eingeht:

- Code-Bezeichner beschreiben die Funktion statt der Marke (z. B.
  `CevynAction` → `AssistantAction`, `AskCevynBar`, `useAskCevyn`,
  `run_cevyn_actions`)
- angezeigter Name als Konstante: `APP_NAME` und `ASSISTANT_NAME` in
  `shared/config.ts`, im Backend in einer `app/config.py` (API-Titel,
  System-Prompt)
- Doku, `AGENTS.md` und `README.md` anpassen
- der neue Name selbst ist noch offen

### 3.19 Persistenz (geplant)

- `serializeProject()` / `deserializeProject()` über den Workspace State
- `.cevyn`-Datei (JSON mit Format-Kennung und Version) speichern und
  öffnen; Autosave im Browser
- die Daten selbst: Uploads liegen im Backend nur im Arbeitsspeicher;
  das Projekt bringt sie mit (CSV oder Parquet in der Datei) oder lädt
  sie beim Öffnen neu hoch – zu Beginn des Slices entscheiden
- pro Version eine Migration; beim Laden prüfen wie bei
  `parseCevynActions`
- offene Schulden, die hier fällig werden: Semantic-Role-Overrides in
  den Project State (#29), Scroll- und Fokusverhalten beim Laden (#27,
  #28)

### 3.20 Alpha-Infrastruktur und Vollbild (geplant)

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
- Vollbild für die Seite als Command mit Shortcut; Vollbild ist die
  Ansicht zum Analysieren und Präsentieren: Klicks, Brush und Legende
  analysieren nur, ohne Auswahl, Hover-Labels, Format- und
  Bearbeitungsaktionen (wie die Leseansicht in Power BI)

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
- eine gemeinsame „X Axis“ mit allen Gruppen statt der getrennten
  Elemente „X Axis“ und „X Axis Labels“; der Klick auf eine Region
  öffnet das Element und springt zur passenden Gruppe (Idee)
- Direct Manipulation von Elementen über ihre Regionen (z. B. Legende
  frei verschieben)

### Visualisierung

- Picker für viele Charttypen: Schnellauswahl in der Section „Charts“,
  „More“ als Popover mit Suche und Kategorien nach Zweck; Empfehlungen
  passend zu den gewählten Feldern (Idee)
- weitere Charttypen und Varianten als Issues: Stacked Bar (#13),
  Horizontal (#14), Stacked Area (#15), Heatmap (#16), Histogramm
  (#17), Kombi-Chart (#18); danach bei Bedarf Boxplot,
  Treemap, Sankey, Radar, Maps
- Drill-down, Referenzlinien, Mehrfachauswahl (#39), Range-Selection für Line
  und Bar
- kleine Anteile bei Pie und Donut als „Other“ zusammenfassen (Idee)

### Canvas und Dashboard-Objekte

- Text-, Bild- und Vergleichs-Objekte; Textfelder als frei verschiebbare
  Kästen mit eigener Größe (Kasten-Modell, `ARCHITECTURE.md`)
- Kollisionsauflösung, Smart Guides, Gruppen, Mehrfachauswahl,
  Layers Panel, Z-Order
- Zoom (braucht `pageSize`, siehe 3.16)

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

- Export: PNG, SVG, PDF, CSV, interaktives HTML (Titel und Container
  selbst zusammensetzen, #38)
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
  für Cards mit Selection-Label; der Scatter lädt die Felder einer
  fremden Selection mit, um seine Punkte abzugleichen
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
  (Gap, Background, Animation) im Zahnrad der Canvas-Toolbar
- Format-Popover mit Gruppen statt Sections: alle Gruppen untereinander,
  Element-Schalter im Kopf, Gruppen-Schalter in der Überschrift, kurze
  Zeilen-Labels, feste Reihenfolge je Element (Marks über
  `MARK_GROUP_ORDER`); Color der Marks verweist bei kontinuierlicher
  Farbe auf die Color Scale
- kompakte Controls im Figma-Stil: Zeilen ohne Label mit Icon und
  Einheit im Feld (`ScrubbableNumber` mit `icon`, `unit`, `onAuto`),
  Farbzeile (`PaintControl`, `ColorField`) mit der Datenfarbe der Marks
  samt Palette, Verlauf und Range (⚙), Seltenes hinter ⚙
  (`DetailsPopover`); Auge, ＋/− und Pinsel statt Schaltern, `Toggle`
  und `Slider` entfernt
- Icon-Gruppen mit Icon und Wort über die volle Breite, Optionen mit
  Icons auch in Selects (`OptionContent`, Aggregationen mit Σ, x̄, x̃),
  dichtere Menüs; `PositionGrid` für die Legende, `RotationDial` als
  Feld mit Nadel
- Data Labels als eigenes Element mit Positionen je Charttyp
  (`labelPositions`, eigene Icons); Zoom als Toggles Scroll | Slider,
  Legend Interaction als Off | Multiple | Single, Animation mit Easing
  und Duration

- Arbeitsfläche und Seite getrennt: neutrale Arbeitsfläche mit Toolbar
  (Undo, Redo, Pinsel), die Seite trägt den Style, Titel und Grid
  fluchten und scrollen gemeinsam
- Format-Panel rechts statt Popover (`FormatPanel`, ⌘⇧B), folgt der
  Auswahl, ohne Auswahl das Dashboard; Zeilen-Raster `1fr 1fr 24px`
  (`ControlRow` mit `pair`, `single`, `wide`, `action`, `isFull`)
- Ort statt Modus: kein Format-Modus mehr; Klick-Grammatik (Klick,
  ⌘/Ctrl-Klick, Doppelklick), Hover-Label und kurzer Format-Fokus
- kleine Elemente als Gruppen ihres Elternteils (`formatGroups`):
  Datenlabels und Tooltip in Marks, Achsen-Labels in der Achse,
  Selection in Value
- Gruppen Position und Layout wie in Figma (`PositionControls`,
  `LayoutControls`, `BoxFieldsRow`): Chart und Card mit X | Y und W | H
  in Grid-Zellen, begrenzt wie beim Ziehen und undo-fähig; Richtung von
  Legende und Farbskala folgt aus der Seite

Style-Bausteine und Farben

- `TextStyle`, `StrokeStyle`, `NumberFormat`, `Fill`/`SeriesFill` mit
  je einer `…Controls`-Komponente
- `Effect` mit `EffectControls`: Glow (None/Glow, Intensity) für alle
  Marks in der Serienfarbe; abgeblendete Serien und Punkte leuchten
  nicht, Scatter ab 500 Punkten ohne Glow
- alle Marks mit Fill, Border und Effect (Balken, Scatter-Punkte, erstmals
  eine Appearance für Pie und Donut mit Innenradius); Achsenlinie mit
  `StrokeStyle`; Achsentitel als `title: { text, textStyle }` wie
  überall
- `ColorValue` als feste Farbe, Paletten als `ColorValue[]`; Flächen
  unter Linien in der Serienfarbe
- Paletten stabil erweitert (`getPaletteColor`): ab der sechsten
  Kategorie hellere bzw. dunklere Runden derselben Farben statt
  Wiederholung; vorhandene Kategorien behalten ihre Farbe
- `Layout` mit Position- und Layout-Bausteinen für Container,
  Dashboard, Legende, Farbskala und Datenlabels; Achsentitel mit
  eigenem `visible`
- Line: Points Auto/On/Off, Datenlabels auch ohne Punkte; Scatter:
  flächentreue Größe mit Size range, Labels ohne Überlappung
- neutrale App („grau bis aktiv“): Hover und aktive Controls grau, der
  Akzent nur für Auswahl, Fokus, Drop-Ziele, Format-Fokus und
  Primäraktion; Dashboard und App mit getrennten Farben und Akzenten;
  Canvas (`canvas.background`) und
  Container als `Fill` mit Deckkraft auf eigener Ebene, ohne Glass,
  Schatten und Presets; das Objekt im Format-Popover als feiner Ring
- Verläufe: gemeinsamer `Paint` für Fill und Stroke (Solid, linearer
  und radialer Verlauf mit Stopps), Fade für Serien-Flächen und -Linien;
  Typwahl, Winkel und Stopp-Liste (⚙ in der Überschrift) im
  `PaintControl`; Adapter für ECharts und CSS, Container-Rahmen als SVG
- Effekte: Schatten neben Glow für Marks (Versatz, Farbe und Deckkraft
  hinter ⚙); Container mit einer Liste `container.effects` aus
  Schatten, Innenschatten, Background Blur und Korn auf festen Ebenen;
  Gruppe Effects mit ＋ und Zeilen Art | Hauptwert | ⚙ | −; 16 px
  Innenabstand der Canvas gegen abgeschnittene Schatten
- Dashboard-Styles: Rezept (`StyleRecipe` in der `DashboardSpec`) plus
  Material (`solid`, `frosted`, `glass`) ergibt alle Werte; Graphite,
  Midnight, Daylight, Bloom und Indigo; Anwenden schreibt echte Werte
  als ein Undo-Schritt, `takeStyleColors` übernimmt generisch jede
  Farbe der Defaults; neue Objekte entstehen im aktuellen Style; keine
  Theme-Tokens mehr; Galerie im Dashboard-Popover mit Vorschau live aus
  dem Rezept (`ContainerSurface`); Schnellauswahl der Style-Farben in
  jedem Farbwähler; Dashboards behalten ihre Farben im hellen und
  dunklen Editor

Ask Cevyn V1

- Action Layer: `CevynAction`s, Strukturprüfung, Validierung,
  Übersetzung in Workspace Actions, ein Undo-Schritt
- Claude mit Tool `run_cevyn_actions`, Dataset-Profil und
  Chart-Regeln als gecachter Kontext; Eingabeleiste mit Thinking Glow

Entwicklung

- Backend nach Domänen, Frontend nach Domänen mit `shared/useQuery`
- pytest-Tests für Queries, Uploads und API (`uv run pytest`)
