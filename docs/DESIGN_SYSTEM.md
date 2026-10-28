# Cevyn – Design System

## 1. Design Direction

Cevyn verwendet eine moderne, minimalistische und hochwertige
Produktoberfläche.

Visuelle Richtung:

- Apple-inspired Liquid Glass
- Glassmorphism mit Zurückhaltung
- dunkle Graphite- und Near-Black-Flächen
- neutrale Weiß-/Grau-Verläufe
- Electric Blue nur für Zustände (siehe 2)
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

Die App ist neutral („grau bis aktiv“): Hover und aktive Controls sind
grau, Farbe gehört dem Dashboard. Glass, Lichtkanten und Schatten
gehören den Editor-Flächen; Canvas und Container des Dashboards sind
flache Flächen mit `Fill` (`ARCHITECTURE.md`, „Farbebenen“).

### Liquid Glass Surfaces

Glasflächen werden zentral über die Klasse `.glass`
(`src/styles/glass.css`) und die `--glass-*`-Tokens umgesetzt, nicht
pro Komponente.

| Stufe   | Klassen              | Verwendung                                                                    | Blur        |
| ------- | -------------------- | ----------------------------------------------------------------------------- | ----------- |
| thin    | `glass glass-thin`   | Panels                                                                        | `--blur-md` |
| regular | `glass`              | Collapsible Sections (Variante `widget`)                                      | keiner      |
| liquid  | `glass glass-liquid` | derzeit ohne Nutzer                                                           | `--blur-md` |
| thick   | `glass glass-thick`  | Dropdowns, Popover, schwebendes Editor-Chrome (Canvas-Toolbar, Ask Cevyn Bar) | `--blur-lg` |

`glass-liquid` ist die durchscheinende Stufe: Füllung ab transparent
mit einem Hauch Weiß unten (`--glass-fill-liquid`), Blur mit
Sättigung, hellere Lichtkante (`--glass-border-liquid`) und zwei feine
Kantenlinien (`--glass-highlight-liquid`), ohne weißen Glanzfleck oder
inneres Leuchten. Sie wirkt nur auf einem Hintergrund mit Farbverlauf;
seit 3.5 nutzt sie kein Element, weil Container des Dashboards keine
Glass-Flächen mehr sind.

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
- `--background-ambient`: weiches, neutrales Licht hinter der App (ohne
  Blau und Violett), damit das Glas sichtbar Licht bricht.

Die Canvas hat keine Glass-Fläche: Ihre Füllung ist `canvas.background`
(siehe 4, „Canvas“).

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

- Selection (Auswahlring am Objekt, Auswahl in der Tabelle)
- Focus
- Drag- und Drop-Ziele
- Handles
- Format-Fokus
- Sliders und Range-Auswahl
- Primäraktion und tonale Akzent-Buttons (`button-accent`)

Hover und aktive Zustände von Controls sind grau, nicht blau: Hover mit
`--color-surface-hover` und feiner neutraler Kante
(`--color-border-default`), aktive Icon-Toggles, Segmente, Menüeinträge
und die Rail mit `--color-surface-active` und `--color-text-primary`,
ohne Rand und Glow. Der aktive Zustand bleibt auch beim Hovern
sichtbar.

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
auf jedem Chart lesbar bleiben. Die Standardfarben der Daten sind
deshalb die Theme-Tokens `chart1`–`chart5` (`--chart-1` bis `--chart-5`
in `styles/themes.css`): Teal, Orange, Violett, Amber, Magenta. Sie
bilden die Palette „Default“ (`DEFAULT_CATEGORICAL_PALETTE`,
`charts/colorPalettes.ts`); `chart1` ist die Standard-Markfarbe
(`appearance.color`). Die Palette ist für Farbsehschwächen auf der
dunklen Fläche geprüft. Im Light Theme ist Amber auf `#B57800`
abgedunkelt (3,4:1 statt 2,8:1 auf dem Hintergrund); Teal und Violett
liegen dort bei etwa 3:1. Blau bleibt als eigene Farbe wählbar, ist aber
kein Feld der Daten-Reihe.

