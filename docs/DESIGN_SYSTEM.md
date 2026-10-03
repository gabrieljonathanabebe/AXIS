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

| Stufe   | Klassen             | Verwendung                                                                           | Blur        |
| ------- | ------------------- | ------------------------------------------------------------------------------------ | ----------- |
| thin    | `glass glass-thin`  | Panels                                                                               | `--blur-md` |
| regular | `glass`             | Collapsible Sections (Variante `widget`), Charts auf der Canvas (Default-Background) | keiner      |
| thick   | `glass glass-thick` | Dropdowns, Popover                                                                   | `--blur-lg` |

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

```text
┌ Cevyn                                                  ┐  TopBar
└────────────────────────────────────────────────────────┘
┌──┐
│◫ │  Active View
│▦ │
│  │
└──┘
Rail
```

TopBar:

- globale App-Ebene: Branding, später Workspace/Team, Account und
  Settings; keine View-Navigation;
- schlanke Leiste mit `glass glass-thin` und demselben Radius und
  Abstand wie die Panels;
- drei Spalten `1fr auto 1fr`, Wortmarke links auf einer Linie mit den
  Header-Icons der Panels, rechte Spalte für spätere Header Actions.

Navigation Rail (`NavigationRail`):

- Teil der AppShell, nicht des Visualize Workspace; immer sichtbar,
  unabhängig vom Collapse-State der Panels;
- schmale Glass-Fläche (`glass glass-thin`, 52 px) über die volle Höhe
  des Workspace;
- enthält ausschließlich Top-Level-Views, keine Settings;
- nur Icons als `IconButton` mit `variant="ghost"`, Tooltip über das
  Label; keine Cards um die Icons;
- Hover in Akzentfarbe, aktiver View zusätzlich mit `surface-active`
  und `aria-current="page"`.

Implementierte Views: Visualize, Data. Geplant: Share; AI eher als Panel
oder Overlay als als eigener View.

### Icons

Ein Icon steht für genau eine Bedeutung:

| Bedeutung               | Icon                  |
| ----------------------- | --------------------- |
| View Data               | `Database`            |
| View Visualize          | `ChartNoAxesCombined` |
| konkreter Datensatz     | `FileSpreadsheet`     |
| Dataset-Section (Build) | `FolderOpen`          |
| Fields                  | `Columns3`            |
| Inspector-Tab Data      | `Table2`              |
| Encodings               | `Waypoints`           |
| Build                   | `Blocks`              |
| Dashboard               | `LayoutDashboard`     |
| Zeilen (Rows)           | `Rows3`               |
| fehlende Werte          | `CircleDashed`        |
| doppelte Zeilen         | `Copy`                |

Die View-Icons der Rail werden an keiner anderen Stelle verwendet.

## 4. Visualize Workspace

```text
Build Panel | Canvas | Inspector
```

Die Canvas erhält den verbleibenden Raum.

Der Visualize Workspace ist **eine** gemeinsame Glass-Fläche
(`visualize-workspace glass glass-thin` mit `--radius-lg`). Build,
Canvas und Inspector haben darin keine eigene Fläche, keinen Schatten
und keinen großen Radius; sie sind nur durch Haarlinien
(`--color-border-subtle`) getrennt. TopBar und Navigation Rail bleiben
eigene Glass-Flächen.

### Panel

Alle drei Bereiche nutzen `Panel`.

- `isEmbedded` macht ein Panel zu einem Bereich innerhalb einer
  gemeinsamen Fläche: keine Glass-Klassen, kein Radius, Haarlinie zum
  vorherigen eingebetteten Panel (auf schmalen Viewports oben statt
  links). Ohne `isEmbedded` ist das Panel eine eigene Glass-Fläche
  (z. B. `DataPanel`).

- Header als eine Zeile: `IconBadge` mit Icon und kurzem Label, rechts
  `actions`. Keine Eyebrow-Überschrift über dem Titel.
