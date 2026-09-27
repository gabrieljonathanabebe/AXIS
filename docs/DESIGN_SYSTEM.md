# Cevyn – Design System

## 1. Design Direction

Cevyn verwendet eine moderne, minimalistische und hochwertige
Produktoberfläche.

Visuelle Richtung:

- Apple-inspired Liquid Glass
- Glassmorphism mit Zurückhaltung
- dunkle Graphite- und Near-Black-Flächen
- neutrale Weiß-/Grau-Verläufe
- Electric Blue als gezielter Accent
- subtile Borders
- Layered Shadows
- Inner Highlights
- Backdrop Blur
- hohe visuelle Ruhe

Nicht erwünscht:

- Neon-/Cyberpunk-Look
- Gaming-Ästhetik
- übermäßige Glows
- unnötige visuelle Effekte
- zu viele verschachtelte Glass Cards

Daten und Inhalt bleiben visuell dominant.

### Liquid Glass Surfaces

Glasflächen werden zentral über die Klasse `.glass`
(`src/styles/glass.css`) und die `--glass-*`-Tokens umgesetzt, nicht
pro Komponente.

| Stufe   | Klassen             | Verwendung                              | Blur        |
| ------- | ------------------- | --------------------------------------- | ----------- |
| thin    | `glass glass-thin`  | Panels                                  | `--blur-md` |
| regular | `glass`             | Inspector Widgets, Collapsible Sections | keiner      |
| thick   | `glass glass-thick` | Dropdowns, Popover                      | `--blur-lg` |

Bestandteile:

- `--glass-fill-*`: leichter vertikaler Verlauf, oben heller;
- `--glass-border`: Lichtkante als Verlaufsring, oben links hell;
- `--glass-highlight`: feine innere Glanzlinie an der Oberkante;
- `--glass-shadow`: naher Kontaktschatten plus weiter Tiefenschatten;
- `--background-ambient`: weiche Farbflächen hinter der App, damit das
  Glas sichtbar Licht bricht.

Regeln:

- Blur nur auf Panels und Overlays, nicht auf verschachtelten Elementen.
- Bei scrollenden Containern sitzt `.glass` auf der äußeren,
  nicht scrollenden Hülle.
- Kleine Elemente wie Chips erhalten nur `--glass-highlight`, kein
  volles Glas.
- Bei `prefers-reduced-transparency` werden Glasflächen deckend.

### Typografie

Cevyn verwendet `Inter Variable`, lokal eingebunden über
`@fontsource-variable/inter`. Überschriften nutzen Semibold mit leicht
reduziertem Zeichenabstand. Numerische Werte in Controls und Tooltips
verwenden `tabular-nums`.

## 2. Electric Blue

Electric Blue wird sparsam verwendet für:

- Active State
- Selection
- Hover
- Focus
- Drag Targets
- Handles
- Sliders
- wichtige aktive Controls

Ein Glow kann bestehen aus:

```text
bright core
+ blue edge
+ soft glow
+ low-opacity ambient glow
```

Nicht jedes blaue Element benötigt einen Glow.

## 3. Layout Architecture

Die langfristige App Shell:

```text
Top Bar
────────────────────────────────────────

Navigation Rail | Active Workspace
```

Navigation Rail:

- schmal;
- icon-basiert;
- Tooltips;
- aktiver Workspace klar hervorgehoben.

Geplante Workspaces:

- Visualize
- Data
- AI
- Share

## 4. Visualize Workspace

```text
Build Panel | Canvas | Inspector
```

Build Panel und Inspector sollen langfristig unabhängig collapsible
sein.

Die Canvas erhält den verbleibenden Raum.

Auf schmaleren Viewports können Panels zu Overlays oder Drawern
werden.

## 5. Build Panel

Das Build Panel beantwortet:

> Was möchte ich bauen oder verwenden?

Aktuelles Ziel:

```text
BUILD

VISUALIZATIONS
[ Scatter ] [ Line ]
[ Bar     ] [...]

DATASET
sales.csv
184k rows · 6 fields

FIELDS
# revenue
# profit
ABC country
◷ date

+ Calculated field
```

### Dataset

Ohne Dataset:

```text
Upload CSV
```

