# Komponentenregister

Alle React-Komponenten in `frontend/src` (ohne Hooks und reine
Funktionen), geordnet nach Ebene laut `DEVELOPMENT.md` §21, darin
alphabetisch. Pfade relativ zu `frontend/src/`.

- **Ebene:** Container, Element, Group, Row, Control, Primitive, Tile,
  Fachansicht oder Ausnahme (§21)
- **Status:** bleibt · umbenannt · geht auf in … · aufgeteilt in … ·
  entfällt · unklar
- **Teil:** Teil des Refactoring-Slices (`ROADMAP.md` 3.14), in dem sich
  die Zeile ändert, oder –
- **Pflege:** Jeder Block, der Komponenten anlegt, umbenennt, verschiebt
  oder entfernt, aktualisiert die betroffenen Zeilen im selben Commit. Am
  Ende des Slices ist keine Zeile mehr „unklar“; dann entfallen Status,
  Teil und Grund, und die Datei bleibt als Katalog.

## Container

| Komponente (heute)    | Datei                                   | Ebene     | Zweck (ein Satz)                                                                         | Ziel                  | Status | Teil | Grund                                                     |
| --------------------- | --------------------------------------- | --------- | ---------------------------------------------------------------------------------------- | --------------------- | ------ | ---- | --------------------------------------------------------- |
| BuildPanel            | `workspace/BuildPanel.tsx`              | Container | Build Panel links mit Objekten, Dataset, Feldern und Chartdaten als einklappbare Gruppen | BuildPanel            | bleibt | –    | Name passt zur Grammatik                                  |
| CanvasPanel           | `workspace/CanvasPanel.tsx`             | Container | Arbeitsfläche des Visualize-Workspace mit Objektraster und Befehlen                      | CanvasPanel           | bleibt | –    | Name passt zur Grammatik                                  |
| CardFormatPanel       | `cards/CardFormatPanel.tsx`             | Container | Format-Panel einer Card, wählt die Gruppen je Element                                    | CardFormatPanel       | bleibt | –    | Name passt zur Grammatik                                  |
| ChartFormatPanel      | `charts/format/ChartFormatPanel.tsx`    | Container | Format-Panel eines Charts, wählt die Gruppen je Element                                  | ChartFormatPanel      | bleibt | –    | Name passt zur Grammatik                                  |
| ColorEditor           | `shared/ui/containers/ColorEditor.tsx`  | Container | Inhalt des Farb-Popovers mit Presets, Farbfläche, Hue-Regler und Hex-Wert                | ColorEditor           | bleibt | –    | umbenannt in Teil 4                                       |
| DashboardFormatPanel  | `workspace/DashboardFormatPanel.tsx`    | Container | Format-Panel ohne Auswahl mit Style, Layout, Hintergrund und Animation                   | DashboardFormatPanel  | bleibt | –    | Name passt zur Grammatik                                  |
| DataPanel             | `datasets/DataPanel.tsx`                | Container | Data-Workspace, schaltet zwischen Profil und Tabelle                                     | DataPanel             | unklar | –    | Ort offen, siehe unten                                    |
| DataTableFilterEditor | `table/DataTableFilterEditor.tsx`       | Container | Inhalt des Filter-Popovers einer Spalte, ein Formular je Rolle                           | DataTableFilterEditor | bleibt | –    | umbenannt in Teil 4                                       |
| Editor                | `shared/ui/containers/Editor.tsx`       | Container | Basis: Inhalt eines Popovers mit Abstand, optionalem Kopf und neuer Gruppenebene         | Editor                | bleibt | –    | Basis                                                     |
| EffectEditor          | `shared/ui/containers/EffectEditor.tsx` | Container | Art und Werte eines Effekts                                                              | EffectEditor          | bleibt | –    | Name passt zur Grammatik                                  |
| FormatPanel           | `shared/ui/containers/FormatPanel.tsx`  | Container | Basis der Format-Panels mit Elementauswahl, Auge, Fokus und Scrollen                     | FormatPanel           | bleibt | –    | Basis                                                     |
| PaintEditor           | `shared/ui/containers/PaintEditor.tsx`  | Container | Typ, Farbe, Winkel bzw. Form und Stopps einer Paint                                      | PaintEditor           | bleibt | 6    | Struktur bleibt, Fade und Serienfarbe entfallen in Teil 6 |
| Panel                 | `shared/ui/containers/Panel.tsx`        | Container | Basis: Bereich mit Kopf, Aktionen und Einklappen                                         | Panel                 | bleibt | –    | Basis                                                     |