- `icon` und `title` sind optional. `heading` ersetzt das Icon-Label
  durch eigenen Inhalt im selben `h2`; `title` bleibt ein String für
  die Labels „Hide …“ und „Show …“.
- Die Canvas zeigt über `heading` den Dashboard-Namen als
  `EditableText`, rechts Undo und Redo. Objektbezogene Aktionen gehören
  nicht in die Toolbar, sondern an das Objekt (siehe
  Chart-Aktionsleiste).
- Der Header hat eine feste Mindesthöhe, damit alle Panels auf
  derselben Höhe beginnen, auch ohne Actions.
- Inhaltshöhe: `isScrollable` lässt das Panel seinen Inhalt selbst
  scrollen (Build Panel, Inspector). `isFilled` lässt den Inhalt die
  Höhe füllen, das Kind scrollt selbst (Canvas mit `ChartGrid`, Data mit
  `DataTable`).

Build Panel und Inspector sind unabhängig einklappbar:

- `isCollapsed` und `onToggleCollapse` aktivieren das Verhalten; ohne
  `onToggleCollapse` gibt es keinen Toggle.
- `side` (`start | end`) bestimmt die Richtung des Toggle-Icons.
- Eingeklappt bleibt innerhalb des Workspace ein schmaler Strip (44 px)
  mit dem Panel-Icon als `IconButton` in Größe `sm` und mit Rahmen.
  Er wirkt dadurch nicht wie eine zweite Navigation Rail, deren Icons
  `ghost` sind.
- Der Inhalt wird nur ausgeblendet, nicht entfernt; Zustand wie
  Inspector-Tab und geöffnete Widgets bleibt erhalten.
- Cmd/Ctrl + B schaltet das Build Panel um, Cmd/Ctrl + I den Inspector
  (über die Command-Registry).
- Der Layout-Zustand ist UI-State (`useWorkspaceLayout`), nicht Teil
  des Workspace-Reducers.

Auf schmaleren Viewports können Panels zu Overlays oder Drawern
werden.

## 4a. Data Workspace

```text
[▦ sales.csv]                              [ Profile | Table ]
──────────────────────────────────────────────────────────────
▦ DATASET
┌ Rows ──┐ ┌ Fields ┐ ┌ Missing cells ┐ ┌ Duplicate rows ┐
│ 60     │ │ 6      │ │ 0  ▱▱▱▱▱▱▱▱   │ │ 0  ▱▱▱▱▱▱▱▱    │
──────────────────────────────────────────────────────────────
⫴ FIELDS 6
  # Measures 3
  ┌ revenue ───┐ ┌ profit ────┐ ┌ customers ─┐
  │ integer ·… │ │ integer ·… │ │ integer ·… │
  │ ▂▅█▆▃▂▁▃▅▂ │ │ ▃▅▇█▅▃▂▁▂▁ │ │ ▁▂▅▇█▆▄▃▂▁ │
  └────────────┘ └────────────┘ └────────────┘
```

- ein einzelnes `Panel` (`DataPanel`) mit `isFilled` als eigene
  Glass-Fläche, Datensatzname als Titel, rechts der
  Ansichts-Umschalter Profile | Table als `SegmentedControl`;
- Profile ist eine scrollbare Seite (`DatasetProfileView`) aus plain
  Sections mit Kachel-Raster, orientiert am Data Wrangler von VS Code;
- oben Kennzahlen des Datensatzes als `StatWidget`, darunter die Fields
  gruppiert nach Semantic Role als Untergruppen (gleiche Gruppen,
  Icons und Labels wie im Build Panel, Identifiers eingeklappt);
- jede Field-Kachel (`FieldProfileWidget`) ist quadratisch: Name,
  darunter leise Physical Type, Unique und Missing (nur wenn > 0),
  darunter die Semantic Role als `SelectControl` (deaktiviert, wenn nur
  eine Role erlaubt ist) mit Reset-Button (`IconButton`, ghost, xs) bei
  einem Override, darunter ein `MiniHistogram`, das die restliche Höhe
  füllt;