Nach erfolgreichem Upload soll der große Upload-Bereich durch eine
kompakte Dataset-Darstellung ersetzt werden.

### Fields

Fields sollen kompakt und skalierbar dargestellt werden.

Semantic Icons:

```text
#    numeric
ABC  categorical
◷    temporal
ID   identifier
ƒx   calculated
```

Nicht jedes Field als große Card darstellen.

## 6. Inspector

Inspector:

```text
Data
Appearance
Interaction
```

Ein Widget repräsentiert ein Feature oder eine logisch
zusammengehörige Property-Gruppe.

Inspector-Widgets sind unabhängig vom Chart-Zustand auf- und
zuklappbar. Eine optionale Eye-Aktion im Header steuert die
Sichtbarkeit des Features im Chart. Zugeklappt und ausgeblendet sind
verschiedene Zustände. Die Eigenschaften bleiben auch bei
ausgeblendetem Feature editierbar.

Nicht jede einzelne Scalar Property erhält ein eigenes Widget.

Beispiel:

```text
Labels
├── Position
├── Font Size
├── Weight
└── Color
```

statt mehrfach verschachtelter Einzelwidgets.

Seltene technische Optionen gehören in:

```text
Advanced
```

## 7. Control Mapping

### Boolean Feature

Verwenden:

`Toggle`

Beispiele:

- Area Fill Enabled
- Border Enabled

### Visual Visibility

Bevorzugt:

`Icon Toggle Button`

Beispiele:

- Grid
- Legend
- Labels
- Chart Title
- X/Y Axis
- Tooltip
- Zoom
- Animation

### Wenige exklusive Optionen

Verwenden:

`SegmentedControl`

Beispiele:

```text
Linear | Log
Vertical | Horizontal
Single | Multiple
Item | Axis
```

### Viele Optionen

Verwenden:

`Select`

### Color

Verwenden:

`ColorControl`

Keine neuen spezialisierten Color Picker erzeugen.

Darstellungsvarianten:

- `inline` zeigt Preset-Farben direkt in der Zeile;
- `compact` zeigt einen einzelnen Farbauslöser und öffnet Presets,
  Picker und HEX-Eingabe in einem Popover.

`GradientControl` kombiniert zwei kompakte ColorControls mit einer
Vorschau des Verlaufs. Es wird für Low-/High-Farben kontinuierlicher
Farbskalen verwendet. Die eigentliche Farbauswahl bleibt vollständig
im zentralen ColorControl.

### Offener numerischer Wert

Verwenden:

`ScrubbableNumber`

Beispiele:

- Font Size
- Item Width
- Item Height
- Min
- Max

### Begrenzter visueller Wert

Verwenden:

`Slider + ScrubbableNumber`

Beispiele:

- Opacity
- Point Size
- Glow Intensity

### Numerisches Intervall

Verwenden:

`Range Slider + Inputs`

Nur verwenden, wenn tatsächlich ein Min-/Max-Intervall editiert wird.

### Field

Verwenden:

`Field Picker / Combobox`

Drag & Drop soll zusätzlich möglich sein, wenn es zum Workflow passt.

### Multiple Fields

Verwenden:

`Multi-Select / Chips`

### Text

Verwenden:

`Text Input`

### Moderne Control Patterns

Cevyn bevorzugt direkte, visuelle Controls gegenüber Texteingaben und
langen Dropdowns. Für neue Controls wird zuerst geprüft, ob eines der
folgenden Patterns passt.

Status: `implementiert`, `teilweise`, `geplant`.