## Element

| Komponente (heute) | Datei                                 | Ebene   | Zweck (ein Satz)                                                        | Ziel              | Status | Teil | Grund               |
| ------------------ | ------------------------------------- | ------- | ----------------------------------------------------------------------- | ----------------- | ------ | ---- | ------------------- |
| CardValueElement   | `cards/CardValueElement.tsx`          | Element | Groups des Card-Werts: Function, Text und Format                        | CardValueElement  | bleibt | –    | umbenannt in Teil 4 |
| ColorScaleElement  | `charts/format/ColorScaleElement.tsx` | Element | Groups der Farbskala: Position, Layout, Fläche, Titel, Labels und Ticks | ColorScaleElement | bleibt | –    | umbenannt in Teil 4 |
| ContainerElement   | `objects/ContainerElement.tsx`        | Element | Groups eines Containers: Position, Layout, dann die Fläche              | ContainerElement  | bleibt | –    | umbenannt in Teil 4 |
| LegendElement      | `charts/format/LegendElement.tsx`     | Element | Groups der Legende: Position, Layout, Fläche und Text                   | LegendElement     | bleibt | –    | umbenannt in Teil 4 |
| TitleElement       | `objects/TitleElement.tsx`            | Element | Groups eines Objekttitels: Content und Text                             | TitleElement      | bleibt | –    | umbenannt in Teil 4 |

## Group

