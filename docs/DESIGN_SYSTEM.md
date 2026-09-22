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

## 12. Reuse Rules

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

## 13. CSS

Custom CSS bleibt aktuell ein zentraler Teil des UI-Systems.

Bevor neue Styles geschrieben werden:

- bestehende Design Tokens prüfen;
- bestehende Utility-/Component-Klassen prüfen;
- bestehende Glass Surfaces prüfen;
- bestehende Spacing-/Radius-Patterns prüfen.

Keine nahezu identischen lokalen Styles kopieren.

## 14. Interaction States

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

## 15. Direct Manipulation

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

Für Dashboard Objects soll ein eigener Drag Handle verwendet werden,
damit Zoom, Tooltip und Selection im Chart nicht gestört werden.