| Pattern                      | Beispiel in Cevyn               | Nutzen                                           | Status                                                       |
| ---------------------------- | ------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| Scrubbable Number            | Font Size, Radius, Opacity      | Wert direkt ziehen statt eintippen               | implementiert (`ScrubbableNumber`)                           |
| Modifier Scrubbing           | Shift = grob, Alt = fein        | präzise Einstellung                              | teilweise (Shift rastet `RotationDial` in 15°-Schritten ein) |
| Visual Position Picker       | Label Position                  | 3×3-Feld statt Dropdown                          | geplant                                                      |
| XY Pad                       | Offset X/Y                      | Punkt in kleiner Fläche verschieben              | geplant                                                      |
| Rotation Dial                | Axis Label Rotation             | drehen statt Gradzahl eintippen                  | implementiert (`RotationDial`)                               |
| Gradient Editor              | Continuous Color Scale          | Stops direkt auf dem Verlauf bewegen             | teilweise (`GradientControl` mit Start- und Endfarbe)        |
| Field Wells / Drop Zones     | X, Y, Color, Size               | Field direkt auf ein Encoding ziehen             | teilweise (X/Y-Achsen im Chart)                              |
| Chips / Tokens               | Filter, Series, Dimensions      | kompakt, sortierbar, entfernbar                  | teilweise (Field Chips im Build Panel)                       |
| Searchable Combobox          | Field Picker                    | tippen statt lange Listen durchsuchen            | geplant                                                      |
| Visual Select                | Symbol, Line Style, Font Weight | echte Vorschau statt Text                        | teilweise (`FontWeightControl`)                              |
| Context Toolbar              | selektierter Chart              | wichtigste Aktionen direkt am Objekt             | geplant                                                      |
| Command Palette              | ⌘K → „Add reference line“       | schnelle Bedienung ohne UI-Suche                 | geplant                                                      |
| Inline Popover               | Farbe, Tooltip, Axis            | Details dort bearbeiten, wo sie gebraucht werden | teilweise (`ColorControl`)                                   |
| Mini Preview Control         | Line Width, Line Style, Area    | Einstellung direkt als Vorschau sehen            | geplant                                                      |
| Direct Manipulation im Chart | Reference Line                  | Element im Chart direkt ziehen                   | geplant                                                      |
| Smart Defaults + Auto        | Axis Min/Max, Tick Count        | Werte nur bei Bedarf setzen                      | teilweise (automatische Achsentitel, Tick Count Auto/Custom) |

Regeln:

- Ein Pattern wird als wiederverwendbares Control in `components/ui`
  gebaut und nicht als One-off in einem Widget.
- Jedes visuelle Control bietet zusätzlich eine präzise Eingabe oder
  Anzeige des Werts.
- Der Status in dieser Tabelle wird erst angepasst, wenn das Pattern im
  Code existiert.

## 8. ScrubbableNumber

`ScrubbableNumber` ist ein wiederverwendbares numerisches Control.

Es eignet sich insbesondere für offene oder datenabhängige numerische
Werte.

Bereits etablierter Use Case:

```text
Labels
→ Font Size
→ ScrubbableNumber
```

Weitere geeignete Fälle:

- Axis Min / Max
- Legend Font Size
- Legend Item Dimensions
- Padding
- Offsets

Ein Slider soll nicht automatisch durch ScrubbableNumber ersetzt
werden.

Für stark visuelle, begrenzte Werte kann die Kombination aus Slider
und ScrubbableNumber besser sein.

## 9. ColorControl

Zentrale wiederverwendbare Komponente:

```tsx
<ColorControl
  value={color}
  onChange={...}
/>
```

Grundstruktur:

- fünf Preset Swatches;
- ein Custom Swatch.

Vor Auswahl einer Custom Color zeigt der Custom Swatch einen
Farbverlauf.

Nach Auswahl zeigt er die zuletzt gewählte Custom Color.

Die Custom Color bleibt erhalten, auch wenn anschließend ein Preset
ausgewählt wird.

Active State:

- Electric Blue Ring;
- subtiler Glow;
- nicht nur Farbe als Zustandsindikator.

Custom Picker kann über `react-colorful` umgesetzt werden.

Die Cevyn-Oberfläche um den Picker bleibt eigenes UI.

Opacity wird zunächst getrennt von Color behandelt.

## 10. Legend

Legend erklärt diskrete Series oder Kategorien.

Beispiel:

```text
Series = Country

Germany
France
Italy
```

Legend gehört primär zu:

```text
Inspector
→ Appearance
```

Interaktives Legend-Verhalten gehört zu:

```text
Inspector
→ Interaction
```

Die Legend Interaction erscheint nur bei einer relevanten Legend. Der
Eye-Button aktiviert oder deaktiviert die Auswahl, ohne die sichtbare
Legend auszublenden. Als Auswahlmodi stehen `Multiple` und `Single`
zur Verfügung.