| Komponente (heute)     | Datei                                       | Ebene | Zweck (ein Satz)                                                         | Ziel                   | Status                        | Teil   | Grund                                                                                    |
| ---------------------- | ------------------------------------------- | ----- | ------------------------------------------------------------------------ | ---------------------- | ----------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| AggregationGroup       | `charts/data/AggregationGroup.tsx`          | Group | Gruppe ohne Titel mit Wert- und Farbfunktion der Chartdaten              | AggregationGroup       | bleibt                        | –      | umbenannt in Teil 4                                                                      |
| AnimationGroup         | `workspace/AnimationGroup.tsx`              | Group | Animation des Dashboards, Plus oder Easing und Dauer                     | AnimationGroup         | bleibt                        | –      | umbenannt in Teil 4                                                                      |
| AxisLabelsGroup        | `charts/format/AxisLabelsGroup.tsx`         | Group | Labels einer Achse oder der Farbskala mit Untergruppen                   | AxisLabelsGroup        | bleibt                        | –      | Name passt zur Grammatik                                                                 |
| AxisTitleGroup         | `charts/format/AxisTitleGroup.tsx`          | Group | Titel einer Achse oder der Farbskala mit Auge                            | AxisTitleGroup         | bleibt                        | –      | Name passt; O4 prüft Zusammenlegen                                                       |
| BackgroundGroup        | `shared/ui/groups/BackgroundGroup.tsx`      | Group | Hintergrund einer Fläche als Fill-Liste mit Plus und Minus               | BackgroundGroup        | bleibt                        | –      | Name passt zur Grammatik                                                                 |
| CardSelectionGroup     | `cards/CardSelectionGroup.tsx`              | Group | Label der Auswahl unter dem Card-Wert mit Auge                           | CardSelectionGroup     | bleibt                        | –      | Name passt zur Grammatik                                                                 |
| EffectsGroup           | `shared/ui/groups/EffectsGroup.tsx`         | Group | Effekte einer Mark oder Fläche mit Plus                                  | EffectsGroup           | bleibt                        | –      | Name passt zur Grammatik                                                                 |
| EncodingsGroup         | `charts/data/EncodingsGroup.tsx`            | Group | Gruppe ohne Titel mit Charttyp, Encodings, Zeitraster und Sortierung     | EncodingsGroup         | bleibt                        | –      | umbenannt in Teil 4                                                                      |
| Group                  | `shared/ui/groups/Group.tsx`                | Group | Basis: Titel, Auge, Plus, Einklappen und Untergruppe per Context         | Group                  | bleibt                        | –      | Basis                                                                                    |
| LabelsGroup            | `charts/format/LabelsGroup.tsx`             | Group | Data Labels der Marks mit Auge und Untergruppen                          | LabelsElement          | umbenannt                     | Design | wird mit eigenem Eintrag in der Auswahl ein Element                                      |
| LayoutControls         | `shared/ui/groups/LayoutControls.tsx`       | Group | Zeilen der Layout-Gruppe: Größe, Abstand und Anordnung                   | LayoutGroup            | geht auf in LayoutGroup       | 5      | wiederverwendet wird eine ganze Group; in Tooltip erst im Design-Slice                   |
| LegendInteractionGroup | `charts/format/LegendInteractionGroup.tsx`  | Group | Auswahlmodus der Legende                                                 | LegendInteractionGroup | bleibt                        | –      | umbenannt in Teil 4                                                                      |
| NumberFormatControls   | `shared/ui/groups/NumberFormatControls.tsx` | Group | Zeilen eines Zahlenformats: Format, Nachkommastellen, Notation, Vorschau | NumberFormatGroup      | geht auf in NumberFormatGroup | 5      | wiederverwendet wird eine ganze Group; in Labels und Tooltip erst im Design-Slice        |
| PositionControls       | `shared/ui/groups/PositionControls.tsx`     | Group | Zeilen der Position-Gruppe: Koordinaten, Platz oder Auswahl              | PositionGroup          | geht auf in PositionGroup     | 5      | wiederverwendet wird eine ganze Group; in Labels erst im Design-Slice                    |
| ShadowControls         | `shared/ui/groups/ShadowControls.tsx`       | Group | Gruppen eines Schattens im Editor: Offset, Blur und Farbe                | EffectEditor           | geht auf in EffectEditor      | 5      | nur der Effekt-Editor nutzt sie                                                          |
| StrokeGroup            | `shared/ui/groups/StrokeGroup.tsx`          | Group | eine Kontur mit Auge, z. B. Border oder Gridlines                        | StrokeGroup            | bleibt                        | –      | umbenannt in Teil 4                                                                      |
| StrokeStyleControls    | `shared/ui/groups/StrokeStyleControls.tsx`  | Group | Zeilen einer Kontur: Paint, Breite und Linienstil                        | StrokeGroup            | geht auf in StrokeGroup       | 5      | wiederverwendet wird eine ganze Group                                                    |
| SurfaceControls        | `shared/ui/groups/SurfaceControls.tsx`      | Group | Gruppen einer Fläche: Shape, Background, Border und Effects              | –                      | entfällt                      | 5      | jedes Element listet seine Groups; in Tooltip erst im Design-Slice                       |
| TextStyleControls      | `shared/ui/groups/TextStyleControls.tsx`    | Group | Zeilen eines Textes: Größe, Gewicht, Kursiv, Farbe und Ausrichtung       | TextGroup              | geht auf in TextGroup         | 5      | wiederverwendet wird eine ganze Group; Gewicht und Kursiv werden „Schrift“ und „Schnitt“ |
| TooltipGroup           | `charts/format/TooltipGroup.tsx`            | Group | Tooltip der Marks mit Auge und Untergruppen                              | TooltipElement         | umbenannt                     | Design | wird mit eigenem Eintrag in der Auswahl ein Element                                      |
| ZoomGroup              | `charts/format/ZoomGroup.tsx`               | Group | Zoom der X-Achse                                                         | ZoomGroup              | bleibt                        | –      | umbenannt in Teil 4                                                                      |

## Row

