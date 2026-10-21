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

| Stufe   | Klassen              | Verwendung                                                                    | Blur        |
| ------- | -------------------- | ----------------------------------------------------------------------------- | ----------- |
| thin    | `glass glass-thin`   | Panels                                                                        | `--blur-md` |
| regular | `glass`              | Collapsible Sections (Variante `widget`), Charts mit Background Surface       | keiner      |
| liquid  | `glass glass-liquid` | Charts mit Background Glass                                                   | `--blur-md` |
| thick   | `glass glass-thick`  | Dropdowns, Popover, schwebendes Editor-Chrome (Canvas-Toolbar, Ask Cevyn Bar) | `--blur-lg` |

`glass-liquid` ist die durchscheinende Stufe: Füllung ab transparent
mit einem Hauch Weiß unten (`--glass-fill-liquid`), Blur mit
Sättigung, hellere Lichtkante (`--glass-border-liquid`) und zwei feine
Kantenlinien (`--glass-highlight-liquid`), ohne weißen Glanzfleck oder
inneres Leuchten. Sie wirkt nur auf einem Hintergrund mit Farbverlauf,
deshalb liegt sie auf der Canvas-Fläche.

Bestandteile:

- `--glass-fill-*`: leichter vertikaler Verlauf; im Dark Theme
  beginnen `thin`, `regular` und `liquid` oben transparent, damit das
  Glas nicht milchig wirkt;
- `--glass-border`: Lichtkante als Verlaufsring, oben links hell;
- `--glass-highlight`: feine innere Glanzlinie an der Oberkante;
- `--glass-shadow`: naher Kontaktschatten plus weiter Tiefenschatten;
- `--glass-fill-elevated`: hellere, fast deckende Füllung für Flächen,
  die über Karten schweben (Popover am Chart); im Dark Theme heller als
  die Karten, weil höhere Ebenen dort heller wirken;
- `--background-ambient`: weiche Farbflächen hinter der App, damit das
  Glas sichtbar Licht bricht;
- `--canvas-background`: eigene, leicht aufgehellte Fläche der Canvas
  mit Blau oben und Violett unten rechts; Grundlage für Glass-Charts.

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

Electric Blue ist keine Datenfarbe. Blau bedeutet in Cevyn Zustand
(ausgewählt, gezogen, fokussiert), damit Auswahl, Brush und Format-Fokus
auf jedem Chart lesbar bleiben. Die Standardfarben der Daten beginnen
deshalb mit Teal (`#199E8A`, `appearance.color`, `line.areaColor`) und
folgen der Palette `DEFAULT_CATEGORICAL_PALETTE` (`charts/colorPalettes.ts`,
Preset „Default“): Teal, Orange, Violett, Amber, Magenta. Die Palette ist
für Farbsehschwächen auf der dunklen Fläche geprüft; im Light Mode liegt
Amber knapp unter 3:1. Blau bleibt als Preset im `ColorControl` wählbar.

### Danger

Fehler verwenden eigene Tokens statt Electric Blue:

- `--color-danger`: Text und Icon eines Fehlers;
- `--color-danger-soft`: Fläche, z. B. Badge im Error-State;
- `--color-border-danger`: Rand dazu.

Beispiele: `EmptyState` mit `tone="danger"`, Upload-Fehler im Build
Panel (`.panel-error`), Fehlermeldungen von Ask Cevyn.

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
| Encodings               | `Waypoints`           |
| Build                   | `Blocks`              |
| Dashboard               | `LayoutDashboard`     |
| Zeilen (Rows)           | `Rows3`               |
| fehlende Werte          | `CircleDashed`        |
| doppelte Zeilen         | `Copy`                |

Die View-Icons der Rail werden an keiner anderen Stelle verwendet.

## 4. Visualize Workspace

```text
Build Panel | Canvas
```

Die Canvas erhält den verbleibenden Raum.

Der Visualize Workspace ist **eine** gemeinsame Glass-Fläche
(`visualize-workspace glass glass-thin` mit `--radius-lg`). Build und
Canvas haben darin keine eigene Fläche, keinen Schatten
und keinen großen Radius; sie sind nur durch Haarlinien
(`--color-border-subtle`) getrennt. TopBar und Navigation Rail bleiben
eigene Glass-Flächen.

### Panel

Beide Bereiche nutzen `Panel`.

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
- Ohne Titel, `actions` und Collapse-Button rendert `Panel` keinen
  Header (Canvas, siehe unten). Objektbezogene Aktionen wie Duplicate
  und Delete gehören nicht in eine Toolbar, sondern an das Objekt (siehe
  Chart-Aktionsleiste). Ausnahme ist das Formatieren: Es ist ein
  Editor-Modus und startet über den Pinsel in der Canvas-Toolbar.
- Der Header hat eine feste Mindesthöhe, damit alle Panels auf
  derselben Höhe beginnen, auch ohne Actions.
