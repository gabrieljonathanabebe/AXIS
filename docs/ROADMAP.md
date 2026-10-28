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
Bearbeitung am Objekt (Format-Popover statt Inspector) sind in einem
ersten vollständigen Stand. Die Appearance-Specs sind auf gemeinsame
Bausteine umgestellt (`TextStyle`, `StrokeStyle`, `NumberFormat`,
`Fill`, `Effect`, `Layout`, `ColorValue` mit Theme-Tokens), das
Format-Popover zeigt alle Gruppen eines Elements in fester Reihenfolge
und in kompakten Controls im Figma-Stil. Die App ist neutral (Akzent nur
für Zustände), das Dashboard hat eigene Tokens, Canvas und Container
tragen eine echte Füllung (`Fill`) mit Deckkraft.

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
6. Verläufe für Flächen und Linien – **nächster Slice**
7. Schatten als Effect
8. Dashboard-Styles
9. Legende, Tooltip und Farbskala mit Bausteinen
10. DateFormat
11. Theme-Umschalter in der TopBar (provisorisch)
12. Table-Objekt
13. Tooltip-Felder
14. Dashboard-Einstellungen
15. Ask Cevyn ausbauen
16. Unabhängigkeit vom App-Namen
17. Persistenz
18. Alpha-Infrastruktur und Vollbild

Kleine Lückenfüller zwischen den Slices: einzelne offene Zeilen der
Ist/Soll-Liste in `DESIGN_SYSTEM.md` („Style-Bausteine und Abdeckung“).

### 3.6 Verläufe für Flächen und Linien (geplant, nächster Slice)

Verläufe in jeder Farbzeile, damit Flächen und Linien, und später die
Dashboard-Styles (3.8), Looks wie ein Leuchten auf der Canvas oder eine
diagonale, durchscheinende Fläche als echte Werte tragen. Fill und
Stroke bekommen einen gemeinsamen Typ für ihre Farbe, weil beide
dieselbe Farbzeile (`PaintControl`) nutzen; hätte nur eine davon die
Typwahl, wäre das Control halb fertig.

```ts
type GradientStop = {
  color: ColorValue
  opacity: number // 0–1, z. B. 94 % → 49 % bei einer Frosted-Fläche
  position: number // 0–1
}

type Paint =
  | { kind: 'solid'; color: ColorValue }
  | {
      kind: 'gradient'
      type: 'linear' | 'radial'
      angle: number
      stops: GradientStop[]
    }

type Fill = Paint & { opacity: number } // solid bleibt unverändert
```

- `StrokeStyle` trägt seine Farbe ebenfalls als `Paint` (heute
  `color: ColorValue`); eine Formänderung, vor der Persistenz zulässig;
  die genaue Form zu Beginn des Slices festlegen
- Nutzer mit eigener Farbe: Canvas- und Container-Fläche,
  Container-Rahmen, Achsenlinie, Gridlines, Rahmen von Balken,
  Scatter-Punkten und Pie-Segmenten
- Serien: `SeriesFill` und `SeriesStrokeStyle` bekommen `fade`
  (Deckkraft am Anfang und Ende, Winkel) in der Serienfarbe, z. B. für
  die Fläche unter der Linie, Balken und die Linie selbst
- Text bleibt einfarbig: ECharts zeichnet keinen Text mit Verlauf, in
  HTML ginge es nur über einen CSS-Trick
- im `PaintControl` Typwahl Solid | Linear | Radial als Icon-Gruppe,
  Winkel als Feld, Stopps im Details-Popover (⚙); beim Radialverlauf
  Mittelpunkt und Größe zu Beginn des Slices klären
- der Stopp-Editor kommt aus `GradientControl` und wird mit der
  Farbskala geteilt; die Typen bleiben getrennt, weil die Farbskala
  Werten Farben zuordnet und ein Paint eine Fläche oder Linie malt
- Adapter: ECharts-Verläufe mit `resolveColor`, HTML über eine
  CSS-Funktion neben `getColorCss`; Canvas und Container malen ihren
  Fill schon auf einer eigenen Ebene (`--canvas-background`,
  `--chart-background`)
- Container-Rahmen: CSS-Rahmen können Verlauf, Strichmuster und Radius
  nicht zusammen; Vorschlag ist ein SVG-Rahmen (`rect` mit Verlauf,
  `stroke-dasharray` und `rx`) statt `.chart-item-border`
- Stellen, die heute `.color` lesen, meldet der Typcheck; Icon-Check am
  Slice-Ende

### 3.7 Schatten als Effect (geplant)

`Effect` bekommt die Art `shadow` (heute `none` und `glow`), damit Marks
und Container einen versetzten Schatten tragen; Grundlage für die
Dashboard-Styles (3.8).

- `{ kind: 'shadow'; offsetX; offsetY; blur; color; opacity }` mit
  `color` als `ColorValue`
- Marks: Shadow neben Glow im Select der Gruppe Effect; weiter ein
  Effekt pro Mark, weil ECharts je Mark nur einen Schatten zeichnet