| Komponente (heute) | Datei                                | Ebene | Zweck (ein Satz)                                                 | Ziel            | Status | Teil | Grund                                        |
| ------------------ | ------------------------------------ | ----- | ---------------------------------------------------------------- | --------------- | ------ | ---- | -------------------------------------------- |
| BoxRow             | `shared/ui/rows/BoxRow.tsx`          | Row   | eine Zeile mit Koordinaten oder Maßen eines Kastens              | BoxRow          | bleibt | –    | umbenannt in Teil 4                          |
| DateFormatRow      | `charts/format/DateFormatRow.tsx`    | Row   | breite Zeile mit dem Datumsformat                                | DateFormatRow   | bleibt | –    | umbenannt in Teil 4                          |
| EffectRow          | `shared/ui/rows/EffectRow.tsx`       | Row   | ein Effekt als Control mit Art, das den Editor öffnet, und Minus | EffectRow       | bleibt | –    | Name passt zur Grammatik                     |
| GradientStopRow    | `shared/ui/rows/GradientStopRow.tsx` | Row   | ein Verlaufsstopp mit Farbe, Position, Deckkraft und Minus       | GradientStopRow | bleibt | 6    | eigenes Raster, O2 bringt es auf die Row     |
| PaintRow           | `shared/ui/rows/PaintRow.tsx`        | Row   | Paint und Deckkraft einer Fläche oder Kontur                     | PaintRow        | bleibt | 6    | wird in Teil 6 überall die Zeile einer Paint |
| Row                | `shared/ui/rows/Row.tsx`             | Row   | Basis: festes Raster `1fr 1fr 24px` mit Aktionsspalte            | Row             | bleibt | –    | Basis                                        |

## Control

| Komponente (heute)     | Datei                                      | Ebene   | Zweck (ein Satz)                                            | Ziel                      | Status                       | Teil | Grund                                          |
| ---------------------- | ------------------------------------------ | ------- | ----------------------------------------------------------- | ------------------------- | ---------------------------- | ---- | ---------------------------------------------- |
| AlignmentControl       | `shared/ui/controls/AlignmentControl.tsx`  | Control | Anfang, Mitte oder Ende als Icon-Gruppe                     | SegmentedControl          | geht auf in SegmentedControl | 5    | gleiches Verhalten, nur andere Optionen        |
| CheckList              | `table/CheckList.tsx`                      | Control | Werteliste mit Häkchen im Tabellenfilter                    | CheckList                 | bleibt                       | –    | eigenes Verhalten (Mehrfachauswahl)            |
| ColorControl           | `shared/ui/controls/ColorControl.tsx`      | Control | Swatch mit Hex-Wert oder Presetname einer Farbe             | PaintControl              | geht auf in PaintControl     | 6    | `PaintControl` mit nur Solid                   |
| ColorSwatch            | `shared/ui/ColorSwatch.tsx`                | Control | Swatch, der den Farbwähler öffnet                           | ?                         | unklar                       | –    | siehe unten                                    |
| DataTableFilterControl | `table/DataTableFilterControl.tsx`         | Control | Filter-Knopf im Spaltenkopf mit Popover und Zurücksetzen    | DataTableFilterControl    | bleibt                       | –    | umbenannt in Teil 4                            |
| DetailsControl         | `shared/ui/controls/DetailsControl.tsx`    | Control | Icon und Kurztext, öffnet Details in einem Editor           | DetailsControl            | bleibt                       | –    | Name beschlossen                               |
| FontWeightControl      | `shared/ui/controls/FontWeightControl.tsx` | Control | Schriftgewicht als Segmente                                 | SelectControl („Schnitt“) | geht auf in SelectControl    | 5    | mit Kursiv ein Auswahlfeld „Schnitt“           |
| GradientControl        | `charts/format/GradientControl.tsx`        | Control | Verlauf der Farbskala mit zwei Enden                        | ?                         | unklar                       | 6    | siehe unten                                    |
| PaintControl           | `shared/ui/controls/PaintControl.tsx`      | Control | Swatch einer Paint mit Hex-Wert bzw. Typ, öffnet den Editor | PaintControl              | bleibt                       | 6    | nimmt in Teil 6 `ColorControl` auf             |
| PaletteControl         | `charts/format/PaletteControl.tsx`         | Control | Palette der kategorialen Farben in einem Menü               | SelectControl             | geht auf in SelectControl    | 5    | gleiches Verhalten, nur andere Optionen        |
| PositionGrid           | `shared/ui/controls/PositionGrid.tsx`      | Control | 3×3-Raster für die Lage eines Elements um den Plot          | SegmentedControl          | geht auf in SegmentedControl | 5    | gleiches Verhalten, nur andere Optionen        |
| RangeControl           | `table/RangeControl.tsx`                   | Control | Bereich mit zwei Griffen auf einer Spur                     | RangeControl              | bleibt                       | –    | umbenannt in Teil 4                            |
| RotationDial           | `shared/ui/controls/RotationDial.tsx`      | Control | Winkel einer Drehung oder Richtung                          | NumberControl             | geht auf in NumberControl    | 5    | Winkel ist eine Zahl mit Einheit °             |
| ScrubbableNumber       | `shared/ui/controls/ScrubbableNumber.tsx`  | Control | Zahl per Ziehen, Tippen oder Pfeiltasten, optional Auto     | NumberControl             | geht auf in NumberControl    | 5    | aus Button und `NumberInput`, mit Prozentmodus |
| SegmentedControl       | `shared/ui/controls/SegmentedControl.tsx`  | Control | eine Auswahl aus Segmenten                                  | SegmentedControl          | bleibt                       | 5    | nimmt Ausrichtung und Position auf             |
| SelectControl          | `shared/ui/controls/SelectControl.tsx`     | Control | eine Auswahl aus einem Menü                                 | SelectControl             | bleibt                       | 5    | nimmt Palette, Datumsformat und Schnitt auf    |