- Inhaltshöhe: `isScrollable` lässt das Panel seinen Inhalt selbst
  scrollen (Build Panel). `isFilled` lässt den Inhalt die
  Höhe füllen, das Kind scrollt selbst (Canvas mit `ChartGrid`, Data mit
  `DataTable`).

Das Build Panel ist einklappbar:

- `isCollapsed` und `onToggleCollapse` aktivieren das Verhalten; ohne
  `onToggleCollapse` gibt es keinen Toggle.
- `side` (`start | end`) bestimmt die Richtung des Toggle-Icons.
- Eingeklappt bleibt innerhalb des Workspace ein schmaler Strip (44 px)
  mit dem Panel-Icon als `IconButton` in Größe `sm` und mit Rahmen.
  Er wirkt dadurch nicht wie eine zweite Navigation Rail, deren Icons
  `ghost` sind.
- Der Inhalt wird nur ausgeblendet, nicht entfernt; Zustand wie
  geöffnete Sections bleibt erhalten.
- Cmd/Ctrl + B schaltet das Build Panel um (über die Command-Registry).
- Der Layout-Zustand ist UI-State (`useWorkspaceLayout`), nicht Teil
  des Workspace-Reducers.

Auf schmaleren Viewports können Panels zu Overlays oder Drawern
werden.

### Canvas: Dashboard und Editor

Die Canvas trennt das Dashboard (das Ergebnis) vom Editor (dem
Werkzeug). Entscheidungsfrage für jedes neue Element:

> Würde man es in der Präsentation oder im Export sehen?

| Ja → Dashboard                     | Nein → Editor                                    |
| ---------------------------------- | ------------------------------------------------ |
| Dashboard-Titel, später Untertitel | Undo, Redo, Format, später Zoom, Present, Export |
| Charts, später KPI, Text, Slicer   | Ask Cevyn Bar                                    |
| Canvas-Hintergrund, Gap            | Chart-Aktionsleiste, Format-Popover, Build       |

```text
Canvas Panel (--canvas-background, ohne Panel-Header)
├── .canvas-toolbar     schwebend oben rechts, glass glass-thick
├── .dashboard-surface  Titel + ChartGrid, die „Seite“
└── AskCevynBar         schwebend unten
```

- Die ganze Fläche rechts der Haarlinie zum Build Panel ist
  die Seite; sie hat keinen eigenen Rahmen und keinen Radius.
- `.dashboard-surface` ist der unsichtbare Rahmen um Titel und Grid.
  Ein späterer Präsentationsmodus zeigt genau dieses Element.
- Editor-Elemente schweben mit eigenem Z-Index über der Seite. Die
  Toolbar enthält `CommandButton`s in `sm` und `ghost`; die Pille ist
  die einzige Fläche.
- Rechts vom Pinsel öffnet das Zahnrad (`Settings2`, `IconButton` `sm`
  `ghost`, gedrückt solange offen) das Popover „Dashboard“ mit
  Einstellungen ohne eigenes Element auf der Canvas: Gap und Animation
  (Schalter „Animation“, Duration). Gleiche erhöhte Glass-Ebene wie das
  Format-Popover. Der Name bleibt inline im Titel, eine Einstellung hat
  genau eine Heimat.
- Toolbar und Titelzeile sind beide 36 px hoch und liegen auf einer
  Linie. Der Titel ist auf 480 px begrenzt, damit sein Eingabefeld
  nicht unter die Toolbar läuft.

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

### Table View

```text
 #  │ # revenue      ↓ │ ABC region       │ 📅 date
    │   integer        │   string         │   date
    │   ▂▅█▆▃▂▁▃▅▂     │   █▆▄▂▁▁         │   ▃▅▇█▅▃
────┼──────────────────┼──────────────────┼──────────────
 1  │          12 400  │ EU               │ 2024-01-03
 2  │           9 870  │ US               │ —
```

- echtes `<table>` in einer ruhigen Fläche wie die Profile-Kacheln
  (`--color-surface-subtle`, dünne Linie, `--radius-md`), keine
  zusätzliche Glass Card; die Fläche scrollt horizontal und vertikal;
- Spaltenkopf (`DataTableColumnHeader`): Role-Icon und Name, darunter
  leise der Physical Type, darunter ein `MiniHistogram` mit 20 px Höhe
  über die Spaltenbreite; der Slot bleibt leer, wenn keine passende
  Verteilung vorliegt, damit alle Köpfe gleich hoch sind;
- Icon über `getFieldGroupDefinition` aus der effektiven Role, also
  dieselben Icons wie Build Panel und Profile View;
- Header sticky mit `--color-surface-overlay` und Blur, kräftigere
  Unterkante als die Zeilen; Zeilennummer sticky links mit derselben
  Fläche, die Ecke liegt über beiden;
- nur horizontale Haarlinien, kompakte Zellen, Ellipsis ab 280 px,
  Measures rechtsbündig in tabellarischen Ziffern, fehlende Werte als
  leiser Strich;