- Container: neues Feld `container.effect` mit Gruppe Effect (＋/−) im
  Element „Chart“ bzw. „Card“, in CSS als `box-shadow` am Rahmen; zu
  Beginn klären, wie der Schatten am Rand des scrollenden Grids nicht
  abgeschnitten wird
- Zeilen: Art | Blur | −; Versatz und Farbe als weitere Zeilen oder
  hinter ⚙, zu Beginn klären
- Background Blur am Container als weitere Art, wenn ein Container mit
  einem Effekt auskommt; sonst später (mehrere Effekte je Element wie
  in Figma)
- neue Variante und neues Feld, keine Formänderung

### 3.8 Dashboard-Styles (geplant)

Vorgefertigte Looks für das ganze Dashboard, die ein Klick anwendet.
Entscheidung aus 3.5: Presets gehören nicht in einzelne Hintergründe,
sondern als Style zum Dashboard; Canvas und Container tragen überall
echte Farben (`Fill`). So halten es auch Power BI (Themes), Keynote
(Themes) und Canva (Templates).

- Anwenden statt Verknüpfen: Ein Style schreibt echte Werte in Canvas
  und alle Container (Fill, Border, Radius, Effect) und setzt den
  Dashboard-Akzent, als ein Undo-Schritt; danach ist jedes Feld frei
  änderbar, es gibt keine versteckte Kopplung
- neue Objekte übernehmen den Container des zuletzt gewählten Styles
  (`objectDefaults` in der `DashboardSpec`, vorgezogen aus 3.14)
- eigenes Farbschema je Style (hell oder dunkel), unabhängig vom
  Editor-Theme: Texte, Achsen und Raster (`text`, `textMuted`,
  `gridLine`, `border`) folgen heute App-Tokens und wandern in den
  Dashboard-Namensraum, damit ein dunkles Dashboard in einem hellen
  Editor lesbar bleibt
- erste Styles: der ruhige Standard von heute (Canvas `#141518`,
  Container `#202226`, neutraler Akzent) und Midnight nach dem
  Referenz-Screenshot aus 3.5: blaues Leuchten auf der Canvas,
  Container als Verlauf
  `linear-gradient(127deg, rgba(6, 11, 40, 0.94) 19%, rgba(10, 14, 35, 0.49) 77%)`
  ohne Rand und Schatten, blauer Akzent; den finalen Standard zu Beginn
  des Slices festlegen
- Auswahl im Dashboard-Popover, z. B. als Galerie mit kleiner Vorschau
- hängt an 3.6 und 3.7; Formänderungen nur vor der Persistenz

### 3.9 Legende, Tooltip und Farbskala mit Bausteinen (geplant)

Die neuen Zeilen entstehen gleich als Gruppen und nach
dem Muster aus `DESIGN_SYSTEM.md`, Abschnitt 6 „Kompakte Controls im
Figma-Stil“ (Farbzeile mit `PaintControl`, Felder mit Icon und Einheit,
Seltenes hinter ⚙, Auge bzw. ＋/− statt Schaltern, Icon und Wort für
Verhalten; Icon-Check am Slice-Ende):

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
    Position
  - ob `orientation` dann entfällt, wird vor der Persistenz entschieden
- Kasten-Modell (`ARCHITECTURE.md`, „Platzierung“): ein gemeinsamer
  Baustein für die Fläche (Fill, Stroke, Radius, Padding) statt je
  Element; Entscheidung, ob die Spec Position und Anordnung trennt (wäre
  eine Formänderung)
- kein Effect; Standard-Optik unverändert
- neue Felder, keine Formänderung

### 3.10 DateFormat (geplant)

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
  `shared/config.ts` (später aus den Dashboard-Einstellungen, 3.14);
  Quartale („Q1 2025“) selbst zusammensetzen
- `DateFormatControls` in `shared/ui` wie `NumberFormatControls`: bei
  Auto nur das Select, bei Custom Einheit in der Zeile, Monat, Jahr und
  Uhrzeit hinter ⚙ (`DetailsPopover`)
- Nutzer: Achsenbeschriftung (`labels.dateFormat` neben `numberFormat`;
  im `AxisWidget`, sobald im Format-Select Date gewählt ist, statt
  bisher nichts), Überschrift des Tooltips bei Datums-X, später die
  Datums-Spalten der Table (3.12)
- neues Feld, keine Formänderung
- die neuen Zeilen entstehen direkt in der Gruppen-Struktur aus 3.3 und
  im kompakten Stil aus 3.4

### 3.11 Theme-Umschalter in der TopBar (geplant, provisorisch)

Entwicklungshilfe, um das helle Theme ohne JavaScript-Konsole zu
prüfen; wird später wieder entfernt oder durch eine echte Einstellung
ersetzt. Das Dashboard folgt dem Editor-Theme nicht: Sein Farbschema
kommt mit den Dashboard-Styles (3.8).

- `IconButton` rechts in der `TopBar` (Sonne/Mond), schaltet
  `data-theme` am `<html>` zwischen `dark` und `light` um; Standard
  bleibt `dark` aus `index.html`