Der Akzent im Inhalt des Dashboards (Token `accent`, z. B. Card-Wert
und Brush) ist davon getrennt: `--dashboard-accent`, standardmäßig
neutral hellgrau. Format-Fokus und Auswahlring bleiben beim App-Akzent.

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
- Hover und aktiver View grau wie alle Ghost-Toggles (aktiv mit
  `--color-surface-active`), dazu `aria-current="page"`.

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
Canvas Panel (Fill als ::before, ohne Panel-Header)
├── .canvas-toolbar     schwebend oben rechts, glass glass-thick
├── .dashboard-surface  Titel + ChartGrid, die „Seite“
└── AskCevynBar         schwebend unten
```

- Die ganze Fläche rechts der Haarlinie zum Build Panel ist
  die Seite; sie hat keinen eigenen Rahmen und keinen Radius.
- Ihre Füllung (`canvas.background`) liegt auf `.canvas-panel::before`.
  Der Workspace schneidet sie auf seine runden Ecken zu
  (`overflow: hidden`), seine Lichtkante liegt darüber. Das Grid hat
  keinen Radius, damit jedes Objekt seine Ecken selbst bestimmt.
- `.dashboard-surface` ist der unsichtbare Rahmen um Titel und Grid.
  Ein späterer Präsentationsmodus zeigt genau dieses Element.
- Editor-Elemente schweben mit eigenem Z-Index über der Seite. Die
  Toolbar enthält `CommandButton`s in `sm` und `ghost`; die Pille ist
  die einzige Fläche.
- Rechts vom Pinsel öffnet das Zahnrad (`Settings2`, `IconButton` `sm`
  `ghost`, gedrückt solange offen) das Popover „Dashboard“ mit
  Einstellungen ohne eigenes Element auf der Canvas: Gap, Background
  (Fill der Canvas) und Animation (＋/−, Easing und Duration). Gleiche erhöhte Glass-Ebene wie das
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

## 6. Format-Popover

Es gibt kein Einstellungs-Panel. Einstellungen stehen am Objekt im
Format-Popover (Bedienung siehe „Bearbeitung am Chart“), Daten-Zuordnung
im Build Panel („Chart data“), Dashboard-Einstellungen im Popover der
Canvas-Toolbar.

### Aufbau: Element, Gruppen, Zeilen (implementiert)

```text
┌─ 🖌  X Axis ▾                     👁  × ┐   Kopf: Element + Auge
│ TITLE                            👁    │   Gruppe mit Auge
│ [Aa 12 px   ]  [ A  A  A   ]  [I]      │   Zeilen ohne Label
│ ────────────────────────────────────── │
│ LINE                             👁    │
│ ────────────────────────────────────── │
│ GRIDLINES                        ⊘    │   aus: nur die Überschrift
│ ────────────────────────────────────── │
│ ZOOM                                   │
│ [🖱 Scroll    ]  [▭ Slider    ]         │   Verhalten als Toggles
└────────────────────────────────────────┘
```

- **Element:** Der Kopf zeigt das Element als `SelectControl`
  (`variant="title"`). Lässt sich das ganze Element ausblenden (Titel,
  Legende, Farbskala, Tooltip, Achse, Datenlabels, Card Selection),
  steht sein Auge rechts im Kopf (`visibility` an `ObjectFormatPopover`,
  über den Slot `actions` des `Popover`, benannt „Hide legend“). Ist das
  Element aus, bleibt nur der Kopf.
- **Gruppen:** Ein Element zeigt alle seine Gruppen untereinander; es
  gibt keine Collapsibles im Popover. Die Überschrift ist klein, in
  Versalien, mit Haarlinie zur vorigen Gruppe, im Stil der plain
  Sections im Build Panel.
- **Überschrift:** rechts höchstens Auge, ＋ oder Pinsel (Regel 1 unter
  „Kompakte Controls“); ausgeblendet bzw. ohne Eintrag zeigt die Gruppe
  nur ihre Überschrift. Gruppen ohne Aktion sind immer offen.
- **Zeilen:** kompakt und ohne Text-Label; den Kontext geben die
  Gruppe, Icons im Feld und Tooltips. Seltenes steht hinter ⚙.
- Das Popover ist oben verankert, höchstens 400 px hoch, der Inhalt
  scrollt.

### Feste Reihenfolge (implementiert)

Jedes Element ordnet seine Gruppen gleich:

```text
Inhalt → Layout → Shape → Text → Fill → Stroke → Effect
→ Zahlen- und Datumsformat → Unterelemente → Verhalten
```

Ein Element füllt nur die Plätze, die es hat; fehlende Plätze fallen
weg, statt leer oder deaktiviert zu erscheinen. Der Platz ist fest, der
Titel darf zum Element passen (Fill heißt am Container „Background“,
bei Linien „Area“; Stroke heißt bei Linien „Line“, sonst „Border“).

| Element                 | Gruppen                                                  |
| ----------------------- | -------------------------------------------------------- |
| Chart bzw. Card         | Layout (Padding) · Shape (Radius) · Background · Border  |
| Title                   | Content (Text) · Text (mit Alignment)                    |
| X Axis, Y Axis          | Title · Line · Gridlines · Zoom (nur X)                  |
| X Axis Labels, Y Axis … | Layout (Ticks, Rotation) · Text · Format (Number, Date)  |
| Data Labels             | Layout (Position) · Text · Format (nicht bei Pie, Donut) |
| Legend                  | Layout (Position, Alignment, Gap) · Text · Interaction   |
| Color Scale             | Layout (Position, Orientation) · Labels                  |
| Tooltip                 | Behavior (Trigger; nicht bei Pie und Donut)              |
| Card Value              | Function (Aggregation) · Text · Format                   |
| Card Selection          | Text                                                     |
| Dashboard (Toolbar)     | Layout (Gap) · Animation                                 |

Marks haben feste Plätze in `MARK_GROUP_ORDER`
(`charts/format/markGroups.tsx`), der einzigen Stelle mit ihrer
Reihenfolge; `getMarkGroups` füllt sie pro Charttyp:

| Platz      | Scatter                                  | Line                   | Bar           | Pie / Donut          |
| ---------- | ---------------------------------------- | ---------------------- | ------------- | -------------------- |
| Data color | Fill mit Datenfarbe                      | Line mit Datenfarbe    | wie Scatter   | Fill mit Palette     |
| Shape      | Symbol, Size bzw. Size range (Size-Feld) | Straight \| Smooth     | Width, Radius | Inner radius (Donut) |
| Fill       | –                                        | Area (Deckkraft, Auge) | –             | –                    |
| Stroke     | Border                                   | –                      | Border        | Border               |
| Effect     | Effect (＋/−)                            | Effect (＋/−)          | Effect (＋/−) | Effect (＋/−)        |
| Points     | –                                        | Auto \| Always, Auge   | –             | –                    |
| Labels     | Pinsel und Auge                          | wie Scatter            | wie Scatter   | wie Scatter          |
| Tooltip    | Pinsel in der Überschrift                | wie Scatter            | wie Scatter   | wie Scatter          |

- Data color ist die Gruppe, die mit der Datenfarbe gezeichnet wird;
  siehe „Datenfarbe in der Farbzeile“ unter „Kompakte Controls“.
- Labels und Tooltip sind Gruppen ohne Zeilen; ihr Pinsel öffnet das
  Element Data Labels bzw. Tooltip im selben Popover
  (`getElementLinkGroup`), das Auge der Labels blendet die Datenlabels
  ein oder aus.
- Welchen Inhalt die Datenlabels zeigen, ist noch fest (Wert bzw. Anteil);
  die Wahl kommt mit „Tooltip-Felder“ (`ROADMAP.md`).

### Format-Widgets (implementiert)

Ein Widget repräsentiert ein Feature oder eine logisch
zusammengehörige Property-Gruppe, z. B. `AxisStrokeWidget` oder
`LegendWidget`; es liefert eine oder mehrere Gruppen.

- `FormatWidget` (`shared/ui`) ist die Gruppe: `title` wird zur
  Überschrift, `visibility` zum Auge darin, `onAdd` zum ＋ und
  `onFormat` zum Pinsel; `children` sind die Zeilen und dürfen fehlen
  (Gruppe nur mit Aktion). Ohne `title` bleiben nur die Zeilen, z. B. im
  Build Panel unter „Chart data“. `FormatVisibility` (`visible`,
  `onChange`) ist der gemeinsame Typ für das Auge in Gruppe und Kopf;
  sein Name folgt aus dem Titel („Hide gridlines“).
- Verhalten ohne sichtbaren Teil (Zoom, Legend Interaction, Animation)
  hat kein Auge, sondern ＋/− oder Toggles in der Zeile (Regel 1 unter
  „Kompakte Controls“).
- Die Bausteine (`LayoutControls`, `TextStyleControls`,
  `StrokeStyleControls`, `FillControls`, `EffectControls`,
  `NumberFormatControls`) liefern nur Zeilen; das Widget legt sie in
  seine Gruppen.
- `AxisWidget` zeigt mit `part` (`title` | `labels`) die Gruppen eines
  Elements: „X Axis“ die Gruppe Title, „X Axis Labels“ Layout, Text und
  Format.

Nicht jede einzelne Scalar Property erhält ein eigenes Widget.

### Kompakte Controls im Figma-Stil (implementiert, 3.4)

Ziel: Das Popover sieht aus und bedient sich wie das Design-Panel in
Figma: dicht, ruhig, Icons statt Text-Labels, eine klare Sprache pro
Ebene. Die Spec hat sich dafür nicht geändert, nur die Darstellung der
Controls.

**Regel 1: drei Ebenen, jede mit eigener Sprache**

| Ebene                  | Inhalt                           | Erlaubte Controls                                                                 |
| ---------------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| 1. Gruppen-Überschrift | Text in Versalien (FILL, STROKE) | rechts nur Auge, ＋ oder Pinsel, nie ein Schalter                                 |
| 2. Zeilen              | Werte, kompakt, ohne Text-Label  | Felder mit Icon im Feld, Icon-Gruppen, Toggles mit Icon und Wort, Icon-Toggles, − |
| 3. Details             | seltene Einstellungen            | hinter ⚙ am Zeilenende, als eigenes kleines Popover                               |

- **Auge:** blendet einen sichtbaren Teil ein oder aus (Title,
  Gridlines, Area, Points, Labels, Achsenlinie; im Kopf das ganze
  Element, auch den Tooltip); ausgeblendet zeigt die Gruppe nur ihre
  Überschrift.
- **＋ / −:** eine Sache mit Art und Parametern, die als Ganzes da ist
  oder nicht (Effect, Animation, später Referenzlinien). ＋ in der
  Überschrift setzt einen frischen Standard (`createEffect('glow')`,
  `DASHBOARD_ANIMATION`), − steht am Ende der Zeile; ohne Eintrag zeigt
  die Gruppe nur Überschrift und ＋.
- **Verhalten mit mehreren Wegen:** Toggles mit Icon und Wort in der
  Zeile; alle aus heißt aus (Zoom: Scroll | Slider, `enabled` folgt
  `inside || slider`).
- **Verhalten mit wenigen Modi:** eine Icon-Gruppe mit Wort, die „Off“
  einschließt (Legend Interaction: Off | Multiple | Single, Off
  entspricht `enabled: false`).
- **Pinsel:** öffnet ein anderes Element im selben Popover (`onFormat`
  an `FormatWidget`), z. B. Tooltip oder Data Labels unter den Marks;
  dasselbe Icon wie „Format …“ am Chart. Kein ⚙, weil ⚙ nur seltene
  Einstellungen der eigenen Zeile öffnet, und kein zweites Popover: ein
  Popover zeigt ein Element, das Select im Kopf ist der Weg zurück.
- Einzelne An/Aus-Optionen in einer Zeile (Italic) sind Icon-Toggles
  (`IconButton` mit `isActive`). Einen `Toggle` gibt es nicht mehr.

**Regel 2: Zeilen-Muster der Bausteine**

```text
TEXT
[Aa 14 px      ]  [ A  A  A      ]  [I]
[● Default     ]  [ ≡  ≡  ≡      ]