- Hover zweistufig: Zeile leicht, Zelle etwas stärker; Electric Blue
  nur für die Zeilennummer bei Hover und den aktiven Sort-Pfeil;
- Sortieren über die Titelzeile im Spaltenkopf: aufsteigend →
  absteigend → unsortiert; aktiver Pfeil dauerhaft sichtbar, inaktiver
  nur bei Hover über dem Kopf (ohne Hover-Gerät immer leise sichtbar);
- Filter-Icon (`IconButton`, ghost, xs) neben dem Sortier-Button, gleiche
  Sichtbarkeitsregel wie der Sort-Pfeil; öffnet ein Glass-`Popover` mit
  einem Control je Semantic Role: Measure `RangeSlider` über die
  Profil-Spanne, Temporal `RangeSlider` über die erkannte Granularität,
  sonst `CheckList` mit Suche und Anzahl je Wert; Filter wirken sofort;
- Toolbar über der Table: Zeilenanzahl, aktive Filter als entfernbare
  `Chip`s (`isActive`) und „Clear all“; mit aktiven Filtern ist die
  Leiste in `--color-accent-soft` mit Accent-Rand getönt, sonst ein
  leiser Hinweis auf das Filtern im Spaltenkopf;
- Rows werden beim Scrollen nachgeladen und virtualisiert; beim Laden
  einer neuen Query bleiben die alten Zellen gedimmt sichtbar, Laden,
  Fehler und „No matching rows“ zeigt `EmptyState` unter dem Header.

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

- Pro Gruppe der Objekt-Registry (`objectGroups`) eine plain Section:
  „Charts“ (`ChartColumn`) und „Cards & Table“ (`LayoutPanelTop`).
- `ObjectPicker`: Icon-Raster aus `getGroupPickerOptions(group)` (Charts
  aus `chartDefinitionList`, Card mit `RectangleHorizontal`); Icon in
  Akzentfarbe, kleines Label.
- Kachel und Drag-Overlay rendern denselben Inhalt
  (`ObjectOptionContent`).
- „More“ (`showMore`) ist ein deaktivierter Platzhalter für weitere
  Charttypen, nur in der Section Charts, und kein Eintrag der Registry.
  Geplant: „More“ als Popover mit Suche (siehe `ROADMAP.md`).

### Dataset

- `DatasetCard`: Name, Zeilenzahl (kompakt formatiert) und
  Field-Anzahl, rechts Upload/Replace als Icon-Button.
- Die ganze Karte nimmt Dateien per Drop an.
- Ohne Upload zeigt sie das Demo-Dataset aus dem Backend („Demo
  data“); eine große Upload-Fläche gibt es nicht.

### Fields

- Gruppen über `groupFields` aus `src/datasets/fieldGroups.ts`:

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

## 6. Format-Widgets

Es gibt kein Einstellungs-Panel. Einstellungen stehen am Objekt im
Format-Popover (siehe „Bearbeitung am Chart“), Daten-Zuordnung im Build
Panel („Chart data“), Dashboard-Einstellungen im Popover der
Canvas-Toolbar.

Ein Widget repräsentiert ein Feature oder eine logisch
zusammengehörige Property-Gruppe, z. B. `GridWidget` oder
`LegendWidget`. Im Popover ist ein Widget meist ein Abschnitt eines
Elements.

Widgets rendern ihre Zeilen über `FormatWidget` (`shared/ui`): nur die
Controls, ohne eigene Fläche, Überschrift oder Collapsible; den Namen
trägt das Segmented Control der Abschnitte bzw. die Section im Build
Panel. Hat das Widget eine Sichtbarkeit, ist sie die erste Zeile
„Visible“ mit `Toggle`. Schaltet sie Verhalten statt Sichtbarkeit
(Zoom, Tooltip, Legend Interaction), heißt die Zeile über
`visibility.label` „Enabled“, im Dashboard-Popover „Animation“. Die
Eigenschaften bleiben auch bei ausgeblendetem Feature editierbar.
Abhängige Unteroptionen (`.format-widget-subproperties`) sind um
`--indent-nested` eingerückt.