## Primitive

| Komponente (heute) | Datei                                    | Ebene     | Zweck (ein Satz)                                                  | Ziel                | Status             | Teil | Grund                                                   |
| ------------------ | ---------------------------------------- | --------- | ----------------------------------------------------------------- | ------------------- | ------------------ | ---- | ------------------------------------------------------- |
| Button             | `shared/ui/primitives/Button.tsx`        | Primitive | Basis: Button mit Pillen-Fläche                                   | Button              | bleibt             | 5    | bekommt Arten (Text, Icon, Kachel, Swatch, ohne Fläche) |
| Chip               | `shared/ui/primitives/Chip.tsx`          | Primitive | Pille als Button, z. B. ein Datenfeld oder ein aktiver Filter     | Chip                | unklar             | 5    | siehe unten                                             |
| CommandButton      | `app/CommandButton.tsx`                  | Primitive | Icon-Button eines Befehls, gedrückt solange der Befehl aktiv ist  | ?                   | unklar             | 5    | siehe unten                                             |
| IconBadge          | `shared/ui/primitives/IconBadge.tsx`     | Primitive | Icon mit optionalem Label, z. B. im Kopf eines Panels             | IconBadge           | bleibt             | –    | kleinster Anzeige-Baustein                              |
| IconButton         | `shared/ui/primitives/IconButton.tsx`    | Primitive | Button nur mit Icon, benannt für Screenreader und Tooltip         | IconButton          | bleibt             | 5    | wird dünne Variante von `Button`                        |
| InlineTextInput    | `shared/ui/InlineTextInput.tsx`          | Primitive | Text an Ort und Stelle ändern, Enter übernimmt, Escape bricht ab  | ?                   | unklar             | 5    | siehe unten                                             |
| NumberInput        | `shared/ui/primitives/NumberInput.tsx`   | Primitive | natives Zahlenfeld mit Entwurf bis Enter oder Blur und Begrenzung | NumberInput         | bleibt             | 5    | wird Eingabeteil von `NumberControl`                    |
| OptionContent      | `shared/ui/primitives/OptionContent.tsx` | Primitive | Icon und Label einer Option in Menüs, Auswahlen und Segmenten     | OptionContent       | bleibt             | –    | kleinster Anzeige-Baustein                              |
| OptionsMenu        | `shared/ui/primitives/OptionsMenu.tsx`   | Primitive | Liste von Optionen in einem Menü                                  | Menu                | umbenannt          | 5    | Variante von `Popover` laut §21                         |
| Popover            | `shared/ui/primitives/Popover.tsx`       | Primitive | Basis: Auslöser, Aufklappen und Fläche, Variante `editor`         | Popover             | bleibt             | –    | Basis                                                   |
| PopoverNode        | `shared/ui/primitives/Popover.tsx`       | Primitive | interner Knoten eines Popovers im Popover-Baum                    | PopoverNode         | bleibt             | –    | interner Teil von `Popover`                             |
| TextInput          | `shared/ui/primitives/TextInput.tsx`     | Primitive | natives Textfeld, optional mit Icon                               | TextInput           | bleibt             | 5    | wird Variante von `Input`                               |
| WidgetButton       | `shared/ui/primitives/WidgetButton.tsx`  | Primitive | Kachel als Button, z. B. ein Charttyp im Picker                   | Button (Kachel-Art) | geht auf in Button | 5    | Kachel-Optik als Art von `Button`                       |

## Tile