FILL                          👁
[● 199E8A      ]  [◐ 90 %      ]

STROKE                        👁
[═ 2 px        ]  [ — ┄ ┈      ]
[● 94A3B8      ]  [◐ 100 %     ]

EFFECT                         ＋
[ Glow ▾       ]  [◌ 12        ]   −

FORMAT
[ Currency ▾   ]  [.0 Auto     ]   ⚙

POINTS                        👁
[ ◌ Auto          |  ⊙ Always        ]

ZOOM
[🖱 Scroll     ]  [▭ Slider    ]

INTERACTION
[ ⊘ Off  |  ☑ Multiple  |  ☑ Single ]

ANIMATION                      ＋
[ Ease out ▾   ]  [⏱ 500 ms    ]   −
```

- **Raster der Zeile** (`ControlRow` ohne `label`,
  `.control-row-compact`): zwei gleich breite Spalten für Felder, danach
  schmale Spalten für Icon-Buttons (−, ⚙, Italic). Eine Icon-Gruppe ohne
  Nachbarfeld nutzt beide Spalten (Points, Smooth, Interaction,
  Trigger); ein Icon-Button nach einem einzelnen Feld rückt ans
  Zeilenende (`[⏱ 500 ms]          −`).
- **Farbzeile** (`PaintControl`): links das Farbfeld, rechts die
  Deckkraft in % (Icon ◐, scrubbable), dahinter optional ⚙
  (`details`). Eine eigene Farbe zeigt `ColorField` (siehe 9q). Bei
  Serienfarben (`SeriesFill`, `SeriesStrokeStyle`) steht links das Feld
  der Datenfarbe (`seriesColor`), sofern der Paint sie trägt, sonst nur
  die Deckkraft.
- **Text:** Zeile 1 Größe (Icon Aa, Einheit px) | Gewicht als
  Icon-Gruppe (Light · Medium · Bold; ein Select erst bei mehr
  Schnitten) | Italic (Icon-Toggle); Zeile 2 Farbfeld (`ColorField`,
  `TextStyle` hat keine Deckkraft) | Text-Ausrichtung als Icon-Gruppe,
  wo das Element sie hat (Titel), sonst bleibt die rechte Spalte leer.
  Zur Trennung von Position, Anordnung und Text-Ausrichtung siehe
  `ARCHITECTURE.md`, „Kasten-Modell“.
- **Stroke:** Zeile 1 Breite (Icon ═, Einheit px) | Stil als Icon-Gruppe
  (— ┄ ┈), Zeile 2 Farbzeile. Kein ⚙, solange `StrokeStyle` nichts
  Seltenes hat; Cap, Join oder eigene Strichmuster wären eine
  Formänderung und gelten nicht für CSS-Rahmen.
- **Effect:** Überschrift mit ＋; die Zeile zeigt Art (Glow ▾) | Stärke
  (Icon ◌) | −. Kein Auge, weil `Effect` keinen ausgeblendeten Zustand
  kennt; ein Effekt pro Mark, da ECharts je Mark nur einen Schatten
  zeichnet.
- **Number Format:** Format-Select (Auto, Number, Percent und die
  Währungen) | Decimals mit Auto (`onAuto`) | ⚙ mit Notation und
  Prefix | Suffix; an Achsenlabels zusätzlich Date im Select. DateFormat
  kommt nach demselben Muster.
- **Zahlenpaare** in einer Zeile: Size range (⤓ min | ⤒ max), Bar width
  | Radius, Ticks | Rotation der Achsenlabels.
- **Icon-Gruppen** (`SegmentedControl`) zeigen Icon und Wort
  (`OptionContent`, siehe 9s). Nur Icons, die das Ergebnis zeigen,
  stehen allein (Ausrichtung, Strichstil, Scatter-Symbole, Seiten als
  Pfeile).
- **Position der Legende** als `PositionGrid` (siehe 9r); **Positionen
  der Datenlabels** je Charttyp aus `labelPositions` der Registry mit
  eigenen Icons (`charts/chartIcons.ts`) und Wort (Top | Right |
  Inside).

**Datenfarbe in der Farbzeile (implementiert)**

Die Datenfarbe der Marks (eine Farbe, Palette oder Farbskala) steht in
der Farbzeile des Paints, der mit ihr gezeichnet wird, statt in einer
eigenen Gruppe Color. Diese Gruppe nimmt den ersten Platz in
`MARK_GROUP_ORDER` ein (`dataColor`). Pro Charttyp ist nur festgelegt,
welcher Paint die Datenfarbe trägt:

| Chart                     | Paint         | Reihenfolge                               |
| ------------------------- | ------------- | ----------------------------------------- |
| Bar, Scatter, Pie / Donut | Fill          | Fill → Shape → Border → Effect → …        |
| Line                      | Line (Stroke) | Line → Shape → Area → Effect → Points → … |

Das linke Feld folgt dem Farbmodus (`getColorEncodingMode`):

```text
konstant        [● Chart 1         ]  [◐ 90 %]      ColorField
kategorial      [▬▬ Default       ▾]  [◐ 90 %]      PaletteControl (Dropdown)
kontinuierlich  [● ▬▬▬▬▬▬▬▬▬▬▬▬ ●]  [◐ 90 %]  ⚙   GradientControl, Range
```

- `getDataColorField` (`markGroups.tsx`) baut das Feld einmal; Fill der
  gefüllten Marks bzw. die Line reichen es als `seriesColor` an
  `FillControls` bzw. `StrokeStyleControls` weiter. Die Bausteine
  bleiben generisch.
- Weitere Paints in der Serienfarbe, z. B. die Area der Line, zeigen nur
  ihre Deckkraft; die Datenfarbe hat genau eine Stelle.
- Start- und Endfarbe sowie Range (Min/Max) der Farbskala sind
  Datenfarbe: Range steht als ⚙ an der Farbzeile (Slot `details`). Das
  Element Color Scale regelt nur Lage und Labels der Skala.
- `PaletteControl` ist ein `SelectControl` mit `renderOption`: Button
  und Menü zeigen jede Palette als Farbstreifen mit Namen; Farben ohne
  passende Palette zeigen „Custom“.
- Die Spec ändert sich nicht (`appearance.color`, `colorScale`).

**Regel 3: Details-Popover statt Einrückung**

- ⚙ (`DetailsPopover`, siehe 9h) öffnet ein kleines Popover neben der
  Zeile, verschachtelt über den bestehenden `Popover` (`FloatingTree`);
  höchstens eine Ebene tief, schließt mit Escape und Klick daneben.
- Es hat `.format-widget-subproperties` und die Einrückung ganz
  ersetzt.

**Regel 4: Dichte und Ruhe**

- Zeilen 28 px (`--control-height-sm`), Schrift 12 px, einheitlich; die
  Menüs der Selects ebenso, ohne Abstand zwischen den Einträgen.
- Felder ohne Rahmen, feine Kante erst bei Hover und Fokus: In
  `.control-row-compact` ist `--field-border-color` transparent, und
  Felder, Selects, Segmented, `Button` und `IconButton` folgen dieser
  Variable.
- Glass nur für die Popover-Fläche, innen flach und ruhig.
- Kurze Übergänge (ca. 100–150 ms).
- Zahlenfelder: Pfeile ±1 Schritt, Shift ±10 Schritte, Enter übernimmt,
  Escape verwirft.

**Regel 5: Icons und Barrierefreiheit**

- Icons aus `lucide-react`, in Feldern einheitlich 14 px; eigene Icons
  über `createLucideIcon` im selben Strich (`charts/chartIcons.ts`).
- Ein Icon steht nur allein, wenn es das Ergebnis zeigt (Ausrichtung,
  Label-Positionen, `PositionGrid`, Strichstil, Scatter-Symbole) oder
  eine Konvention ist (B/I, Auge, ＋/−, ⚙, Pinsel). Sonst Icon und Wort
  oder nur das Wort; Verhalten bekommt immer ein Wort (Scroll, Slider,
  Off, Item, Axis).
- Ein Icon hat nie zwei Bedeutungen, und eine Bedeutung hat immer
  dasselbe Icon, z. B. ⤓ ⤒ für Min und Max bei Size range und
  Aggregationen, ⌜ für den Radius von Balken und Container.
- Jedes Icon ohne Text bekommt `title` und `aria-label` (z. B. „Stroke
  width“, „Italic“, „Advanced number format“); ohne Text-Label sind
  Tooltips die einzige Erklärung.
- Icon-Check vor jedem Slice-Ende: Würde ein neuer Nutzer das Icon ohne
  Tooltip erraten? Wenn nicht, bekommt es ein Wort.

**Komponenten** (erweitert statt neu gebaut):

| Bedarf                                  | Umsetzung                                               |
| --------------------------------------- | ------------------------------------------------------- |
| Zahlenfeld mit Icon, Einheit und Auto   | `ScrubbableNumber` mit `icon`, `unit` und `onAuto` (8)  |
| Winkel                                  | `RotationDial`: `ScrubbableNumber` mit Nadel als Icon   |
| Farbzeile                               | `PaintControl` mit `ColorField` (9q)                    |
| Icon-Toggle                             | `IconButton` mit `isActive`                             |
| Toggle mit Icon und Wort                | `Button` mit `isActive` und `aria-pressed` (Zoom)       |
| Icon und Wort einer Option              | `OptionItem.icon`, gezeigt von `OptionContent` (9s)     |
| zwei Felder pro Zeile, Zeile ohne Label | `ControlRow` ohne `label`                               |
| Auge, ＋ und Pinsel in der Überschrift  | `FormatWidget` mit `visibility`, `onAdd` und `onFormat` |
| Details hinter ⚙                        | `DetailsPopover` (9h)                                   |
| 3×3-Raster                              | `PositionGrid` (9r)                                     |

Die Bausteine liefern weiter nur Zeilen; nur deren Inhalt ist kompakt,
dadurch wirkt eine Änderung auf alle Elemente gleichzeitig.

## 7. Control Mapping

### Visual Visibility

Verwenden:

Auge in der Gruppen-Überschrift bzw. im Popover-Kopf
(`FormatVisibility`).

Beispiele:

- Gridlines, Achsenlinie
- Area, Points
- Legend, Data Labels, Chart Title, X/Y Axis, Tooltip

### Boolean Feature

Verwenden:

- eine Sache mit Art und Parametern: ＋ in der Überschrift, − in der
  Zeile (Effect, Animation)
- mehrere unabhängige Wege eines Verhaltens: Toggles mit Icon und Wort
  (`Button` mit `isActive`), alle aus heißt aus (Zoom: Scroll | Slider)
- eine einzelne An/Aus-Option in einer Zeile: Icon-Toggle (`IconButton`
  mit `isActive`, z. B. Italic)

Einen `Toggle` (Schalter) gibt es nicht mehr; er wurde in 3.4 entfernt.

### Wenige exklusive Optionen

Verwenden:

`SegmentedControl`, ohne Nachbarfeld über die volle Breite der Zeile,
jede Option mit Icon und Wort (`OptionItem.icon`); nur Icons, die das
Ergebnis zeigen, stehen allein.

Beispiele:

```text
Off | Multiple | Single
Item | Axis
Auto | Always
Straight | Smooth
Top | Right | Inside
```

### Viele Optionen

Verwenden:

`SelectControl`; Optionen mit `icon` zeigen es im Menü und im Button
(z. B. Σ Sum, x̄ Mean).

### Color

Verwenden:

`ColorControl`

Keine neuen spezialisierten Color Picker erzeugen.

Darstellungsvarianten:

- `inline` zeigt Preset-Farben direkt in der Zeile;
- `compact` zeigt einen einzelnen Farbauslöser und öffnet Presets,
  Picker und HEX-Eingabe in einem Popover.

In kompakten Zeilen zeigt `ColorField` den kompakten `ColorControl` mit
Hex-Wert bzw. Preset-Namen, mit Deckkraft als `PaintControl` (siehe
9q).

`GradientControl` kombiniert zwei kompakte ColorControls mit einer
Vorschau des Verlaufs. Es wird für Low-/High-Farben kontinuierlicher
Farbskalen verwendet und bietet die Daten-Reihe Chart 1–5. Die
eigentliche Farbauswahl bleibt vollständig im zentralen ColorControl.

### Offener numerischer Wert

Verwenden:

`ScrubbableNumber` mit Icon und Einheit im Feld (siehe 8)

Beispiele:

- Font Size, Stroke Width, Bar Width, Radius
- Gap, Padding
- Tick Count und Decimals mit Auto (`onAuto`)

### Begrenzter visueller Wert

Verwenden:

ebenfalls `ScrubbableNumber`, begrenzt über `min` und `max`; Winkel als
`RotationDial`. Im Popover gibt es keine Slider mehr (`Slider` wurde in
3.4 entfernt).

Beispiele:

- Opacity (%), Point Size, Glow Intensity
- Animation Duration (ms)
- Rotation der Achsenlabels (°)

### Numerisches Intervall

Verwenden:

- im Format-Popover ein Zahlenpaar in einer Zeile (Size range: ⤓ min |
  ⤒ max), die Grenzen gegenseitig begrenzt
- `RangeSlider` mit Zahlenfeldern, wenn das Intervall über einer Skala
  gewählt wird, mit `formatValue` beschriftet (Table Filter)

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

| Pattern                      | Beispiel in Cevyn               | Nutzen                                           | Status                                                     |
| ---------------------------- | ------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| Scrubbable Number            | Font Size, Radius, Opacity      | Wert direkt ziehen statt eintippen               | implementiert (`ScrubbableNumber`)                         |
| Modifier Scrubbing           | Shift = grob, Alt = fein        | präzise Einstellung                              | teilweise (Shift ×10 bei den Pfeiltasten)                  |
| Visual Position Picker       | Legend, Label Position          | 3×3-Feld bzw. Icons statt Dropdown               | implementiert (`PositionGrid`, Label-Positionen mit Icons) |
| XY Pad                       | Offset X/Y                      | Punkt in kleiner Fläche verschieben              | geplant                                                    |
| Rotation Dial                | Axis Label Rotation             | Winkel als Nadel sehen und ziehen                | implementiert (`RotationDial`, Feld mit Nadel)             |
| Gradient Editor              | Continuous Color Scale          | Stops direkt auf dem Verlauf bewegen             | teilweise (`GradientControl` mit Start- und Endfarbe)      |
| Field Wells / Drop Zones     | X, Y, Color, Size               | Field direkt auf ein Encoding ziehen             | implementiert (`EncodingDropSlots`)                        |
| Chips / Tokens               | Filter, Series, Dimensions      | kompakt, sortierbar, entfernbar                  | teilweise (Field Chips, Filter-Chips der Table)            |
| Searchable Combobox          | Field Picker                    | tippen statt lange Listen durchsuchen            | geplant                                                    |
| Visual Select                | Symbol, Line Style, Font Weight | echte Vorschau statt Text                        | implementiert (Icon-Gruppen, Paletten mit Farbstreifen)    |
| Inline Text Editing          | Titel, Achsen, Dashboard-Name   | Text direkt am Objekt bearbeiten                 | teilweise (`EditableText`, `InlineTextInput`)              |
| Context Toolbar              | selektierter Chart              | wichtigste Aktionen direkt am Objekt             | geplant                                                    |
| Command Palette              | ⌘K → „Add reference line“       | schnelle Bedienung ohne UI-Suche                 | geplant                                                    |
| Inline Popover               | Farbe, Tooltip, Axis            | Details dort bearbeiten, wo sie gebraucht werden | teilweise (`ColorControl`, Format-Popover am Chart)        |
| Mini Preview Control         | Line Width, Line Style, Area    | Einstellung direkt als Vorschau sehen            | geplant                                                    |
| Direct Manipulation im Chart | Reference Line                  | Element im Chart direkt ziehen                   | geplant                                                    |
| Smart Defaults + Auto        | Axis Min/Max, Tick Count        | Werte nur bei Bedarf setzen                      | teilweise (Achsentitel, `onAuto` für Ticks und Decimals)   |

Regeln:

- Ein Pattern wird als wiederverwendbares Control in `shared/ui`
  gebaut und nicht als One-off in einem Widget.
- Jedes visuelle Control bietet zusätzlich eine präzise Eingabe oder
  Anzeige des Werts.
- Der Status in dieser Tabelle wird erst angepasst, wenn das Pattern im
  Code existiert.

## 8. ScrubbableNumber

`ScrubbableNumber` ist ein wiederverwendbares numerisches Control.

Es ist das eine Zahlenfeld im Format-Popover, für offene und für
begrenzte Werte:

```text
[═ 2 px     ]   Icon im Feld, Wert, Einheit
[⌁ Auto     ]   ohne Wert: Auto
```

- `icon` steht links im Feld und ist der Griff: seitlich ziehen ändert
  den Wert (`pixelsPerStep`, Standard 6 px je Schritt); ohne `icon`
  zeigt das Feld einen Griff.
- `unit` steht hinter dem Wert, z. B. `px`, `%`, `ms` oder `°`.
- `min`, `max` und `step` begrenzen ziehen, tippen und Pfeiltasten
  gleich; Pfeile ±1 Schritt, Shift ±10 Schritte, Enter übernimmt,
  Escape verwirft den Entwurf.
- `onAuto` erlaubt einen automatischen Wert: `value` ist dann `null`,
  das leere Feld zeigt „Auto“, Leeren ruft `onAuto`, Ziehen oder Pfeile
  starten beim Minimum (Tick Count der Achsenlabels, Decimals).
- `RotationDial` ist ein `ScrubbableNumber` mit einer Nadel als Icon,
  die den Winkel zeigt.

## 9. ColorControl

Zentrale wiederverwendbare Komponente:

```tsx
<ColorControl
  value={color}
  onChange={...}