`AxisWidget` zeigt mit `part` (`title` | `labels`) die Zeilen eines
Elements: „X Axis“ Sichtbarkeit und Titel, „X Axis Labels“ Format,
Ticks, Rotation und Text. Die Sichtbarkeit gehört zu `title`, weil
`visible` die ganze Achse ausblendet.

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
Aktuell als `RangeSlider` ohne Inputs umgesetzt (Table Filter).

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
| Field Wells / Drop Zones     | X, Y, Color, Size               | Field direkt auf ein Encoding ziehen             | implementiert (`EncodingDropSlots`)                          |
| Chips / Tokens               | Filter, Series, Dimensions      | kompakt, sortierbar, entfernbar                  | teilweise (Field Chips, Filter-Chips der Table)              |
| Searchable Combobox          | Field Picker                    | tippen statt lange Listen durchsuchen            | geplant                                                      |
| Visual Select                | Symbol, Line Style, Font Weight | echte Vorschau statt Text                        | teilweise (`FontWeightControl`, `AlignmentControl`)          |
| Inline Text Editing          | Titel, Achsen, Dashboard-Name   | Text direkt am Objekt bearbeiten                 | teilweise (`EditableText`, `InlineTextInput`)                |
| Context Toolbar              | selektierter Chart              | wichtigste Aktionen direkt am Objekt             | geplant                                                      |
| Command Palette              | ⌘K → „Add reference line“       | schnelle Bedienung ohne UI-Suche                 | geplant                                                      |
| Inline Popover               | Farbe, Tooltip, Axis            | Details dort bearbeiten, wo sie gebraucht werden | teilweise (`ColorControl`, Format-Popover am Chart)          |
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
z. B. Surface, Glass, Blue und Violet beim Chart-Background. Solche
Presets verwenden im Active State den Electric-Blue-Ring und eine feine
Kante, damit dunkle oder transparente Flächen sichtbar bleiben.

## 9a. AlignmentControl

`AlignmentControl` ist ein `SegmentedControl` für
`HorizontalAlignment` (`start | center | end`, aus
`shared/textStyle.ts`) mit Ausrichtungs-Icons. Es wird für Titel- und
Legend-Ausrichtung verwendet. Ausrichtungen im
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

Inline-Editing und Format-Popover ändern denselben Wert über dieselbe
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
`isEnabled`. Toggle-Commands (z. B. Format) setzen `isActive`; der
Button erscheint dann gedrückt (`is-active`) und trägt `aria-pressed`.
`size` (`sm | md`) und `variant` (`default | ghost`)
werden an `IconButton` durchgereicht; das Icon ist 16 bzw. 18 px groß.
Der Hover-Titel nennt das erste Tastenkürzel des Commands, z. B.
„Undo (⌘Z)“ auf dem Mac bzw. „Undo (Ctrl+Z)“ sonst
(`formatShortcut`); Commands ohne Kürzel zeigen nur das Label.

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

`Button` (mit Text) bietet `size` (`sm`: Höhe `--control-height-sm` wie
die übrigen Controls einer `ControlRow`; ohne `size` bestimmt der
Kontext die Höhe) und `variant` (`secondary`, Standard, Fläche wie
Felder; `accent`, tonal: Akzent-Text auf `--color-accent-soft` mit
Akzent-Rand, Hover mit `--shadow-accent`). `accent` hebt eine
weiterführende Aktion hervor, z. B. „Edit ›“ von den Marks zum Tooltip.
Ein solider Primary-Button ist bewusst nicht vorhanden: Er bleibt
abschließenden Aktionen vorbehalten (Speichern, Bestätigen), die es im
Editor bisher nicht gibt, weil Änderungen sofort wirken.

## 9d. StatWidget

`StatWidget` ist eine ruhige Kennzahl-Kachel auf `Widget`-Basis (keine
Glass-Fläche, nicht interaktiv): Icon und Label als `IconBadge`, große
Zahl (`--font-size-lg`, tabular nums), optional ein Anteilsbalken
(`share` von 0 bis 1) und ein leiser Hinweis (`hint`, einzeilig mit
Ellipsis und Tooltip).

- `value` ist bereits formatiert; formatiert wird über
  `src/shared/format/formatNumber.ts`.
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
  und `--mini-histogram-height` (Field-Kachel: füllt die Resthöhe,
  Spaltenkopf der Table: 20 px).
- Die Komponente kennt keine Fields; die Umrechnung aus dem Profil
  liegt in `createDistributionBars`.

## 9f. CheckList

`CheckList` ist eine kontrollierte Mehrfachauswahl: `options` (`label`,
`value`, optional vorformatiertes `detail` wie eine Anzahl), `values`
und `onValuesChange`.

- Zeilen sind `Button`s mit `role="checkbox"` und `aria-checked`;
  Electric Blue nur im Kästchen, die Zeile bleibt ruhig.
- Die Liste scrollt ab 240 px selbst.
- Die Komponente kennt keine Fields oder Filter; Einsatz im Table
  Filter, später für Slicer.

## 9g. RangeSlider

`RangeSlider` wählt ein Intervall `[start, end]` zwischen `min` und
`max` mit zwei nativen Range-Inputs auf einer Spur; die Griffe können
sich nicht überholen.

- Optik wie `Slider`: Thumb in `--color-control-handle` mit
  Accent-Rand, nur der gewählte Bereich in Electric Blue.
- Beschriftung von Start und Ende darunter über `formatValue`.
- Generisch über Zahlen: Aufrufer übergeben Positionen (z. B. Indizes
  von Datums- oder Werteschritten) und formatieren selbst.

