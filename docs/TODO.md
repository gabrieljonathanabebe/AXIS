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
  Tooltips, Achsenlabels, `DataTable`, Selection-Werte
- fehlende Varianten (z. B. Währung, feste Nachkommastellen) dort
  ergänzen statt lokal