- Kacheln im `.auto-grid` mit `--grid-repeat: auto-fill` und 180 px
  Mindestbreite: wenige Kacheln behalten ihre Breite und stehen
  linksbündig, statt sich über die ganze Zeile zu dehnen;
- im Data View sind Kacheln pro Field gewollt; die Regel „nicht jedes
  Field als große Card“ gilt für das Build Panel;
- Laden und Fehler des Profils zeigt `EmptyState`; Table bleibt die
  Rohdatenansicht über `DataTable` und funktioniert ohne Profil.

## 5. Build Panel

Das Build Panel beantwortet:

> Was möchte ich bauen oder verwenden?

```text
BUILD

VISUALS
[ Scatter ] [ Line ] [ Bar  ]
[ Pie     ] [ Donut] [ More ]
─────────────────────────────
DATASET
[▦ sales.csv            ⤒ ]
   184K rows · 6 fields
─────────────────────────────
FIELDS
[ ⌕ Search fields          ]
   # Measures 2
   [ revenue ]
   [ profit  ]
   ABC Dimensions 1
   [ country ]
   📅 Time 1
   [ date    ]
[ + Calculated field       ]
```

### Sections

- Die Bereiche sind `CollapsibleSection` mit `variant="plain"`: keine
  eigene Fläche, kleiner Header in Versalien, Trennung durch eine
  Haarlinie statt durch eine Box.
- Flächen haben nur die Objekte selbst (Kacheln, Dataset-Karte,
  Chips). Keine Widgets in Widgets.
- Eine plain Section innerhalb einer plain Section ist eine
  Untergruppe: eingerückt um `--indent-nested`, normaler Titel ohne
  Versalien, keine Trennlinie.
- Header-Text ist sekundär und wird beim Hover primär; das Icon bleibt
  in Akzentfarbe.
- `CollapsibleSection` bietet dafür `variant` (`widget | plain`,
  Standard `widget`), `meta` für einen kleinen Zusatz neben dem Titel
  und `forceOpen`, das die Section anzeigt, ohne ihren eigenen Zustand
  zu verändern.
- Der Header besteht aus Trigger (Icon, Titel, `meta`), optionalen
  `actions` und einem eigenen Chevron-Button; Trigger und Chevron
  klappen beide. `actions` nimmt z. B. ein `IconButton` auf, ohne dass
  ein Button in einem Button liegt.
- Header-Icons in plain Sections sind einheitlich 14 px (zentral in
  `CollapsibleSection.css`).
- `--indent-nested` ist die gemeinsame Einrückung für verschachtelte
  Inhalte.
- `TextInput` nimmt ein optionales dekoratives `icon` links im Feld an
  (z. B. Suche); ohne `icon` bleibt das Markup unverändert.

### Visuals

- Icon-Raster aus `chartDefinitionList`; Icon in Akzentfarbe, kleines
  Label.
- Kachel und Drag-Overlay rendern denselben Inhalt
  (`ChartTypeOptionContent`).
- „More“ ist ein deaktivierter Platzhalter für weitere Charttypen und
  kein Eintrag der Chart Registry.

### Dataset

- `DatasetCard`: Name, Zeilenzahl (kompakt formatiert) und
  Field-Anzahl, rechts Upload/Replace als Icon-Button.
- Die ganze Karte nimmt Dateien per Drop an.
- Ohne Upload zeigt sie das Demo-Dataset aus dem Backend („Demo
  data“); eine große Upload-Fläche gibt es nicht.

### Fields

- Gruppen über `groupFields` aus `src/data/fieldGroups.ts`:

```text
#    Measures      measure
ABC  Dimensions    dimension
📅   Time          temporal
ID   Identifiers   identifier (standardmäßig eingeklappt)
```

- Die Zuordnung Semantic Role → Gruppe liegt nur in `getFieldGroupKey`
  und gilt für Build Panel und Profile View. Maßgeblich ist die
  effektive Role inklusive Nutzer-Override.