## 9h. Popover

`Popover` ist die eine schwebende Fläche für Dropdowns, Farbwähler und
Einstellungen am Chart (Floating UI, Portal, Schließen per Escape oder
Klick daneben):

- `renderTrigger` rendert einen eigenen Auslöser; alternativ
  positioniert `anchor` das Popover an einem Element oder einem
  virtuellen Rechteck, ohne eigenen Button (z. B. neben einem Chart).
- Ein optionaler `title` erzeugt einen Header mit Titel und einem
  Schließen-Button (`IconButton`, `ghost`, `xs`, benannt nach `label`).
  `title` ist ein Slot (`ReactNode`), z. B. Icon plus `SelectControl`
  im Format-Popover. Ohne `title` bleibt das Popover kopflos
  (Dropdowns, Farbwähler).
- `SelectControl` hat eine `variant`: `field` (Default, Feld mit
  Rahmen, Menü so breit wie das Feld) und `title` (liest sich als
  Überschrift: ohne Rahmen und Fläche, Titel-Schrift, Hover in
  Akzentfarbe, Menü so breit wie nötig).
- Verschachtelte Popovers bilden einen `FloatingTree`: Ein Klick in
  ein Kind-Popover (z. B. Farbwähler im Format-Popover) schließt das
  Eltern-Popover nicht.
- `keepOpenOn` (CSS-Selektor) nimmt Bereiche außerhalb vom Schließen
  per Klick aus, z. B. einen Toggle-Button, der das Popover selbst
  schließt. Floating UI schließt sonst schon bei `pointerdown`, und der
  folgende Klick würde es wieder öffnen.
- Das Format-Popover scrollt nicht als Ganzes: Header und Glass-Kante
  (`.glass::before`) bleiben stehen, nur der Inhalt scrollt in
  `.chart-format-popover-body`. Padding und gleich großer negativer
  Margin verhindern, dass Fokusringe am Rand abgeschnitten werden.
- Positionierung: `flip` wechselt die Seite, `shift` hält das Popover
  im Viewport, bei Platzmangel auch quer zur Platzierung. Ein Popover
  neben einem sehr breiten Chart liegt dann notfalls über ihm, statt
  abgeschnitten zu werden.

## 9i. EmptyState

`EmptyState` ist das eine Muster für leere, ladende und fehlerhafte
Bereiche (Canvas, Chart, Data View, Table). Unterschiede laufen über
Props, nicht über Sonderkomponenten:

| Prop          | Werte                             | Wirkung                                                               |
| ------------- | --------------------------------- | --------------------------------------------------------------------- |
| `icon`        | ReactNode                         | Icon über dem Titel; Größe steuert das CSS                            |
| `iconVariant` | `badge` (Default), `illustration` | kleiner Kreis für Status oder großes, blasses Icon                    |
| `tone`        | `neutral` (Default), `danger`     | `danger`: Titel und Icon rot, Badge mit Danger-Fläche, `role="alert"` |
| `size`        | `md` (Default), `sm`              | `sm` für Chart-Karten: weniger Padding, kleinere Schrift              |

- `illustration` steht für „hier fehlt noch etwas“: leere Canvas
  (`LayoutDashboard`), leeres Chart (Icon des Charttyps aus
  `chartDefinitions`, damit leere Charts unterscheidbar bleiben).
- `badge` steht für Status: Laden (`LoaderCircle` mit Utility
  `.spin`), keine Treffer (`SearchX`), Fehler (`TriangleAlert`).
- Status-Helper wie `getTableStatus` geben direkt `EmptyStateProps`
  zurück.
- Im Chart liegt der Zustand über dem Canvas (`.chart-state`); das
  ECharts-Canvas ist dann per `visibility` ausgeblendet, damit leere
  Achsen oder der Pie-Ring den Hinweis nicht überdecken.

## 9j. TextStyleControls

`TextStyleControls` ist der eine Baustein für das Aussehen eines
Textes (`TextStyle`). Er gibt Zeilen zurück, keinen Rahmen; das Widget
setzt seine eigenen Zeilen (Ausrichtung, Rotation, Position, Format)
davor oder dahinter:

- Color (`ColorControl`), Size (`ScrubbableNumber`), Weight
  (`FontWeightControl`), Style (`SegmentedControl` Normal/Italic mit
  „A“-Vorschau)
- `label` benennt die Controls für Screenreader, z. B. „Legend text“
  → „Legend text color“
- `rowLabelPrefix` trennt zwei Texte in einem Widget, z. B. „Title
  color“ und „Label color“ an der Achse; ohne Präfix heißen die Zeilen
  „Color“, „Size“, „Weight“, „Style“
- `minFontSize`/`maxFontSize` begrenzen die Größe (Standard 9–28), z. B.
  11–20 für Titel im festen Header, 16–96 für den Card-Wert

