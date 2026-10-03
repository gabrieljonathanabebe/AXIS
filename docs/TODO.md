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

## Weitere Actions im Canvas-Header

- Canvas-Header zeigt aktuell nur Undo und Redo
- weitere canvasbezogene Actions ergänzen, z. B. Zoom, Save, Export
- als Commands über die Command-Registry und `CommandButton`

## Sortierung numerischer X-Kategorien im Line-Chart

- Line-Chart mit numerischem X-Field (z. B. `home_goals`) zeigt die
  Kategorien in Datenreihenfolge (2, 1, 0, 4, 3 …) statt sortiert
- prüfen, ob die Sortierung in die Backend-Chart-Query oder in den
  ECharts-Adapter gehört

## Chart Picker nach Auf- und Zuklappen des Build Panels

- nach Zuklappen und erneutem Aufklappen des Build Panels haben die
  Kacheln im Chart Picker (Visuals) einen sehr großen vertikalen
  Abstand zwischen den beiden Reihen
- vermutlich streckt sich das Grid während oder nach der
  Breiten-Transition auf die Panel-Höhe; Ursache in `ChartPicker.css`
  bzw. im Flex-Layout von `.build-panel-content` prüfen

## Zahlenformatierung zentralisieren

- `src/data/formatNumber.ts` wird die Single Source of Truth für das
  Formatieren von Zahlen in der gesamten App
- bestehende eigene `Intl.NumberFormat`-Stellen darauf umstellen,
  z. B. Color-Scale-Labels (zeigen teils sehr viele Nachkommastellen),
  Tooltips, Achsenlabels, Selection-Werte
- fehlende Varianten (z. B. Währung, feste Nachkommastellen) dort
  ergänzen statt lokal

## Control-Bar mit Filtern für die Table View

- schmale Control-Bar über der Table statt Ribbon wie in Power Query
  oder Excel: Zeilensuche, aktive Filter als `Chip`s, `+ Filter`,
  Anzahl gefilterter Zeilen („48 of 60 rows“), Spalten ein- und
  ausblenden
- Filter-Popover mit Control je Semantic Role: Range für Measures,
  Werteliste aus `value_counts` für Dimensions, Zeitraum für Temporal;
  Wertebereiche aus dem `DatasetProfile`
- Filter zusätzlich über ein Menü im Spaltenkopf anlegen
- vorher klären: nur Table-Ansicht oder gemeinsamer Workspace-Filter
  für Charts; Filter als Cevyn Action (Action Layer, AI); Filtern im
  Frontend oder in der Backend-Query
- aufbauen auf `Chip`, `Popover`, `TextInput` und dem `DatasetProfile`

## Table View: alle Rows statt Preview

- aktuell lädt `fetchDatasetRows` nur die ersten 100 Rows; die Table
  zeigt still einen Ausschnitt, Sortieren betrifft nur diesen
- nicht alles in den Browser laden, sondern alles erreichbar machen:
  Rows beim Scrollen seitenweise nachladen (`offset` gibt es im
  Endpoint schon), nur sichtbare Zeilen rendern (Virtualisierung)
- Sortierung ins Backend verlagern (z. B. `/rows?sort=…&direction=…`
  über Polars), damit über den ganzen Datensatz sortiert wird
- vor oder zusammen mit der Control-Bar, da Filter dieselbe Frage
  Frontend oder Backend betrifft

## Scatter nutzt Preview-Rows

- `createScatterChartContent` zeichnet direkt `dataset.rows`; bei
  großen Uploads zeigt der Scatter nur die ersten 100 Punkte, ohne
  Hinweis
- Scatter wie die übrigen Charts über die Backend-Chart-Query laden,
  mit Punktlimit (`MAX_CHART_POINTS` in `chart_query.py`)