- Leere Gruppen werden ausgeblendet; die Anzahl steht als `meta` im
  Gruppen-Header.
- Field Chips zeigen nur den Namen; das Typ-Icon trägt der
  Gruppen-Header. Das Drag-Overlay rendert denselben Chip ohne Icon.
- Field Search filtert nach Namen vor dem Gruppieren; während der Suche
  sind alle Gruppen über `forceOpen` geöffnet.
- „+ Calculated field“ ist ein deaktivierter Einstieg. Calculated
  Fields erscheinen später als normale Fields in ihrer Gruppe, mit ƒx
  am Chip als Herkunftsmarker.

Nicht jedes Field als große Card darstellen.

## 6. Inspector

Inspector:

```text
Data
Appearance
Interaction
```

Der Inspector ist kontextsensitiv: Mit ausgewähltem Chart zeigt er die
Chart-Tabs, ohne Auswahl die Dashboard-Einstellungen
(`DashboardInspector`, Widgets „Dashboard“ und „Layout“, ohne Tabs).

Ein Widget repräsentiert ein Feature oder eine logisch
zusammengehörige Property-Gruppe.

Inspector-Widgets sind plain Sections wie im Build Panel:
`InspectorWidget` ist ein dünner Wrapper um `CollapsibleSection` mit
`variant="plain"`, ohne eigene Fläche, getrennt durch Haarlinien.
Abhängige Unteroptionen (`.inspector-widget-subproperties`) sind um
`--indent-nested` eingerückt.

Inspector-Widgets sind unabhängig vom Chart-Zustand auf- und
zuklappbar. Eine optionale Eye-Aktion im Header (`IconButton` mit
`variant="ghost"` und `size="xs"` im `actions`-Slot) steuert die
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
| Visual Select                | Symbol, Line Style, Font Weight | echte Vorschau statt Text                        | teilweise (`FontWeightControl`, `AlignmentControl`)          |
| Inline Text Editing          | Titel, Achsen, Dashboard-Name   | Text direkt am Objekt bearbeiten                 | teilweise (`EditableText`, `InlineTextInput`)                |
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

Eigene Presets:

`ColorControl` akzeptiert optional `presets`. Ohne die Prop gelten die
Standardfarben. Ein Preset kann statt einer Hex-Farbe einen
Token-Wert tragen und über `fill` eine eigene Vorschau-Fläche zeigen,
z. B. Glass, Surface oder transparent beim Chart-Background. Solche
Presets verwenden im Active State den Electric-Blue-Ring und eine feine
Kante, damit dunkle oder transparente Flächen sichtbar bleiben.

## 9a. AlignmentControl

`AlignmentControl` ist ein `SegmentedControl` für
`HorizontalAlignment` (`start | center | end`) mit Ausrichtungs-Icons.
Es wird für Titel- und Legend-Ausrichtung verwendet. Ausrichtungen im
Domain Model verwenden immer `start | center | end`, nicht
`left | right`.

## 9b. EditableText

`EditableText` bearbeitet Text direkt am Objekt:

- Anzeige als Text mit Text-Cursor und dezenter Hover-Fläche; die
  Textkante springt dabei nicht;
- Klick öffnet ein Input mit markiertem Text;
- Enter oder Blur übernimmt, Escape verwirft;
- leerer Text bedeutet automatischer Wert, der als Placeholder
  erscheint;
- Tastaturereignisse im Input werden nicht an Canvas-Shortcuts
  weitergegeben.

Inline-Editing und Inspector ändern denselben Wert über dieselbe
Action.

Die Edit-Hälfte ist als `InlineTextInput` eigenständig nutzbar, z. B.
als Overlay über Text, den nicht HTML rendert (Achsentitel in
ECharts). `InlineTextInput` besitzt Draft, Enter/Escape/Blur und die
Tastatur-Isolation. Ein Pointer-Down außerhalb des Inputs übernimmt den
Wert, auch wenn eine Bibliothek das Default-Verhalten unterdrückt.