Keine Varianten über Flags: Was ein Element zusätzlich braucht, ist eine
eigene Zeile im Widget.

## 9k. StrokeStyleControls

`StrokeStyleControls` ist der Baustein für das Aussehen einer Linie oder
eines Umrisses (`StrokeStyle`), nach demselben Muster wie
`TextStyleControls`: Zeilen statt Rahmen, `label` für Screenreader,
`rowLabelPrefix` für die sichtbaren Zeilennamen (`getRowLabel`, von
beiden geteilt).

- Width (`ScrubbableNumber`, 0 bis `maxWidth`, Standard 8; 0 heißt kein
  Strich), Style (`SegmentedControl` Solid/Dashed/Dotted mit
  `.line-style-preview`), Color (`ColorControl`), Opacity (`Slider`)
- genutzt vom Rahmen im `ContainerWidget` („Border width“ …); Gridlines,
  Linien-Marks und später Tables sollen ihn übernehmen

## 9l. Style-Bausteine und Abdeckung

`TextStyle` ist das Muster für wiederkehrende Formatierung: ein Werttyp
ohne Domänenwissen in `shared/`, eine Controls-Komponente mit immer
denselben Zeilen und je eine Übersetzung pro Renderer (CSS, ECharts).
In der Spec steht der Baustein als benanntes Unterobjekt (z. B.
`title.textStyle`), damit ein Abschnitt im Popover genau einem Typ
entspricht.

Vorhandene Bausteine:

- `TextStyle` mit `TextStyleControls` (siehe 9j)
- `StrokeStyle` mit `StrokeStyleControls` (siehe 9k): erster Nutzer ist
  der Container-Rahmen (`ObjectContainer.border`); Gridlines
  (`GridAppearance`) und Linien-Marks (`LineAppearance`) haben noch
  eigene Felder und sollen ihn übernehmen

Ein neuer Baustein lohnt sich erst, wenn mindestens zwei Elemente ihn
tatsächlich nutzen oder der zweite Nutzer konkret geplant ist. Mögliche
weitere Bausteine (Idee, nicht beschlossen):

- `NumberFormat`: Format, Währung, Nachkommastellen; heute getrennt in
  `AxisAppearance`, `CardValueAppearance` und `tooltip.valueFormat`
- `Fill`: Farbe und Deckkraft; heute im Container-Hintergrund, in der
  Fläche unter Linien und in der Scatter-Deckkraft

Die Matrix zeigt, welche Formatierung jedes Element heute hat. Sie dient
als Planungsgrundlage: Eine Spalte mit vielen Lücken spricht für einen
gemeinsamen Baustein.

✓ vorhanden · ○ fehlt · – nicht sinnvoll

| Element              | Text | Fill          | Stroke        | Zahlenformat            | Platzierung   |
| -------------------- | ---- | ------------- | ------------- | ----------------------- | ------------- |
| Titel (Chart, Card)  | ✓    | –             | –             | –                       | ✓ Ausrichtung |
| Achsentitel          | ✓    | –             | –             | –                       | –             |
| Achsenbeschriftung   | ✓    | –             | –             | ✓ ohne Nachkommastellen | ✓ Rotation    |
| Achsenlinie          | –    | –             | ○             | –                       | –             |
| Gridlines            | –    | –             | ✓ ohne Breite | –                       | –             |
| Legende              | ✓    | ○             | –             | –                       | ✓ Position    |
| Datenlabels          | ✓    | –             | –             | ○                       | ✓ Position    |
| Marks Bar            | –    | ✓ Farbe       | ○ Rahmen      | –                       | –             |
| Marks Line           | –    | ✓ Fläche      | ✓             | –                       | –             |
| Marks Scatter        | –    | ✓ Deckkraft   | ○ Rand        | –                       | –             |
| Container            | –    | ✓ Hintergrund | ✓ Rahmen      | –                       | ✓ Padding     |
| Card-Wert            | ✓    | –             | –             | ✓ ohne Nachkommastellen | ○ Ausrichtung |
| Card-Selection-Label | ✓    | –             | –             | –                       | –             |
| Tooltip              | ○    | ○             | –             | ✓ ohne Währung          | –             |

Die Matrix beschreibt den implementierten Stand und wird mit jedem
neuen Baustein oder Element aktualisiert.

## 10. Legend

Legend erklärt diskrete Series oder Kategorien.

Beispiel:

```text
Series = Country

Germany
France
Italy
```

Legend und ihr interaktives Verhalten gehören zum Element „Legend“ im
Format-Popover:

```text
Legend
├── Legend       (Position, Ausrichtung, Text, Abstand)
└── Interaction  (Enabled, Selection Mode)
```

Die Legend scrollt statt überzulaufen: `layout` `auto` und `scroll`
ergeben eine ECharts-Scroll-Legend mit Blätter-Pfeilen in Text- und
Inactive-Farbe, `plain` eine einfache Legend. Pie und Donut rücken zur
Gegenseite einer sichtbaren Legend (`getPieCenter`); ihre Legend steht
per Default rechts, Prozent-Labels innerhalb der Segmente.

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

