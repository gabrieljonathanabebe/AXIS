# Cevyn – To-do

Punkte, die während eines Slices auffallen, aber nicht zu dessen Scope
gehören. Sie werden hier gesammelt, damit der aktuelle Slice fokussiert
bleibt.

Ein Punkt verlässt diese Liste, wenn er erledigt ist oder als geplanter
Scope in `docs/ROADMAP.md` übernommen wird.

## Bug: Datenlabels bei Line-Charts fehlen

- „Labels → Visible“ wirkt bei Line-Charts teilweise nicht: ECharts
  zeichnet Labels einer Line-Serie nur an ihren Symbolen
  (`LineView`: `showSymbol && symbolDraw.updateData`)
- der Adapter schaltet die Symbole ab bei mehr als 30 Punkten
  (`MAX_LINE_SYMBOLS` in `createAggregatedSeriesOption`) und wenn
  „Show symbol“ aus ist; damit verschwinden auch die Labels
- Fix-Idee: bei sichtbaren Labels Symbole technisch an lassen und
  unsichtbar zeichnen, wenn keine Punkte gewünscht sind; bei vielen
  Punkten `labelLayout: { hideOverlap: true }`
- im Browser prüfen: wenige und viele Punkte, Symbole an und aus, mit
  und ohne Selection (Labels der Basis-Serie sind bei Selection bewusst
  aus)

## Chart-Zusammenfassung zum ausgewählten Chart

- eine kompakte Karte zum ausgewählten Chart; ursprünglich über den
  Inspector-Tabs geplant, die es nicht mehr gibt; neuer Ort offen,
  z. B. Kopf des Abschnitts „Chart data“ im Build Panel
- Darstellung als Glass-Widget oder plain Section, noch zu entscheiden
- Icon des Charttyps (z. B. Line) und darunter ein Satz, der den
  Charttyp beschreibt
- Icon und Beschreibung möglichst aus der Chart Registry
  (`chartDefinitions`) statt pro Komponente

## Weitere Actions in der Canvas-Toolbar

- die schwebende Canvas-Toolbar zeigt aktuell Undo, Redo, Format und
  die Dashboard-Einstellungen
- weitere canvasbezogene Actions ergänzen, z. B. Zoom, Save, Export
- als Commands über die Command-Registry und `CommandButton`

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

## Auto-Hide der Canvas-Toolbar

- die Toolbar gehört zum Editor, nicht zum Dashboard, und soll die
  Seite möglichst wenig überdecken
- ausblenden, wenn nicht gebraucht; einblenden bei Hover am oberen
  Rand der Canvas, per Shortcut und kurz nach einer Aktion
- im späteren Präsentationsmodus ganz ausgeblendet

## Cards mit Text-Werten

- Cards sollen auch kategorische Werte zeigen, z. B. Spieler- oder
  Vereinsname in einem Fußball-Dashboard
- kein eigener Objekttyp und kein `variant`: Zahl oder Text folgt aus
  der Reduktion des Felds, Standard und Auswahl aus der Semantic Role
- eigene `CardReduction` neben `GroupAggregation`, damit
  Text-Reduktionen nicht in die Chart-Typen gelangen: `single` (einziger
  Wert, sonst „Multiple“), `mode` (häufigster Wert), `top` (bester Wert
  nach einem Measure, mit `rankBy`)
- `card-query` liefert dann `value: number | string | null`;
  Zahlenformate gelten nur für Zahlen

## Tests für das Frontend

- steht zeitnah an
- passende Tests für die Frontend-Logik, Test-Framework noch zu
  entscheiden
- das Backend hat pytest-Tests (`uv run pytest`); die CI-Pipeline ist
  in `docs/ROADMAP.md` (Alpha, 3.13) geplant

## Stacked Area für Linien-Charts

- Option, Flächen mehrerer Serien zu stapeln statt zu überlagern;
  ungestapelte Flächen ab drei Serien vermischen sich zu bedeutungslosen
  Farben
- Gestapelt summiert die Werte; die oberste Linie zeigt die Summe,
  Tooltip und Labels müssen das berücksichtigen
- Prüfen, ob ein Hinweis sinnvoll ist, wenn Area bei vielen Serien oder
  bei einer ungeordneten Kategorie-Achse aktiv ist
- zusammen mit „Stacked Bar Chart“ denken: eine gemeinsame Einstellung
  für Stapeln (aus, gestapelt, 100 %) statt je eigener Logik

## Stacked Bar Chart

- Balken mehrerer Serien übereinander statt nebeneinander; heute
  gruppiert ECharts die Serien eines Bar-Charts nebeneinander
- Variante 100 % gestapelt für Anteile je Kategorie
- Labels: Wert je Segment und optional Summe über dem Stapel
- Cross-Highlight und Tooltip mit gestapelten Werten prüfen

## Horizontal Bar Chart

- Balken horizontal, sinnvoll bei langen Kategorienamen und Rankings
- eher Ausrichtung als Option des bestehenden Bar-Charts als eigener
  Charttyp; im Adapter tauschen Kategorie- und Werteachse
- Achsen-Widgets, Gridlines, Labels-Position und Brush müssen die
  getauschten Achsen berücksichtigen
- gilt auch für gestapelte Balken

## Heatmap-Matrix

- zwei Dimensionen als Zeilen und Spalten, ein Measure als Farbe der
  Zelle, z. B. Umsatz je Land und Monat
- nutzt die kontinuierliche Farbskala (`colorScale.continuous`,
  `createContinuousColorVisualMap`)
- braucht eine Visual Query mit zwei Gruppierungen; prüfen, ob das
  bestehende `series`-Encoding als zweite Achse reicht
- in `docs/ROADMAP.md` unter „Nach dem Alpha – Visualisierung“ als
  weiterer Charttyp vorgesehen

## Histogramm

- Verteilung eines Measures: Anzahl der Werte je gleich breitem Bin
- das Profiling im Backend berechnet bereits Histogramme; Binning für
  eine Chart-Query wiederverwenden statt neu bauen
- Optionen: Anzahl der Bins bzw. Binbreite; Balken ohne Abstand,
  Achse mit Wertebereichen statt Kategorien
- optional später nach einer Dimension unterteilt (überlagert oder
  gestapelt)

## Kombi-Chart: Balken und Linie

- Balken für ein Measure und Linie für ein zweites, z. B. Umsatz und
  Marge, häufig mit zweiter Y-Achse
- verbreitet in BI-Dashboards; braucht je Measure einen Mark-Typ und
  eine Achsenzuordnung in der Spec