Gemeinsames Styling liegt in `EditableText.css`:

- `.editable-text-input` für jedes Inline-Input;
- `.editable-text-highlight` für die Hover-Fläche, wenn der Text nicht
  als `EditableText`-Button gerendert wird.

Komponentenspezifische Klassen wie `.chart-axis-title-input` und
`.chart-axis-title-hover` enthalten nur Position und Größe, keine
eigene Optik.

## 9c. CommandButton

`CommandButton` rendert einen `WorkspaceCommand` als `IconButton`:
Label, Icon und Aktion kommen aus dem Command, `disabled` aus
`isEnabled`. `size` (`sm | md`) wird an `IconButton` durchgereicht;
das Icon ist 16 bzw. 18 px groß.

Buttons für Workspace-Befehle werden immer über `CommandButton` aus der
Registry gebaut, nicht als eigener `IconButton` mit eigenem Handler.
So bleiben Button und Shortcut derselbe Befehl.

`IconButton` zeigt `disabled` mit reduzierter Opacity, Cursor
`not-allowed` und ohne Hover-Effekt.

`IconButton` bietet `size` (`xs | sm | md`, Standard `md`) und
`variant` (`default | ghost`, Standard `default`). `ghost` hat keine
Fläche, keinen Rahmen und keinen Schatten; die Farben für Hover und
`is-active` kommen weiter aus `.control`. Für ruhige Aktionen in
Section-Headern.

## 9d. StatWidget

`StatWidget` ist eine ruhige Kennzahl-Kachel auf `Widget`-Basis (keine
Glass-Fläche, nicht interaktiv): Icon und Label als `IconBadge`, große
Zahl (`--font-size-lg`, tabular nums), optional ein Anteilsbalken
(`share` von 0 bis 1) und ein leiser Hinweis (`hint`, einzeilig mit
Ellipsis und Tooltip).

- `value` ist bereits formatiert; formatiert wird über
  `src/data/formatNumber.ts`.
- Der Balken zeigt immer den Anteil des Werts am Ganzen.
- Padding und Radius entsprechen den Chart-Picker-Kacheln. Andere
  Kacheln (z. B. `FieldProfileWidget`) nutzen die Basisklassen
  `stat-widget` und `stat-widget-hint` statt eigener Kopien.

## 9e. MiniHistogram

`MiniHistogram` zeichnet eine Liste von `HistogramBar`s (`count`,
`label`, optional `isMuted`) als kleine Balken in Electric Blue, in
reinem CSS ohne ECharts.

- Höhe relativ zum größten Balken; leere Bins bleiben als 1-px-Linie
  sichtbar.
- Jeder Balken liegt in einer Spalte über die volle Höhe; der Tooltip
  zeigt Label und Anzahl.
- `isMuted` dämpft einen Balken, z. B. „Other“ bei Dimensions.
- Standardgröße 96 × 32 px, anpassbar über `--mini-histogram-width`
  und `--mini-histogram-height`.
- Die Komponente kennt keine Fields; die Umrechnung aus dem Profil
  liegt in `createDistributionBars`.

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

`.auto-grid` ist über Custom Properties konfigurierbar: `--grid-min`
(Mindestbreite), `--grid-gap` und `--grid-repeat` (`auto-fit` als
Standard, `auto-fill`, wenn wenige Kacheln ihre Breite behalten sollen).

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

- Move: obere Leiste, Cursor `grab`, Grip-Icon mittig bei Hover oder
  Auswahl;
- Resize: schmale Zonen an allen vier Kanten und größere Zonen an den
  vier Ecken mit passendem Resize-Cursor und dezentem Hover-Highlight.

Die Größe der Handles (`--chart-handle-size`) ist unabhängig vom
Container-Padding. Der Titel-Header ist kein Move-Handle, damit er
editierbar bleibt.