| Komponente (heute)  | Datei                           | Ebene | Zweck (ein Satz)                                                 | Ziel                | Status | Teil | Grund                             |
| ------------------- | ------------------------------- | ----- | ---------------------------------------------------------------- | ------------------- | ------ | ---- | --------------------------------- |
| DatasetTile         | `datasets/DatasetTile.tsx`      | Tile  | Kachel des Datasets mit Upload                                   | DatasetTile         | bleibt | –    | umbenannt in Teil 4               |
| FieldProfileTile    | `datasets/FieldProfileTile.tsx` | Tile  | Profilkachel eines Datenfelds                                    | FieldProfileTile    | bleibt | –    | umbenannt in Teil 4               |
| ObjectOptionContent | `objects/ObjectPicker.tsx`      | Tile  | Icon und Name einer Objekt-Option, auch beim Ziehen              | ObjectOptionContent | bleibt | –    | Inhalt der Kachel, auch im Ziehen |
| ObjectOptionTile    | `objects/ObjectPicker.tsx`      | Tile  | Kachel eines Objekts im Picker, Klick fügt hinzu, Ziehen legt ab | ObjectOptionTile    | bleibt | –    | umbenannt in Teil 4               |
| StatTile            | `datasets/StatTile.tsx`         | Tile  | Kachel einer Kennzahl im Profil                                  | StatTile            | bleibt | –    | umbenannt in Teil 4               |
| Tile                | `shared/ui/tiles/Tile.tsx`      | Tile  | Basis: Kachel                                                    | Tile                | bleibt | –    | Basis                             |

## Fachansicht