/>
```

Wert und Rückgabe sind ein `ColorValue` (siehe ARCHITECTURE,
Farbwerte): ein Theme-Token oder eine feste Farbe.

Grundstruktur:

- eine Reihe Preset-Swatches, die der Aufrufer über `presets` setzt
  (Pflicht); Theme-Swatches zeigen die aktuelle Theme-Farbe und
  speichern den Token;
- ein Custom Swatch für eine feste Farbe.

Reihen je Einsatzort (`shared/ui/colorPresets.ts`):

| Einsatzort                                                     | Reihe                                   |
| -------------------------------------------------------------- | --------------------------------------- |
| Text (`TextStyleControls`)                                     | Default · Muted · Accent · eigene Farbe |
| Linien und Rahmen (`StrokeStyleControls`)                      | Default · Muted · Accent · eigene Farbe |
| Marks und Flächen (Markfarbe, `FillControls`), Farbskala-Enden | Chart 1–5 · eigene Farbe                |
| Hintergrund von Container und Canvas                           | nur eigene Farbe (keine Felder)         |

- „Default“ steht für die Standardrolle des Elements, z. B. `text` beim
  Titel, `gridLine` bei Gridlines, `border` beim Container-Rahmen,
  `accent` beim Card-Selection-Label. Es zeigt deren Farbe, führt
  jederzeit zum Ausgangszustand zurück und hält technische Namen wie
  „Grid line“ aus der Auswahl. `createStyleColorPresets(defaultColor)`
  baut die Reihe; ein Feld mit demselben Wert wie Default entfällt
  (Selection-Label: Default · Muted).
- Marks haben kein Default-Feld; Chart 1 ist ihr Standard
  (`DATA_COLOR_PRESETS`).
- Das Label eines Presets ist zugleich sein Hover-Titel.

Vor Auswahl einer Custom Color zeigt der Custom Swatch einen
Farbverlauf.

Nach Auswahl zeigt er die zuletzt gewählte Custom Color.

Die Custom Color bleibt erhalten, auch wenn anschließend ein Swatch
ausgewählt wird. Der Farbwähler liefert immer eine feste Farbe.

Active State:

- Electric Blue Ring;
- subtiler Glow;
- nicht nur Farbe als Zustandsindikator.

Ein Token ohne eigenen Swatch markiert weder einen Swatch noch den
Custom Swatch.

Custom Picker kann über `react-colorful` umgesetzt werden.

Die Cevyn-Oberfläche um den Picker bleibt eigenes UI.

Die Deckkraft ist kein Teil von `ColorValue`; sie steht in der
Farbzeile neben dem Farbfeld (`PaintControl`).

Eigene Presets:

Ein Preset trägt einen `ColorValue` oder einen eigenen
Namen, der keine Farbe ist, und zeigt dann über `fill` eine eigene
Vorschau-Fläche; derzeit nutzt keine Stelle das (bis 3.5 der
Container-Hintergrund). Der Typ der Namen ergibt sich aus `presets`
(`ColorPreset<TPreset>`), `onChange` liefert dann `ColorValue | TPreset`.
Solche Presets verwenden im Active State den Electric-Blue-Ring und
eine feine Kante, damit dunkle oder transparente Flächen sichtbar
bleiben. Auch der Auslöser der Variante `compact` zeigt die Fläche des
gewählten Presets (`--swatch-fill`).

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
`variant` (`default | ghost`, Standard `default`). `ghost` hat in Ruhe
und beim Hovern keine Fläche und keinen Rahmen; aktiv zeigt er wie
jedes Control die graue Fläche `--color-surface-active`. Für ruhige
Aktionen in Section-Headern, der Canvas-Toolbar und der Rail.

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

- Thumb in `--color-control-handle` mit Accent-Rand, nur der gewählte
  Bereich in Electric Blue.
- Ohne `formatValue` stehen links und rechts der Spur zwei
  `NumberInput`s für Start und Ende; sie begrenzen sich gegenseitig wie
  die Griffe.
- Mit `formatValue` stehen Start und Ende formatiert unter der Spur:
  Aufrufer übergeben Positionen (z. B. Indizes von Datums- oder
  Werteschritten), für die ein Zahlenfeld falsch wäre.
- `NumberInput` (`shared/ui`) ist das kleine Zahlenfeld des
  `RangeSlider`: Entwurf bis Enter oder Blur, dann auf `min` und `max`
  begrenzt. Genutzt wird es heute nur im Table Filter.

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
  (Dropdowns, Farbwähler). `actions` nimmt Controls vor dem
  Schließen-Button auf, z. B. das Auge des Format-Popovers.
- `SelectControl` hat eine `variant`: `field` (Default, Feld mit
  Rahmen, Menü so breit wie das Feld) und `title` (liest sich als
  Überschrift: ohne Rahmen und Fläche, Titel-Schrift, Hover leicht
  gedimmt, Menü so breit wie nötig). Das Menü (`OptionsMenu`) hat
  28-px-Zeilen ohne Abstand mit 12-px-Schrift; Optionen zeigen Icon und
  Wort (`OptionContent`), die gewählte einen Haken.
- `DetailsPopover` ist die Hülle für das ⚙ am Zeilenende: ein
  `IconButton` (`Settings2`, `sm`, `ghost`, gedrückt solange offen,
  benannt „Advanced …“) öffnet ein kleines Popover mit Titel und den
  seltenen Zeilen, z. B. Notation und Prefix | Suffix des Zahlenformats
  oder Range der Farbskala. Im Format-Popover ist es verschachtelt.
- Verschachtelte Popovers bilden einen `FloatingTree`: Ein Klick in
  ein Kind-Popover (z. B. Farbwähler im Format-Popover) schließt das
  Eltern-Popover nicht.
- `keepOpenOn` (CSS-Selektor) nimmt Bereiche außerhalb vom Schließen
  per Klick aus, z. B. den Format-Pinsel der Canvas-Toolbar, der das
  Popover selbst schließt. Floating UI schließt sonst schon bei `pointerdown`, und der
  folgende Klick würde es wieder öffnen.
- Das Format-Popover scrollt nicht als Ganzes: Header und Glass-Kante
  (`.glass::before`) bleiben stehen, nur der Inhalt scrollt in
  `.format-popover-body`. Padding und gleich großer negativer
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
setzt seine eigenen Zeilen davor oder dahinter:

- Zeile 1: Size (`ScrubbableNumber`, Icon Aa, px) | Weight
  (`FontWeightControl`, Icon-Gruppe) | Italic (Icon-Toggle)
- Zeile 2: Color (`ColorField`) | Ausrichtung (`AlignmentControl`),
  wenn das Element sie über `alignment` anbietet (Titel)
- `label` benennt die Controls für Screenreader, z. B. „Legend text“
  → „Legend text color“
- `minFontSize`/`maxFontSize` begrenzen die Größe (Standard 9–28), z. B.
  11–20 für Titel im festen Header, 16–96 für den Card-Wert
- `defaultColor` (Pflicht) ist die Farbe, die der Text bei neuen
  Objekten bekommt; sie führt die Color-Reihe als „Default“ an (siehe
  9). Das Widget liest sie aus den Default-Konstanten seiner Domain,
  z. B. `TITLE_TEXT_STYLE.color`

Keine Varianten über Flags: Was ein Element zusätzlich braucht, ist eine
eigene Zeile im Widget oder ein optionaler Teil wie `alignment`.

## 9k. StrokeStyleControls

`StrokeStyleControls` ist der Baustein für das Aussehen einer Linie oder
eines Umrisses (`StrokeStyle`), nach demselben Muster wie
`TextStyleControls`: Zeilen statt Rahmen, `label` für Screenreader.

- Zeile 1: Width (`ScrubbableNumber`, Icon ═, px, `minWidth` bis
  `maxWidth`, Standard 0–8; 0 heißt kein Strich) | Style (Icon-Gruppe
  Solid/Dashed/Dotted mit `.line-style-preview`)
- Zeile 2: Farbzeile (`PaintControl`, siehe 9q) mit Color und Opacity,
  dahinter ⚙, wenn `details` gegeben ist
- generisch über den Wert: Ein `StrokeStyle` hat eine eigene Farbe, ein
  `SeriesStrokeStyle` nicht, weil sie aus der Serie kommt
  (`hasStrokeColor`); dann zeigt die Farbzeile `seriesColor`, das Feld
  der Datenfarbe, oder nur die Deckkraft. `onChange` liefert denselben
  Typ zurück
- `defaultColor` wie bei `TextStyleControls`, hier optional, weil
  Serienlinien keine eigene Farbe haben
- genutzt vom Rahmen im `ContainerWidget` (Gruppe Border), von
  Achsenlinie und Gridlines im `AxisStrokeWidget` (Breite 1–4, Auge in
  der Überschrift; Titel, `label` und `defaultColor` per Prop, damit ein
  Widget beide Linien einer Achse bedient), von Linien-Marks (Gruppe
  Line mit der Datenfarbe, Breite 1–8) und den Rahmen der Balken,
  Scatter-Punkte und Pie-Segmente (Gruppe Border, `defaultColor` aus
  `CHART_MARK_BORDER`) in `markGroups.tsx`; später Tables

## 9l. Style-Bausteine und Abdeckung

`TextStyle` ist das Muster für wiederkehrende Formatierung: ein Werttyp
ohne Domänenwissen in `shared/`, eine Controls-Komponente mit immer
denselben Zeilen und je eine Übersetzung pro Renderer (CSS, ECharts).
In der Spec steht der Baustein als benanntes Unterobjekt (z. B.
`title.textStyle`), damit eine Gruppe im Popover genau einem Typ
entspricht.

Vorhandene Bausteine:

- `TextStyle` mit `TextStyleControls` (siehe 9j)
- `StrokeStyle` mit `StrokeStyleControls` (siehe 9k): Container-Rahmen
  (`ObjectContainer.border`), Achsenlinie und Gridlines
  (`AxisStrokeAppearance.stroke` in `xAxis.line` und
  `xAxis.gridLines`), Rahmen der Marks (`bar.border`, `scatter.border`,
  `pie.border`) und Linien-Marks (`LineAppearance.stroke` als
  `SeriesStrokeStyle`)
- `NumberFormat` mit `NumberFormatControls` (siehe 9m):
  Achsenbeschriftung (`AxisLabelsAppearance.numberFormat`), Card-Wert,
  Datenlabels und Tooltip (`interaction.tooltip.numberFormat`, ohne
  Control)
- `Fill` mit `FillControls` (siehe 9n): Fläche unter Linien
  (`line.area`), Balken (`bar.fill`), Scatter-Punkte (`scatter.fill`)
  und Pie-Segmente (`pie.fill`), alle als `SeriesFill` in der Farbe
  ihrer Serie; dazu die Hintergründe von Container und Canvas
  (`container.background`, `canvas.background`) mit eigener Farbe
- `Effect` mit `EffectControls` (siehe 9o): Glow auf allen Marks
  (`line.effect`, `bar.effect`, `scatter.effect`, `pie.effect`) in der
  Farbe der Serie bzw. des Segments
- `Layout` mit `LayoutControls` (siehe 9p): Titel (`title.layout`),
  Container (`container.layout`), Dashboard (`dashboard.layout`),
  Legende (`legend.layout`), Farbskala (`continuous.layout`) und
  Datenlabels (`labels.layout`)

Ein versetzter Schatten kommt später als weitere Variante von `Effect`
hinzu, z. B. für den Container.

Jedes Farbfeld dieser Bausteine ist ein `ColorValue`; die Color-Zeile
nutzt `ColorControl` mit der Reihe ihres Einsatzorts (siehe 9).

Ein neuer Baustein lohnt sich erst, wenn mindestens zwei Elemente ihn
tatsächlich nutzen oder der zweite Nutzer konkret geplant ist.
Erweiterungen bestehender Bausteine sind neue Felder oder neue
Varianten (`kind`), keine Formänderung.

### Formen und Serienfarbe

Jedes sichtbare Teil hat eine von drei Formen; aus der Form folgen die
Bausteine:

| Form   | Beispiele                                                                       | Bausteine                                                      |
| ------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Fläche | Container, Balken, Scatter-Punkt, Pie-Segment, Fläche unter Linie, Hintergründe | `Fill` bzw. `background`, Rahmen als `border`, Effect          |
| Linie  | Linien-Serie, Gridlines, Achsenlinie                                            | `stroke`, Effect                                               |
| Text   | Titel, Achsenbeschriftung, Datenlabel, Card-Wert                                | `textStyle`, bei Zahlen `numberFormat`, bei Datum `dateFormat` |

Marks (Balken, Linien, Punkte, Segmente) nehmen ihre Farbe aus der
Serie bzw. Palette und nutzen die Varianten ohne Farbe (`SeriesFill`,
`SeriesStrokeStyle`). Alle übrigen Teile haben eine feste Farbe als
`ColorValue`.

Feldnamen sind überall gleich: `textStyle`, `numberFormat`, `stroke`
(Linie), `border` (Umriss einer Fläche), `fill` (Fläche einer Serie),
`background` (feste Fläche), `effect`. Eine Suche nach dem Feldnamen
zeigt damit den Ist-Stand im Code.

### Ist und Soll

Planungsgrundlage für fehlende Formatierung; Spec-Pfade relativ zur
jeweiligen Appearance. Die Liste beschreibt den implementierten Stand
und wird mit jedem Baustein oder Element aktualisiert. Die Reihenfolge
der offenen Punkte steht in `ROADMAP.md`.

✓ vorhanden · ○ fehlt (geplant) · später: nach dem Alpha

Dashboard

| Teil      | Form   | Ist                 | Soll                        | Status |
| --------- | ------ | ------------------- | --------------------------- | ------ |
| Canvas    | Fläche | `canvas.background` | Verlauf (3.6)               | ✓, ○   |
| Abstände  | –      | `layout.gap`        | zusätzlich `layout.padding` | ○      |
| Animation | –      | `animation`         | –                           | ✓      |

Objekt (Chart und Card)

| Teil      | Form   | Ist                                                           | Soll                               | Status |
| --------- | ------ | ------------------------------------------------------------- | ---------------------------------- | ------ |
| Container | Fläche | `container.background`, `.border`, `.layout`, `.borderRadius` | `container.effect` (Schatten, 3.7) | ✓, ○   |
| Titel     | Text   | `title.textStyle`, `.layout`                                  | –                                  | ✓      |

Chart

| Teil               | Form         | Ist                                                        | Soll                                 | Status    |
| ------------------ | ------------ | ---------------------------------------------------------- | ------------------------------------ | --------- |
| Achsentitel        | Text         | `xAxis.title.text`, `.textStyle`, `.visible`               | –                                    | ✓         |
| Achsenbeschriftung | Text + Zahl  | `xAxis.labels.textStyle`, `.numberFormat`                  | –                                    | ✓         |
| Achsenbeschriftung | Datum        | festes Format über `formatDate`                            | `xAxis.labels.dateFormat`            | ○         |
| Achsenlinie        | Linie        | `xAxis.line.visible`, `.stroke`                            | –                                    | ✓         |
| Gridlines          | Linie        | `xAxis.gridLines.stroke`                                   | –                                    | ✓         |
| Legende            | Text         | `legend.textStyle`, `.layout`                              | –                                    | ✓         |
| Legende            | Fläche       | –                                                          | `legend.background`, `.border`       | ○         |
| Datenlabels        | Text + Zahl  | `labels.textStyle`, `.numberFormat`, `.layout`             | Label-Box (Fill, Stroke)             | ✓, später |
| Tooltip            | Zahl         | `interaction.tooltip.numberFormat` (ohne Control)          | Control                              | ✓, ○      |
| Tooltip            | Datum        | festes Format über `formatDate`                            | `interaction.tooltip.dateFormat`     | ○         |
| Tooltip            | Text, Fläche | fest im Adapter                                            | `textStyle`, `background`, `border`  | ○         |
| Farbskala          | –            | `colorScale.continuous.startColor`, `.endColor`, `.layout` | eigene HTML-Farbskala mit Bausteinen | ○         |

Marks

| Teil                | Form   | Ist                                                                                        | Soll                 | Status |
| ------------------- | ------ | ------------------------------------------------------------------------------------------ | -------------------- | ------ |
| Linie               | Linie  | `line.stroke` (`SeriesStrokeStyle`), `line.effect`                                         | –                    | ✓      |
| Fläche unter Linie  | Fläche | `line.areaFill`, `line.area` (`SeriesFill`)                                                | –                    | ✓      |
| Punkte auf Linie    | Fläche | `line.points` (`auto`, `on`, `off`)                                                        | Marker (Form, Größe) | später |
| Balken              | Fläche | `bar.fill` (`SeriesFill`), `.border`, `.borderRadius`, `.barWidth`, `.effect`              | –                    | ✓      |
| Scatter-Punkte      | Fläche | `scatter.fill` (`SeriesFill`), `.border`, `.effect`, `.symbol`, `.pointSize`, `.sizeRange` | –                    | ✓      |
| Pie-/Donut-Segmente | Fläche | `pie.fill` (`SeriesFill`), `.border`, `.innerRadius` (nur Donut), `.effect`                | –                    | ✓      |

Card

| Teil            | Form        | Ist                                     | Soll                   | Status           |
| --------------- | ----------- | --------------------------------------- | ---------------------- | ---------------- |
| Wert            | Text + Zahl | `value.textStyle`, `value.numberFormat` | zusätzlich Ausrichtung | ✓, Ausrichtung ○ |
| Selection-Label | Text        | `selectionLabel.textStyle`              | –                      | ✓                |

## 9m. NumberFormatControls

`NumberFormatControls` ist der Baustein für das Zahlenformat eines Werts
(`NumberFormat`), nach demselben Muster: eine Zeile statt Rahmen,
`label` für Screenreader („Value format“).

```text
[ Auto ▾      ]
[ Euro ▾      ]  [.0 Auto    ]   ⚙
```

- Format-Select mit Auto, Number, Percent und den Währungen; bei Auto
  entscheidet der Ort, der den Wert zeigt, daher steht dann nur das
  Select in der Zeile
- bei explizitem Stil: Decimals (`ScrubbableNumber` 0–6 mit `onAuto`,
  leer heißt Auto) und ⚙ (`DetailsPopover`) mit Notation
  (Standard | Compact) und Prefix | Suffix (`TextInput`)
- an Achsenlabels zusätzlich Date im Select (`isDate`, `onDate`) statt
  eines eigenen Typ-Selects; bei Date entfallen Decimals und ⚙
- genutzt vom Card-Wert im `CardValueWidget`, von der Achsenbeschriftung
  im `AxisWidget` und von den Datenlabels im `LabelsWidget` (nicht bei
  Pie und Donut, die Anteile zeigen)

## 9n. FillControls

`FillControls` ist der Baustein für die Füllung einer Fläche (`Fill`),
nach demselben Muster wie `StrokeStyleControls`: eine Farbzeile
(`PaintControl`, siehe 9q) statt Rahmen, `label` für Screenreader
(„Area fill color“).

- Color (`ColorField`) und Opacity (5–100 %), dahinter ⚙, wenn
  `details` gegeben ist (Range der Farbskala)
- `presets` sind die Felder, Standard Chart 1–5; die Hintergründe von
  Container und Canvas übergeben keine (`[]`), der Farbknopf öffnet
  dann direkt den Picker mit Hex-Feld
- generisch über den Wert: Ein `Fill` hat eine eigene Farbe, ein
  `SeriesFill` nicht, weil sie aus der Serie kommt (`hasFillColor`);
  dann zeigt die Zeile `seriesColor`, das Feld der Datenfarbe, oder nur
  die Deckkraft
- `kind` ist heute immer `solid` und hat keine Zeile; Verläufe kommen
  mit 3.6 als Icon-Gruppe in der Farbzeile
- genutzt von der Fläche unter Linien (Gruppe Area mit Auge), den
  Balken, den Scatter-Punkten und den Pie-Segmenten (Gruppe Fill mit der
  Datenfarbe) in `markGroups.tsx`, außerdem die Gruppe Background von
  Container (`ContainerWidget`) und Canvas (Dashboard-Popover)
- bei Balken, Punkten und Segmenten ist die Deckkraft die des ganzen
  Elements (ECharts kennt keine eigene Füll-Deckkraft): Rahmen und
  Glow blenden mit; der Rahmen hat zusätzlich seine eigene Opacity

## 9o. EffectControls

`EffectControls` ist die Zeile des Effekts einer Mark (`Effect`):
`label` für Screenreader („Bar glow intensity“).

- ohne Effekt zeigt die Gruppe Effect nur ihre Überschrift mit ＋, das
  einen Glow anlegt (`createEffect('glow')`, `blur` 12)
- mit Effekt: Art (`SelectControl`, heute nur Glow) | Intensity
  (`ScrubbableNumber` für `blur`, Icon ◌, 1–40) | − (entfernt den
  Effekt, `kind: 'none'`)
- ein Effekt pro Mark, weil ECharts je Mark nur einen Schatten zeichnet;
  ein späterer versetzter Schatten wird eine weitere Art im Select
- kein Auge, weil `Effect` keinen ausgeblendeten Zustand kennt, und
  keine Color-Zeile, weil Glow die Farbe der Mark nimmt
- genutzt von Linien, Balken, Scatter-Punkten und Pie-Segmenten in der
  Gruppe Effect der Marks
- Scatter zeichnet den Glow nur bis 500 Punkte (`MAX_GLOW_POINTS` im
  Adapter), weil jeder Punkt seinen eigenen Schatten weichzeichnet;
  darüber bleibt die Einstellung erhalten, ohne zu wirken, und das
  Control zeigt keinen Hinweis

## 9p. LayoutControls

`LayoutControls` ist der Baustein für die Platzierung eines Elements
(`Layout`), nach demselben Muster wie die übrigen Bausteine: Zeilen
statt Rahmen, `label` für Screenreader („Legend position“).

- je zwei Controls in einer kompakten Zeile (`pairControls`): Position,
  Orientation (Pfeil-Icons), Alignment (`AlignmentControl`), Gap (Icon
  `Space`) und Padding (Icon `Fullscreen`; beide `ScrubbableNumber`,
  Schritt 2, Grenzen über `maxGap` und `maxPadding`)
- generisch über den Wert: Es erscheinen nur die Controls, deren Felder
  das Layout hat; der Container zeigt nur Padding, die Datenlabels nur
  die Position
- ein Layout mit Seite und Alignment, z. B. die Legende, zeigt beides
  in einem `PositionGrid` (siehe 9r)
- `positions` schränkt die Positionen ein (Standard: die vier Seiten).
  Seiten erscheinen als Pfeile (`.layout-position-control`); Positionen
  mit eigenem `icon`, z. B. die `labelPositions` der Registry, zeigen
  Icon und Wort; eine einzige Position braucht kein Control
- steht im Popover immer in der Gruppe Layout

## 9q. PaintControl und ColorField

`ColorField` ist das Farbfeld einer kompakten Zeile (`.field`
`.color-field`): links das Swatch des kompakten `ColorControl`, das den
Farbwähler mit den Farben des Einsatzorts öffnet, rechts der Hex-Wert
einer eigenen Farbe (direkt editierbar) oder der Name ihres Presets
(„Default“, „Chart 2“).

- generisch über benannte Presets wie `ColorControl`
  (`ColorPreset<TPreset>`), derzeit ohne Nutzer
- genutzt von `TextStyleControls`, `PaintControl` und der Datenfarbe
  (`getDataColorField`)

`PaintControl` ist die Farbzeile eines Fills oder Strokes: Farbfeld |
Deckkraft (`ScrubbableNumber`, Icon ◐, %) | optional ⚙ (`details`).

- `color` ist die eigene Farbe mit ihren Presets; ein Serien-Paint hat
  keine und zeigt stattdessen `seriesColor`, das Feld der Datenfarbe,
  oder nur die Deckkraft
- `FillControls` und `StrokeStyleControls` bauen ihre Farbzeile damit,
  auch für die Hintergründe von Container und Canvas

`.field` (`styles/field.css`) ist die gemeinsame Fläche der Felder:
Pill-Form, Rahmen über `--field-border-color` (in kompakten Zeilen
transparent), neutrale Kante bei Hover, Akzent-Kante bei Fokus.

## 9r. PositionGrid

`PositionGrid` wählt Seite und Alignment eines Elements in einem
3×3-Raster, ohne Formänderung des `Layout`:

```text
[↖] [↑] [↗]    top: start | center | end
[←] [ ] [→]    left | (Plot, deaktiviert) | right
[↙] [↓] [↘]    bottom: start | center | end
```

- jede Zelle ist ein Button mit Namen („Top left“) und zeigt, wo das
  Element sitzt; die Mitte steht für den Plot und ist deaktiviert
- links und rechts nur mittig, weil die Legende dort vertikal läuft
- genutzt von der Legende über `LayoutControls`; die Farbskala folgt
  mit 3.9

## 9s. Optionen mit Icons

`OptionItem` (`OptionsMenu.tsx`) ist eine Option von Select, Menü und
Icon-Gruppe: `label`, `value` und optional `icon` (`LucideIcon`).

- `OptionContent` zeigt Icon und Wort einer Option, gleich in
  `SegmentedControl`, `OptionsMenu` und im Button von `SelectControl`;
  lange Wörter enden mit „…“, das Icon schrumpft nicht
- `renderOption` ersetzt die Darstellung, z. B. nur ein Icon, das das
  Ergebnis zeigt, oder die Paletten-Vorschau; gibt `renderOption` in
  einer Icon-Gruppe `null` zurück, bleibt es bei Icon und Wort
- eigene Icons entstehen mit `createLucideIcon` in
  `charts/chartIcons.ts`, im Strich von Lucide auf einer 16-px-Fläche:
  die Label-Positionen je Mark (`BarLabelTop`, `PointLabelRight`, …) und
  x̄ bzw. x̃ für Mean und Median (`XBar`, `XTilde`)
- Aggregationen tragen ihr Icon an einer Stelle (`AGGREGATION_ICONS`
  neben `AGGREGATION_LABELS` in `charts/aggregations.ts`): Σ Sum, x̄
  Mean, x̃ Median, ⤓ Min, ⤒ Max, # Count; `getAggregationOptions`
  liefert sie für Card und Build Panel
- weitere Aggregationen folgen einem System aus Grundzeichen und Zusatz,
  z. B. ↗ für kumuliert (Cumsum als Σ mit ↗, Π für Product)

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
Legend                👁
├── Layout       (PositionGrid, Gap)
├── Text
└── Interaction  [ Off | Multiple | Single ]
```

