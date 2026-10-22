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

## Optik der Control-Rows im Format-Popover

- Aussehen der Zeilen (`ControlRow`) im Format-Popover überarbeiten
- Einrückung der abhängigen Unteroptionen
  (`.format-widget-subproperties`, `--indent-nested`) überarbeiten,
  z. B. bei Currency und Decimals in `NumberFormatControls`
- Idee: Zeilen eines Abschnitts nach Baustein gruppieren (Text, Fill,
  Stroke, Number format) mit kleinen Gruppen-Überschriften; die
  Fill-Gruppe der Marks zeigt die Farb- bzw. Palettenzeile zusammen mit
  `FillControls`, obwohl die Farbe in der Spec getrennt bleibt;
  Überschriften nur bei mindestens zwei Gruppen in einem Abschnitt
- eigener Slice nach „Generische Style-Bausteine“; konkrete Wünsche
  zu Beginn des Slices klären

## Weitere Dashboard-Einstellungen

- Canvas-Hintergrund als Dashboard-Einstellung, analog zu den
  Container-Presets (Glass, Surface, None, eigene Farbe)
- Innen-Padding der Canvas als Teil von `DashboardLayout`
- beides im Dashboard-Popover der Canvas-Toolbar
  (`DashboardSettingsPopover`), undo-fähig über `dashboard/updateLayout`
  bzw. `dashboard/update`

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

## Control für das Tooltip-Werteformat

- `interaction.tooltip.numberFormat` (`NumberFormat`) wird
  ausgewertet, hat aber kein Control
- `auto` übernimmt das ganze Format der Y-Achse; ein expliziter Stil
  überschreibt es samt Währung, Nachkommastellen, Präfix und Suffix
- Control im Element „Tooltip“ des Format-Popovers ergänzen
  (`TooltipWidget`) über `NumberFormatControls` wie bei den
  Datenlabels

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
- das Backend hat seit dem Slice „Backend-Tests“ pytest-Tests
  (siehe `docs/ROADMAP.md`)

## CI-Pipeline mit GitHub Actions und Docker-Images

- GitHub-Actions-Pipeline, die Checks und Tests für Backend und
  Frontend ausführt
- je ein Docker-Image für Frontend und Backend
- möglichst zusammen mit den Tests umsetzen; offen, ob das noch in
  denselben Slice passt