| Komponente (heute)    | Datei                              | Ebene       | Zweck (ein Satz)                                               | Ziel                  | Status    | Teil | Grund                                        |
| --------------------- | ---------------------------------- | ----------- | -------------------------------------------------------------- | --------------------- | --------- | ---- | -------------------------------------------- |
| App                   | `app/App.tsx`                      | Fachansicht | App-Shell, setzt Workspaces, Panels und Befehle zusammen       | App                   | bleibt    | –    | außerhalb der Panel-Ebenen                   |
| AskCevynBar           | `ai/AskCevynBar.tsx`               | Fachansicht | Eingabeleiste von Ask Cevyn                                    | AskCevynBar           | bleibt    | –    | außerhalb der Panel-Ebenen                   |
| CardItem              | `cards/CardItem.tsx`               | Fachansicht | Inhalt einer Card im Objektrahmen                              | CardContent           | umbenannt | 8    | Inhalt im Rahmen, parallel zu `ChartContent` |
| ChartColorScale       | `charts/ChartColorScale.tsx`       | Fachansicht | Farbskala eines Charts als HTML neben dem Canvas               | ChartColorScale       | bleibt    | –    | Teil der Chart-Darstellung                   |
| ChartGrid             | `workspace/ChartGrid.tsx`          | Fachansicht | Raster aller Objekte auf der Arbeitsfläche                     | ObjectGrid            | umbenannt | 8    | enthält alle Objektarten, nicht nur Charts   |
| ChartItem             | `charts/ChartItem.tsx`             | Fachansicht | Inhalt eines Charts im Objektrahmen                            | ChartContent          | umbenannt | 8    | Namensraum vom ECharts-Builder trennen       |
| ChartLegend           | `charts/ChartLegend.tsx`           | Fachansicht | Legende eines Charts als HTML neben dem Canvas                 | ChartLegend           | bleibt    | –    | Teil der Chart-Darstellung                   |
| DatasetProfileView    | `datasets/DatasetProfileView.tsx`  | Fachansicht | Profil des Datasets mit Kennzahlen und Feldern als Kacheln     | DatasetProfileView    | bleibt    | –    | Fachansicht im Data-Workspace                |
| DataTable             | `table/DataTable.tsx`              | Fachansicht | virtualisierte Tabelle der Daten                               | DataTable             | bleibt    | –    | Ausnahme laut §21                            |
| DataTableColumnHeader | `table/DataTableColumnHeader.tsx`  | Fachansicht | Spaltenkopf mit Typ, Sortierung, Filter und Verteilung         | DataTableColumnHeader | bleibt    | –    | Teil der Tabelle                             |
| DataTableRow          | `table/DataTableRow.tsx`           | Fachansicht | eine Tabellenzeile mit Zeilennummer                            | DataTableRow          | bleibt    | –    | Tabellenzeile, keine Panel-Row               |
| DataTableToolbar      | `table/DataTableToolbar.tsx`       | Fachansicht | Leiste über der Tabelle mit Zeilenzahl, Filter-Chips und Reset | DataTableToolbar      | bleibt    | –    | Teil der Tabelle                             |
| DraggableFieldChip    | `datasets/FieldList.tsx`           | Fachansicht | ziehbarer Chip eines Datenfelds                                | DraggableFieldChip    | bleibt    | –    | „Field“ meint hier ein Datenfeld             |
| DragPreviewOverlay    | `workspace/DragPreviewOverlay.tsx` | Fachansicht | Vorschau unter dem Zeiger beim Ziehen                          | DragPreviewOverlay    | bleibt    | –    | Teil des Ziehens auf die Arbeitsfläche       |
| DropSlot              | `workspace/DropSlot.tsx`           | Fachansicht | Ablageziel für ein gezogenes Feld über einem Objekt            | DropSlot              | bleibt    | 8    | Ort `objects/` laut Inventur §5              |
| EChartCanvas          | `charts/EChartCanvas.tsx`          | Fachansicht | ECharts-Canvas eines Charts                                    | EChartCanvas          | bleibt    | –    | Teil der Chart-Darstellung                   |
| EncodingDropSlot      | `charts/EncodingDropSlots.tsx`     | Fachansicht | ein Ablageziel für ein Encoding                                | EncodingDropSlot      | bleibt    | 8    | wird entlang Rahmen, Inhalt, Slots getrennt  |
| EncodingDropSlots     | `charts/EncodingDropSlots.tsx`     | Fachansicht | Ablageziele aller Encodings, solange ein Feld gezogen wird     | EncodingDropSlots     | bleibt    | 8    | wird entlang Rahmen, Inhalt, Slots getrennt  |
| FieldList             | `datasets/FieldList.tsx`           | Fachansicht | Suche und Feldgruppen im Build Panel                           | FieldList             | bleibt    | –    | „Field“ meint hier Datenfelder               |
| LayoutHandle          | `objects/ObjectFrame.tsx`          | Fachansicht | Griff zum Verschieben oder Ändern der Größe eines Objekts      | LayoutHandle          | bleibt    | –    | Teil von `ObjectFrame`                       |
| MiniHistogram         | `shared/ui/MiniHistogram.tsx`      | Fachansicht | kleine Verteilung in Profilkachel und Spaltenkopf              | MiniHistogram         | bleibt    | –    | Datendarstellung; Ordner siehe unten         |
| NavigationRail        | `app/NavigationRail.tsx`           | Fachansicht | Leiste zum Wechsel der Workspaces                              | NavigationRail        | bleibt    | –    | außerhalb der Panel-Ebenen                   |
| ObjectFrame           | `objects/ObjectFrame.tsx`          | Fachansicht | Rahmen eines Objekts auf der Arbeitsfläche                     | ObjectFrame           | bleibt    | –    | Ausnahme laut §21                            |
| ObjectPicker          | `objects/ObjectPicker.tsx`         | Fachansicht | Objekt-Kacheln einer Picker-Gruppe aus der Registry            | ObjectPicker          | bleibt    | –    | Galerie, kein Editor                         |
| PreviewContainer      | `dashboardStyle/StyleGallery.tsx`  | Fachansicht | ein Container der Stil-Vorschau mit den echten Ebenen          | PreviewContainer      | bleibt    | –    | Teil von `StyleGallery`                      |
| StyleGallery          | `dashboardStyle/StyleGallery.tsx`  | ?           | Galerie der Dashboard-Stile in der Gruppe Style                | StyleGallery          | unklar    | –    | siehe unten                                  |
| StylePreview          | `dashboardStyle/StyleGallery.tsx`  | Fachansicht | Mini-Dashboard eines Stils, live aus dem Rezept                | StylePreview          | bleibt    | –    | Teil von `StyleGallery`                      |
| SurfaceBorder         | `shared/ui/SurfaceBorder.tsx`      | Fachansicht | Rand eines Containers als SVG                                  | SurfaceBorder         | bleibt    | –    | Darstellung einer Fläche; Ordner siehe unten |
| SurfaceLayers         | `shared/ui/SurfaceLayers.tsx`      | Fachansicht | Ebenen eines Containers um seinen Inhalt                       | SurfaceLayers         | bleibt    | –    | Darstellung einer Fläche; Ordner siehe unten |
| TopBar                | `app/TopBar.tsx`                   | Fachansicht | Leiste über dem Workspace                                      | TopBar                | bleibt    | –    | außerhalb der Panel-Ebenen                   |