Das Element „Color Scale“ im Format-Popover unterstützt:

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

Der Container eines Objekts wird im Element „Chart“ bzw. „Card“ des
Format-Popovers formatiert:

- Background über `ColorControl` mit den Presets Surface (Default),
  Glass, Blue und Violet sowie eigener Farbe;
- Padding über `ScrubbableNumber`;
- Radius über `Slider`;
- Rahmen über `StrokeStyleControls` (Breite 0 heißt kein Rahmen).

Alle Backgrounds bauen auf `.glass` auf (Lichtkante, Schatten) und
ändern nur die Füllung über `--glass-fill`: Surface ist die
Standardfüllung, Blue und Violet nutzen `--chart-fill-blue` bzw.
`--chart-fill-violet` (pro Theme), eigene Farben `--chart-background`.
Glass nutzt `glass-liquid`. Die Zuordnung Background → Klassen steht
als `Record` in `ObjectFrame` und gilt damit für jedes Dashboard-Objekt.

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

### Bearbeitung am Chart

Am ausgewählten Chart lassen sich Elemente direkt formatieren (aktuell
Chart als Ganzes, Titel, Marks mit Datenlabels, Tooltip, X- und Y-Achse,
Labels der X- und Y-Achse, Legende, Color Scale):

- Einstieg ist der Pinsel (`Paintbrush`) in der Canvas-Toolbar. Er
  öffnet das Popover mit dem Chart als Ganzem („Chart“, bei Cards
  „Card“), ist gedrückt,
  solange es offen ist, und schließt es beim nächsten Klick. Ohne
  ausgewählten Chart ist er deaktiviert.
- Das Popover steht neben dem Chart (`right-start`, weicht nach links
  aus), nie auf ihm, damit Änderungen live sichtbar bleiben; dazu
  `--glass-fill-elevated`, `--shadow-lg` plus `--shadow-accent` und
  einen Rahmen in `--color-border-accent`.
- Der Kopf ist die Navigation: Pinsel in `--color-accent`, daneben das
  aktuelle Element als `SelectControl` mit `variant="title"`, rechts das
  X. Darunter stehen die Abschnitte des Elements.
- Abschnitte: Ein Element mit mehreren Einstellungsgruppen (z. B.
  X Axis: Axis | Gridlines | Zoom, Legend: Legend | Interaction, Marks:
  Marks | Labels) zeigt
  sie als `SegmentedControl` mit Icons; der Name steht im Tooltip und
  im `aria-label`. Sichtbar ist nur der aktive Abschnitt, keine
  Collapsibles im Popover. Ein Element mit einem Abschnitt zeigt kein
  Segmented Control. Jeder Abschnitt rendert sein Widget `bare`.
  Verhalten ohne Element im Chart (z. B. Legend Selection Mode, Zoom)
  ist ein eigener Abschnitt des Elements, das es betrifft.
- Der aktive Abschnitt wird über seinen Namen gemerkt: Wechselt man das
  Element und es hat einen Abschnitt gleichen Namens (Gridlines von
  X Axis zu Y Axis), bleibt dieser aktiv, sonst der erste.
- Format-Modus (Popover offen): Hover über Chart-Titel, Achsentitel,
  Achsen-Labels, Legende oder eine Mark zeigt eine Region (bei Labels
  und Legende um alle Einträge, bei Marks um die einzelne Mark, bei
  Linien um den ganzen Pfad), einen Rahmen in `--color-border-accent` ohne Fläche, ringsum `--chart-region-frame`
  größer als das Element. Die Region liegt über dem Canvas; ein Klick
  wählt das Element im Popover, statt Text zu bearbeiten,
  Legendeneinträge umzuschalten oder Daten zu selektieren; der Klick auf
  eine Mark formatiert alle Marks des Charts. Sie verschwindet, sobald der Pointer
  sie verlässt. Ohne offenes Popover gibt es keine Regionen.
- Im Format-Modus folgt dem Pointer ein Label, das sagt, was ein Klick
  formatiert („🖌 Format legend“, über freier Fläche „Format chart“
  bzw. „Format card“). Es ersetzt dort den Daten-Tooltip: Was beim
  Cursor steht, sagt, was hier passiert. Look von `.chip` mit
  `--color-surface-overlay`, Akzent-Rand, `--shadow-sm` und Blur;
  Abstand 12 px rechts unten, an rechtem und unterem Rand auf der
  anderen Seite; nur Ein- und Ausblenden animiert. Der Text stammt aus
  `formatRegionLabels`, dieselben Texte wie im `aria-label` der Region.
- Im Format-Modus bietet der Chart keine Daten-Interaktion an: kein
  Daten-Tooltip, kein Brush (eine bestehende Auswahl bleibt sichtbar).
