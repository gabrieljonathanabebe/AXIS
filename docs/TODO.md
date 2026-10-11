# Cevyn – To-do

Punkte, die während eines Slices auffallen, aber nicht zu dessen Scope
gehören. Sie werden hier gesammelt, damit der aktuelle Slice fokussiert
bleibt.

Ein Punkt verlässt diese Liste, wenn er erledigt ist oder als geplanter
Scope in `docs/ROADMAP.md` übernommen wird.

## Weitere Dashboard-Einstellungen

- Canvas-Hintergrund als Dashboard-Einstellung, analog zu den
  Container-Presets (Glass, Surface, None, eigene Farbe)
- Innen-Padding der Canvas als Teil von `DashboardLayout`
- beides im Layout-Widget des `DashboardInspector`, undo-fähig über
  `dashboard/updateLayout` bzw. eine passende Dashboard-Action

## Abstand zwischen Panel-Header und Inhalt

- im Build Panel und im Inspector etwas mehr Luft zwischen Header und
  erstem Inhalt
- passende Stelle prüfen (`margin-bottom` von `.panel-header` oder
  Abstand im Panel-Inhalt), ohne die Canvas ungewollt mitzuändern

## Chart-Zusammenfassung über den Inspector-Tabs

- im Inspector über dem Segmented Control Data | Appearance |
  Interaction eine kompakte Karte zum ausgewählten Chart
- Darstellung als Glass-Widget oder plain Section, noch zu entscheiden
- Icon des Charttyps (z. B. Line) und darunter ein Satz, der den
  Charttyp beschreibt
- Icon und Beschreibung möglichst aus der Chart Registry
  (`chartDefinitions`) statt pro Komponente

## Weitere Actions in der Canvas-Toolbar

- die schwebende Canvas-Toolbar zeigt aktuell nur Undo und Redo
- weitere canvasbezogene Actions ergänzen, z. B. Zoom, Save, Export
- als Commands über die Command-Registry und `CommandButton`

## Zahlenformatierung zentralisieren

- `src/shared/format/formatNumber.ts` wird die Single Source of Truth
  für das Formatieren von Zahlen in der gesamten App
- bestehende eigene `Intl.NumberFormat`-Stellen darauf umstellen,
  z. B. Color-Scale-Labels (zeigen teils sehr viele Nachkommastellen),
  Tooltips, Achsenlabels, Selection-Werte
- fehlende Varianten (z. B. Währung, feste Nachkommastellen) dort
  ergänzen statt lokal

## Ausbau der Table-Control-Bar

- Zeilensuche über alle Spalten
- Spalten ein- und ausblenden
- Measure-Range präziser: `RangeSlider` mit Zahlenfeldern
  („Range Slider + Inputs“), da 200 Schritte bei schiefen Verteilungen
  grob sind
- Counts der Werteliste unter Berücksichtigung der übrigen Filter
- Filter zusätzlich über ein Menü im Spaltenkopf anlegen
- Filter als Cevyn Action (Action Layer, AI)

## Ghost-Vorschau im leeren Chart

- Idee: leere Charts zeigen statt des Typ-Icons eine graue Skizze des
  echten Charts (z. B. fünf Balken, Donut mit vier Segmenten), ähnlich
  Power BI
- braucht Beispieldaten pro Charttyp in der Chart Registry und einen
  eigenen Render-Pfad im ECharts-Adapter, abgestimmt auf Theme und
  Chart-Größe

## Temporal als Unterart von Dimension

- in gängigen Semantic Layern (Tableau, Looker, dbt) ist Zeit eine Art
  von Dimension; Cevyn führt `temporal` aktuell flach neben
  `dimension`
- prüfen, ob Semantic Roles hierarchisch modelliert werden sollen:
  `measure`, `dimension` (`categorical` | `temporal`, später evtl.
  `geographic`), `identifier`
- relevant, sobald Code „irgendeine Dimension“ prüft (z. B. Filter,
  Kategorie-Encodings), statt `dimension` und `temporal` an mehreren
  Stellen aufzuzählen
- Build-Panel-Gruppen und Icons können flach bleiben

## CSS neben die Komponenten legen

- Styles liegen zentral unter `src/styles/<bereich>/`, die Komponenten
  dagegen in den Domänen-Ordnern
- prüfen, ob jede Komponente ihre CSS-Datei im eigenen Ordner bekommt
  (z. B. `charts/ChartItem.css`); globale Tokens, Themes und Basis
  bleiben in `src/styles/`

## Generische Props für Shared Controls

- `AlignmentControl` und `FontWeightControl` in `shared/ui` importieren
  Chart-Types (`HorizontalAlignment`, `LabelFontWeight`)
- Ziel: `shared/` kennt keine Domäne; Werte und Optionen kommen
  generisch über Props
- `EmptyState` ist bereits entkoppelt (keine Drop-Logik mehr)

## Cevyn-Action-Schema aus OpenAPI generieren

- das Schema der Cevyn Actions existiert doppelt: Pydantic-Modelle in
  `backend/app/ai/models.py` und `actionShapes` in
  `frontend/src/actions/parseCevynActions.ts`; der Abgleich ist manuell
- Frontend-Types bzw. Strukturprüfung per Codegen aus dem
  OpenAPI-Schema des Backends erzeugen, damit eine neue Action nur
  einmal beschrieben wird

## Auto-Hide der Canvas-Toolbar

- die Toolbar gehört zum Editor, nicht zum Dashboard, und soll die
  Seite möglichst wenig überdecken
- ausblenden, wenn nicht gebraucht; einblenden bei Hover am oberen
  Rand der Canvas, per Shortcut und kurz nach einer Aktion
- im späteren Präsentationsmodus ganz ausgeblendet