Move und Resize rasten während des Drags live im Canvas-Grid ein.

### Chart Container

Der Container eines Charts wird im Inspector unter „Container“
formatiert:

- Background über `ColorControl` mit den Presets Glass (Default),
  Surface und None sowie eigener Farbe;
- Padding über `ScrubbableNumber`;
- Radius über `Slider`.

Der Titel sitzt als HTML-Header über dem Plot. Sein seitlicher Abstand
ist mindestens halb so groß wie der Radius, damit Start- und
End-Ausrichtung nicht in die Rundung laufen.

### Selection

Hover und Auswahl werden als innerer Ring über `::after` gezeigt
(Hover: `--color-border-default`, Auswahl: `--color-border-accent`).
Der Ring liegt innerhalb des Charts, wird daher weder vom Canvas-Rand
abgeschnitten noch von Nachbarn überdeckt und folgt dem Radius. Ein
Klick auf freie Canvas-Fläche hebt die Auswahl auf.

Neu hinzugefügte Charts werden ins Bild gescrollt, fokussiert und
einmalig kurz über den Ring hervorgehoben. Bei `prefers-reduced-motion`
entfällt die Animation.

### Chart-Aktionsleiste

Der ausgewählte Chart zeigt oben rechts auf Höhe des Titels eine
Aktionsleiste mit Duplicate und Delete (`CommandButton`, Größe `sm`).
Sie liegt über Auswahlring und Layout-Handles und erscheint nur am
ausgewählten Chart.

### Tastaturbedienung

Auf dem fokussierten Chart:

| Taste               | Aktion                                      |
| ------------------- | ------------------------------------------- |
| Pfeiltasten         | um eine Grid-Zelle verschieben              |
| Shift + Pfeiltasten | Größe über rechte bzw. untere Kante ändern  |
| Delete / Backspace  | Chart löschen                               |
| Cmd/Ctrl + D        | Chart duplizieren                           |
| Escape              | Datenauswahl aufheben, danach Chart-Auswahl |

Shortcuts greifen nur, wenn der Chart selbst fokussiert ist, nicht ein
Element darin. Delete und Duplicate kommen aus der Command-Registry,
Pfeiltasten und Escape aus `ChartItem`. Nach dem Löschen erhält der nächste Chart in
Lesereihenfolge den Fokus; gibt es keinen Chart mehr, die leere Canvas.

Global, außer in Textfeldern:

| Taste                                  | Aktion                 |
| -------------------------------------- | ---------------------- |
| Cmd/Ctrl + Z                           | Rückgängig             |
| Cmd/Ctrl + Shift + Z oder Cmd/Ctrl + Y | Wiederholen            |
| Cmd/Ctrl + B                           | Build Panel umschalten |
| Cmd/Ctrl + I                           | Inspector umschalten   |

Escape darf nie der einzige Weg für eine Aktion sein. Im Vollbildmodus
behält sich der Browser Escape vor.

### Data Selection Highlight

Eine Datenauswahl im Chart wird über Kontrast statt über neue Farben
kommuniziert:

- nicht ausgewählte Elemente werden mit einheitlicher Opacity
  (`DIMMED_OPACITY = 0.2`) abgeblendet;
- ausgewählte Elemente behalten ihre Farbe; Kategorien wechseln durch
  eine Auswahl nie ihre Farbe;
- Elemente behalten ihre Position, damit keine Scheinanimation entsteht;
- abgeblendete Serien zeigen keine Labels;
- der Tooltip benennt Highlight-Werte mit der ausgewählten Kategorie;
- ein Brush-Rechteck verwendet die Akzentfarbe als Rahmen und eine
  schwach transparente Akzentfläche und bleibt sichtbar, solange seine
  Selection aktiv ist.

### Drop Targets

Drop Targets tragen ihre Bedeutung als typisiertes `DropTarget`.
`EmptyState` kann über `dropId` und `dropTarget` selbst als Drop Target
dienen.