## 11. Color Scale

Color Scale erklärt kontinuierliche numerische Color Encodings.

Beispiel:

```text
Color = Revenue
```

Semantik:

```text
Categorical Color
→ Legend

Continuous Numeric Color
→ Color Scale
```

ECharts `visualMap` ist ein Renderer-Detail.

Im Cevyn UI heißt das Feature `Color Scale`.

Der aktuelle Scatter-Inspector unterstützt:

- Sichtbarkeit;
- Position links oder rechts;
- vertikale oder horizontale Ausrichtung;
- Auto-/Custom-Minimum und -Maximum;
- Low-/High-Farben über GradientControl;
- ein- und ausblendbare Endlabels.

## 12. Chart Tooltips

Chart-Tooltips verwenden standardmäßig strukturierte Zeilen mit
Feld- oder Seriennamen und lokal formatierten Werten.

Für Line und Bar steht der X-Wert als Überschrift über den sichtbaren
Serienwerten. Scatter zeigt die tatsächlich belegten X-, Y-, Size- und
Color-Encodings. Inhalte aus Datasets werden vor der Ausgabe als HTML
escaped.

Tooltips werden an `body` angehängt und daher nicht vom Chart-Rahmen
abgeschnitten.

## 13. Reuse Rules

Vor dem Erstellen neuer UI:

1. bestehende Komponente suchen;
2. prüfen, ob eine Prop-Erweiterung sinnvoll ist;
3. bestehende CSS Tokens und Klassen prüfen;
4. erst danach neue generische Abstraktion erstellen.

Nicht:

```text
LabelFontSizeInput
LegendFontSizeInput
AxisFontSizeInput
```

wenn:

```text
ScrubbableNumber
```

alle drei Fälle abdecken kann.

## 14. CSS

Custom CSS bleibt aktuell ein zentraler Teil des UI-Systems.

Bevor neue Styles geschrieben werden:

- bestehende Design Tokens prüfen;
- bestehende Utility-/Component-Klassen prüfen;
- bestehende Glass Surfaces prüfen;
- bestehende Spacing-/Radius-Patterns prüfen.

Keine nahezu identischen lokalen Styles kopieren.

## 15. Interaction States

Komponenten sollen mindestens sinnvolle Zustände berücksichtigen:

- default
- hover
- active
- selected
- focus
- disabled

State darf nicht ausschließlich durch Farbe kommuniziert werden.

Zusätzlich können verwendet werden:

- Fill
- Border
- Icon
- Shape
- Tooltip
- `aria-label`

## 16. Direct Manipulation

Langfristig:

Fields und Visuals sind Drag Sources.

Während eines Drag-Vorgangs werden relevante Drop Targets sichtbar.

Beispiel:

```text
Field
→ drag
→ X Axis
```

oder:

```text
Field
→ drag
→ Color Encoding
```

Chart-Drag und ECharts-Interaktionen müssen getrennt bleiben.

Dashboard Objects werden nicht über ihre gesamte Fläche gezogen, damit
Zoom, Tooltip und Selection im Chart nicht gestört werden.

### Chart Layout Handles

Charts auf der Canvas verwenden Layout-Zonen im freien Rand um den Plot:

- Move: obere Leiste, Cursor `grab`, Grip-Icon bei Hover oder Auswahl;
- Resize: schmale Zonen an allen vier Kanten und größere Zonen an den
  vier Ecken mit passendem Resize-Cursor und dezentem Hover-Highlight.

Move und Resize rasten während des Drags live im Canvas-Grid ein.

### Selection

Ein selektierter Chart erhält einen durchgezogenen statt gestrichelten
Rahmen in Akzentfarbe. Ein Klick auf freie Canvas-Fläche hebt die
Auswahl auf.

Neu hinzugefügte Charts werden ins Bild gescrollt und einmalig kurz
hervorgehoben. Bei `prefers-reduced-motion` entfällt die Animation.

### Drop Targets

Drop Targets tragen ihre Bedeutung als typisiertes `DropTarget`.
`EmptyState` kann über `dropId` und `dropTarget` selbst als Drop Target
dienen.