- Ausnahme Tooltip: Er hat kein klickbares Element, sondern einen
  Eintrag im Element-Dropdown nach „Marks“; die Marks verweisen mit
  einer Zeile „Tooltip“ und dem Button „Edit ›“ (`accent`) dorthin.
  Solange „Tooltip“ formatiert wird, steht der echte Tooltip als
  Vorschau am größten Wert, folgt nicht dem Pointer und zeigt jede
  Änderung sofort; der übrige Chart ist abgeblendet. Kein eigenes
  Vorschaufenster, keine Beispieldaten.
- Das Objekt als Ganzes hat keine Region, sondern eine Fläche über dem
  ganzen Frame: Akzent-Schein nach innen plus leichte Akzent-Tönung
  (`color-mix` mit `--color-accent`). Beim Hover über eine freie Stelle
  erscheint sie halb stark (Vorschau), solange „Chart“/„Card“ bearbeitet
  wird voll; ein Klick auf eine freie Stelle wählt das Objekt. Freie
  Fläche zeigt im Format-Modus `cursor: pointer`, auch über dem
  ECharts-Canvas. Beim Objekt als Ganzem wird nichts abgeblendet.
- Blauer Rahmen heißt „auswählen“, graue Fläche
  (`--color-surface-hover`) heißt „Text bearbeiten“: Außerhalb des
  Format-Modus bleibt ein Klick auf Chart- oder Achsentitel
  Inline-Editing.
- Ein Druck in der Canvas-Toolbar (Undo, Redo, Pinsel) oder auf den
  formatierten Chart schließt das Popover nicht; ein Klick auf die
  Canvas oder einen anderen Chart, X und Escape schon.
- Fokus statt Farbe: Während das Popover offen ist, treten Serien,
  Labels, Legende, Chart-Titel und nicht bearbeitete Achsen auf 25 %
  Deckkraft zurück. Das bearbeitete Element leuchtet im Akzent-Ton
  (Achse: Linie und Titel; Achsen-Labels: Labels; Legende: Text,
  Icons in voller Farbe; Chart-Titel per `text-shadow`); die Textfarben bleiben
  erhalten, weil das Popover sie bearbeitet. Marks behalten ihre
  Deckkraft ohne Schein, weil das Popover ihre Farben bearbeitet; Data
  Labels treten dabei zurück.

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
Pfeiltasten und Escape aus `ObjectFrame`. Nach dem Löschen erhält der nächste Chart in
Lesereihenfolge den Fokus; gibt es keinen Chart mehr, die leere Canvas.

Global, außer in Textfeldern:

| Taste                                  | Aktion                 |
| -------------------------------------- | ---------------------- |
| Cmd/Ctrl + Z                           | Rückgängig             |
| Cmd/Ctrl + Shift + Z oder Cmd/Ctrl + Y | Wiederholen            |
| Cmd/Ctrl + B                           | Build Panel umschalten |

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

Optionen aus dem `ObjectPicker` werden auf das `ChartGrid` gezogen,
auch wenn die Canvas leer ist; der `EmptyState` liegt dann nur als
Hinweis darüber und ist kein Drop Target. Während des Drags zeigt ein
gestrichelter Platzhalter (`chart-drop-preview`) Größe und Position des
neuen Objekts. Er nutzt dieselbe Berechnung wie das Einfügen
(`findFreeLayout` mit der `defaultSize` des Objekttyps aus
`objectDefinitions`).

Felder werden auf Drop-Slots gezogen. `DropSlot` (`workspace/`) ist der
gemeinsame Slot (Label, Hinweis, Text, `useDroppable`); Charts zeigen
ihn über `EncodingDropSlots` einmal pro Encoding, Cards einmal als
„Value“ (einspaltig, `.encoding-drop-slots.is-single`). Während des ganzen
Feld-Drags liegt über jedem Chart ein Overlay mit einem Slot pro
Encoding aus `definition.encodings`, auch im Empty State und bei Charts
ohne Achsen. Der Chart dahinter tritt per Opacity zurück, ohne Blur.
Die Slots stehen zentriert in einem 2er-Grid und zeigen ihren Zustand:

- recommended: Akzentrand, Akzenttönung, Akzent-Label und der Hinweis
  „Recommended“ neben dem Label;
- supported: neutraler Rand;
- invalid: ausgegraut mit ⊘ und „Not compatible“, nimmt keinen Drop an;
- leer: „Drop here“;
- belegt: „Replaces <Feld>“;
- is-over: volle Akzentfläche mit Glow und invertierter Schrift.

Die Einstufung kommt aus `getSemanticCompatibility` mit der Semantic
Role des gezogenen Felds. Die Wertzeile beschreibt, was der Drop
bewirkt, nicht nur den Inhalt des Slots. So bezieht sich
„Recommended“ erkennbar auf das gezogene Feld und nicht auf das Feld,
das gerade im Slot liegt.