## Ausnahme

| Komponente (heute) | Datei                        | Ebene    | Zweck (ein Satz)                               | Ziel         | Status | Teil | Grund             |
| ------------------ | ---------------------------- | -------- | ---------------------------------------------- | ------------ | ------ | ---- | ----------------- |
| EditableText       | `shared/ui/EditableText.tsx` | Ausnahme | Text, der per Doppelklick zum Eingabefeld wird | EditableText | bleibt | –    | Ausnahme laut §21 |

## Ohne Ebene

| Komponente (heute)     | Datei                             | Ebene | Zweck (ein Satz)                                            | Ziel | Status | Teil | Grund       |
| ---------------------- | --------------------------------- | ----- | ----------------------------------------------------------- | ---- | ------ | ---- | ----------- |
| DateRangeFilterForm    | `table/DataTableFilterEditor.tsx` | ?     | Zeitraum als Bereich mit zwei Griffen im Tabellenfilter     | ?    | unklar | –    | siehe unten |
| EmptyState             | `shared/ui/EmptyState.tsx`        | ?     | Hinweis mit Icon und Text, wenn eine Ansicht leer ist       | ?    | unklar | –    | siehe unten |
| MeasureRangeFilterForm | `table/DataTableFilterEditor.tsx` | ?     | Zahlenbereich mit zwei Griffen im Tabellenfilter            | ?    | unklar | –    | siehe unten |
| StepRange              | `table/DataTableFilterEditor.tsx` | ?     | Bereich über feste Schritte oder Hinweis bei nur einem Wert | ?    | unklar | –    | siehe unten |
| ValuesFilterForm       | `table/DataTableFilterEditor.tsx` | ?     | Auswahl einzelner Werte mit Suche im Tabellenfilter         | ?    | unklar | –    | siehe unten |

## Unklar

Je Eintrag die offene Frage; wir klären sie gemeinsam.

1. **ColorSwatch:** Bleibt der Swatch mit Farbwähler ein eigenes Control,
   oder geht er in Teil 5 bzw. 6 auf, als `SwatchButton` (Primitive) plus
   `PaintControl` mit nur Solid?
2. **GradientControl:** Bleibt es das Control für den Verlauf der
   Farbskala, oder geht es in Teil 6 in der Zeile „Data color“ auf?
3. **Filterformulare** (`DateRangeFilterForm`, `MeasureRangeFilterForm`,
   `ValuesFilterForm`, `StepRange`): Sind sie Groups des Filter-Editors
   (z. B. `DateRangeFilterGroup`) oder Controls? Gehört `StepRange` in
   `RangeControl`?
4. **CommandButton:** Wird es in Teil 5 eine dünne Variante von `IconButton`
   bzw. `Button`, oder bleibt es eine eigene Komponente in `app/`?
5. **InlineTextInput:** Wird es in Teil 5 eine Variante von `Input` (Übernahme
   bei Enter und Außenklick), oder bleibt es ein eigenes Primitive?
6. **Chip:** Ein Button in Pillenform (noch mit `forwardRef`, das in
   React 19 entfallen kann). Ordner `primitives/` steht fest; wird er in
   Teil 5 eine Art von `Button`, oder bleibt er ein eigenes Primitive?
7. **EmptyState:** Welche Ebene? Der geplante Ordner `feedback/` hat in
   §21 keine Ebene.
8. **StyleGallery:** Control (wählt einen Stil für das Dashboard) oder
   Fachansicht (Galerie wie `ObjectPicker`)?
9. **DataPanel:** Bleibt es in `datasets/` oder zieht es nach
   `app/data/` (Inventur §5), und in welchem Teil?
10. **SurfaceLayers, SurfaceBorder, MiniHistogram:** Fachansichten, die in
    `shared/ui/` liegen. In welchen Ordner kommen sie beim Einsortieren
    nach Ebene?