Die Legend scrollt statt überzulaufen: `overflow` `auto` und `scroll`
ergeben eine ECharts-Scroll-Legend mit Blätter-Pfeilen in Text- und
Inactive-Farbe, `plain` eine einfache Legend. Pie und Donut rücken zur
Gegenseite einer sichtbaren Legend (`getPieCenter`); ihre Legend steht
per Default rechts, Prozent-Labels innerhalb der Segmente.

Die Legend Interaction erscheint nur bei einer relevanten Legend. Sie
legt fest, was ein Klick auf einen Eintrag tut: nichts (Off,
`enabled: false`), Serien ein- und ausblenden (Multiple) oder nur eine
Serie zeigen (Single), wie `selectedMode` in ECharts. Bei Off ist die
Legende keine Format-Region (Issue #9).

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

Das Element „Color Scale“ im Format-Popover hat sein Auge im Kopf und
die Gruppen Layout (Position links oder rechts, vertikal oder
horizontal) und Labels (Auge für die Endlabels). Start- und Endfarbe
(`GradientControl`) und Range (⚙) stehen als Datenfarbe in der
Farbzeile der Marks.

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

- Background über `FillControls`: eigene Farbe und Deckkraft
  (Standard `#202226`, 100 %), ohne Felder;
- Padding und Radius über `ScrubbableNumber` mit Icon und px;
- Rahmen über `StrokeStyleControls` (Breite 0 heißt kein Rahmen).

Der Container ist eine flache Fläche: kein Glass, keine Lichtkante,
kein Schatten. `ObjectFrame` setzt die Farbe als `--chart-background`
und die Deckkraft als `--chart-background-opacity`;
`.chart-item-background` malt sie auf einer eigenen Ebene hinter dem
Inhalt, damit die Deckkraft nur die Fläche ausblendet. Das gilt für
jedes Dashboard-Objekt. Schatten und vorgefertigte Looks kommen mit den
Dashboard-Styles (`ROADMAP.md`, 3.8).

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
  X; dazwischen das Auge, wo sich das Element ausblenden lässt.
- Darunter stehen alle Gruppen des Elements untereinander (Aufbau und
  Reihenfolge siehe Abschnitt 6).
  Verhalten ohne Element im Chart (z. B. Legend Selection Mode, Zoom)
  ist eine Gruppe des Elements, das es betrifft.
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
  ihrer letzten Gruppe Tooltip und dem Button „Edit ›“ (`accent`)
  dorthin.
  Solange „Tooltip“ formatiert wird, steht der echte Tooltip als
  Vorschau am größten Wert, folgt nicht dem Pointer und zeigt jede
  Änderung sofort; der übrige Chart ist abgeblendet. Kein eigenes
  Vorschaufenster, keine Beispieldaten.
- Das Objekt als Ganzes hat keine Region, sondern einen
  durchgehenden Akzent-Ring innen am Frame (2 px, `--color-accent`),
  ohne Tönung und Schein. Beim Hover über eine freie Stelle
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