- HTML-Teile folgen den CSS-Variablen von selbst; die Charts lesen das
  Theme nur beim Zeichnen (`readChartTheme`), `useDocumentTheme`
  (`charts/`) beobachtet `data-theme` und zeichnet sie dann neu
- keine Persistenz, kein Platz in der `DashboardSpec`, kein Undo
- schlicht halten; nicht in `DESIGN_SYSTEM.md` aufnehmen, weil
  provisorisch

### 3.12 Table-Objekt (geplant)

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

### 3.13 Tooltip-Felder (geplant)

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

### 3.14 Dashboard-Einstellungen (geplant)

Im Dashboard-Popover der Canvas-Toolbar, undo-fähig; als Unterobjekte
der `DashboardSpec` (wie `animation`), weil sich ihre Form vor der
Persistenz festlegen soll:

- `canvas.background` ist seit 3.5 da (`Fill`, Gruppe Background)
- Seite und Arbeitsfläche: `pageSize` (`Auto` wie heute oder fest, z. B.
  1280 × 720) als Voraussetzung für Zoom; bei fester Größe steht die
  Seite zentriert auf einer neutralen Arbeitsfläche (App-Token, wie in
  Figma, Power BI und Tableau), und die Ebene mit `canvas.background`
  zieht von `.canvas-panel::before` auf die Seite (`.dashboard-surface`);
  der Titel bleibt auf der Seite, weil er zum Dashboard gehört;
  Dokumentname und sichtbarer Titel können sich später trennen
- `layout.padding` (Innenabstand der Canvas)
- `format.locale` statt der Konstante `LOCALE` in `shared/config.ts`;
  heute zeigt Cevyn `1,234.56` auch für deutsches Publikum
- `interaction.crossHighlight`: ob ein Klick auf eine Mark die übrigen
  Objekte filtert
- später: Palette und Schrift als Teil der Dashboard-Styles (3.8)

### 3.15 Ask Cevyn ausbauen (geplant)

Ziel: Ask Cevyn erstellt eigenständig ganze Dashboards und formatiert
sie. Die Architektur bleibt: Claude erzeugt nur Cevyn Actions, das
Frontend prüft sie und wendet sie als ein Undo-Schritt an. Hängt an
3.12 und 3.14, weil die KI nur kann, was es als Action gibt.

- Action-Schema nur noch einmal beschreiben (#30): Frontend-Types bzw.
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

### 3.16 Unabhängigkeit vom App-Namen (geplant)

Vor der Persistenz, weil der Name in Dateiendung und Dateiformat eingeht:

- Code-Bezeichner beschreiben die Funktion statt der Marke (z. B.
  `CevynAction` → `AssistantAction`, `AskCevynBar`, `useAskCevyn`,
  `run_cevyn_actions`)
- angezeigter Name als Konstante: `APP_NAME` und `ASSISTANT_NAME` in
  `shared/config.ts`, im Backend in einer `app/config.py` (API-Titel,
  System-Prompt)
- Doku, `AGENTS.md` und `README.md` anpassen
- der neue Name selbst ist noch offen

### 3.17 Persistenz (geplant)

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

### 3.18 Alpha-Infrastruktur und Vollbild (geplant)

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
- Zoom (braucht `pageSize`, siehe 3.14)

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
- `ColorValue` mit Theme-Tokens (Text, Muted, Accent, Grid line,
  Border, Inactive, Chart 1–5), Paletten als `ColorValue[]`, Farbauswahl
  je Einsatzort mit Default-Feld; Flächen unter Linien in der
  Serienfarbe
- Paletten stabil erweitert (`getPaletteColor`): ab der sechsten
  Kategorie hellere bzw. dunklere Runden derselben Farben statt
  Wiederholung; vorhandene Kategorien behalten ihre Farbe
- `Layout` mit `LayoutControls` für Titel, Container, Dashboard,
  Legende, Farbskala und Datenlabels; Achsentitel mit eigenem `visible`
- Line: Points Auto/On/Off, Datenlabels auch ohne Punkte; Scatter:
  flächentreue Größe mit Size range, Labels ohne Überlappung
- neutrale App („grau bis aktiv“): Hover und aktive Controls grau, der
  Akzent nur für Auswahl, Fokus, Drop-Ziele, Format-Fokus und
  Primäraktion; Dashboard-Tokens in eigenem Namensraum
  (`styles/dashboard.css`), Charts lesen ihr Theme vom Chart-Element mit
  getrenntem Dashboard- und App-Akzent; Canvas (`canvas.background`) und
  Container als `Fill` mit Deckkraft auf eigener Ebene, ohne Glass,
  Schatten und Presets; das Objekt im Format-Popover als feiner Ring

Ask Cevyn V1

- Action Layer: `CevynAction`s, Strukturprüfung, Validierung,
  Übersetzung in Workspace Actions, ein Undo-Schritt
- Claude mit Tool `run_cevyn_actions`, Dataset-Profil und
  Chart-Regeln als gecachter Kontext; Eingabeleiste mit Thinking Glow

Entwicklung

- Backend nach Domänen, Frontend nach Domänen mit `shared/useQuery`
- pytest-Tests für Queries, Uploads und API (`uv run pytest`)
