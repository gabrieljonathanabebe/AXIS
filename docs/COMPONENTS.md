# Komponentenregister

Alle React-Komponenten in `frontend/src` (ohne Hooks und reine
Funktionen), geordnet nach Ebene laut `DEVELOPMENT.md` §21, darin
alphabetisch. Pfade relativ zu `frontend/src/`.

- **Ebene:** Container, Groups, Group, Rows, Row, Control, Primitive,
  Tile, Fachansicht oder Ausnahme (§21)
- **Status:** bleibt · umbenannt · geht auf in … · aufgeteilt in … ·
  entfällt · unklar
- **Teil:** Teil des Refactoring-Slices (`ROADMAP.md` 3.14), in dem sich
  die Zeile ändert, oder –
- **Pflege:** Jeder Block, der Komponenten anlegt, umbenennt, verschiebt
  oder entfernt, aktualisiert die betroffenen Zeilen im selben Commit. Am
  Ende des Slices ist keine Zeile mehr „unklar“; dann entfallen Status,
  Teil und Grund, und die Datei bleibt als Katalog.

## Container

| Komponente (heute)   | Datei                                | Ebene     | Zweck (ein Satz)                                                                         | Ziel                  | Status    | Teil | Grund                                                 |
| -------------------- | ------------------------------------ | --------- | ---------------------------------------------------------------------------------------- | --------------------- | --------- | ---- | ----------------------------------------------------- |
| BuildPanel           | `workspace/BuildPanel.tsx`           | Container | Build Panel links mit Objekten, Dataset, Feldern und Chartdaten als einklappbare Gruppen | BuildPanel            | bleibt    | –    | Name passt zur Grammatik                              |
| CanvasPanel          | `workspace/CanvasPanel.tsx`          | Container | Arbeitsfläche des Visualize-Workspace mit Objektraster und Befehlen                      | CanvasPanel           | bleibt    | –    | Name passt zur Grammatik                              |
| CardFormatPanel      | `cards/CardFormatPanel.tsx`          | Container | Format-Panel einer Card, wählt die Gruppen je Element                                    | CardFormatPanel       | bleibt    | –    | Name passt zur Grammatik                              |
| ChartFormatPanel     | `charts/format/ChartFormatPanel.tsx` | Container | Format-Panel eines Charts, wählt die Gruppen je Element                                  | ChartFormatPanel      | bleibt    | –    | Name passt zur Grammatik                              |
| ColorPicker          | `shared/ui/ColorPicker.tsx`          | Container | Inhalt des Farb-Popovers mit Presets, Farbfläche, Hue-Regler und Hex-Wert                | ColorEditor           | umbenannt | 4a   | Inhalt eines Popovers ist ein Editor                  |
| DashboardFormatPanel | `workspace/DashboardFormatPanel.tsx` | Container | Format-Panel ohne Auswahl mit Style, Layout, Hintergrund und Animation                   | DashboardFormatPanel  | bleibt    | –    | Name passt zur Grammatik                              |
| DataPanel            | `datasets/DataPanel.tsx`             | Container | Data-Workspace, schaltet zwischen Profil und Tabelle                                     | DataPanel             | unklar    | –    | Ort offen, siehe unten                                |
| DataTableFilterForm  | `table/DataTableFilterForm.tsx`      | Container | Inhalt des Filter-Popovers einer Spalte, ein Formular je Rolle                           | DataTableFilterEditor | umbenannt | 4a   | Inhalt eines Popovers ist ein Editor                  |
| Editor               | `shared/ui/Editor.tsx`               | Container | Basis: Inhalt eines Popovers mit Abstand, optionalem Kopf und neuer Gruppenebene         | Editor                | bleibt    | –    | Basis                                                 |
| EffectEditor         | `shared/ui/EffectEditor.tsx`         | Container | Art und Werte eines Effekts                                                              | EffectEditor          | bleibt    | –    | Name passt zur Grammatik                              |
| FormatPanel          | `shared/ui/FormatPanel.tsx`          | Container | Basis der Format-Panels mit Elementauswahl, Auge, Fokus und Scrollen                     | FormatPanel           | bleibt    | –    | Basis                                                 |
| PaintEditor          | `shared/ui/PaintEditor.tsx`          | Container | Typ, Farbe, Winkel bzw. Form und Stopps einer Paint                                      | PaintEditor           | bleibt    | 4c   | Struktur bleibt, Fade und Serienfarbe entfallen in 4c |
| Panel                | `shared/ui/Panel.tsx`                | Container | Basis: Bereich mit Kopf, Aktionen und Einklappen                                         | Panel                 | bleibt    | –    | Basis                                                 |

## Groups

| Komponente (heute) | Datei                                | Ebene  | Zweck (ein Satz)                                                         | Ziel              | Status    | Teil | Grund                                              |
| ------------------ | ------------------------------------ | ------ | ------------------------------------------------------------------------ | ----------------- | --------- | ---- | -------------------------------------------------- |
| CardValueWidget    | `cards/CardValueWidget.tsx`          | Groups | Gruppen des Card-Werts: Function, Text und Format                        | CardValueGroups   | umbenannt | 4a   | legt Gruppen und Reihenfolge fest                  |
| ColorScaleWidget   | `charts/format/ColorScaleWidget.tsx` | Groups | Gruppen der Farbskala: Position, Layout, Fläche, Titel, Labels und Ticks | ColorScaleGroups  | umbenannt | 4a   | legt Gruppen und Reihenfolge fest                  |
| ContainerWidget    | `objects/ContainerWidget.tsx`        | Groups | Gruppen eines Containers: Position, Layout, dann die Fläche              | ContainerGroups   | umbenannt | 4a   | legt Gruppen und Reihenfolge fest                  |
| LegendWidget       | `charts/format/LegendWidget.tsx`     | Groups | Gruppen der Legende: Position, Layout, Fläche und Text                   | LegendGroups      | umbenannt | 4a   | legt Gruppen und Reihenfolge fest                  |
| ObjectTitleWidget  | `objects/ObjectTitleWidget.tsx`      | Groups | Gruppen eines Objekttitels: Content und Text                             | ObjectTitleGroups | umbenannt | 4a   | legt Gruppen fest; O4 prüft eine gemeinsame Gruppe |
| ShadowControls     | `shared/ui/ShadowControls.tsx`       | Groups | Gruppen eines Schattens im Editor: Offset, Blur und Farbe                | ShadowGroups      | umbenannt | 4a   | liefert Gruppen, keine Zeilen                      |
| SurfaceControls    | `shared/ui/SurfaceControls.tsx`      | Groups | Gruppen einer Fläche: Shape, Background, Border und Effects              | SurfaceGroups     | umbenannt | 4a   | gemeinsame Folge für Container, Legende, Tooltip   |

## Group

| Komponente (heute)      | Datei                                       | Ebene | Zweck (ein Satz)                                                     | Ziel                   | Status    | Teil | Grund                              |
| ----------------------- | ------------------------------------------- | ----- | -------------------------------------------------------------------- | ---------------------- | --------- | ---- | ---------------------------------- |
| AggregationWidget       | `charts/data/AggregationWidget.tsx`         | Group | Gruppe ohne Titel mit Wert- und Farbfunktion der Chartdaten          | AggregationGroup       | umbenannt | 4a   | rendert genau eine Gruppe          |
| AnimationWidget         | `workspace/AnimationWidget.tsx`             | Group | Animation des Dashboards, Plus oder Easing und Dauer                 | AnimationGroup         | umbenannt | 4a   | rendert genau eine Gruppe          |
| AxisLabelsGroup         | `charts/format/AxisLabelsGroup.tsx`         | Group | Labels einer Achse oder der Farbskala mit Untergruppen               | AxisLabelsGroup        | bleibt    | –    | Name passt zur Grammatik           |
| AxisTitleGroup          | `charts/format/AxisTitleGroup.tsx`          | Group | Titel einer Achse oder der Farbskala mit Auge                        | AxisTitleGroup         | bleibt    | –    | Name passt; O4 prüft Zusammenlegen |
| BackgroundGroup         | `shared/ui/BackgroundGroup.tsx`             | Group | Hintergrund einer Fläche als Fill-Liste mit Plus und Minus           | BackgroundGroup        | bleibt    | –    | Name passt zur Grammatik           |
| CardSelectionGroup      | `cards/CardSelectionGroup.tsx`              | Group | Label der Auswahl unter dem Card-Wert mit Auge                       | CardSelectionGroup     | bleibt    | –    | Name passt zur Grammatik           |
| EffectsGroup            | `shared/ui/EffectsGroup.tsx`                | Group | Effekte einer Mark oder Fläche mit Plus                              | EffectsGroup           | bleibt    | –    | Name passt zur Grammatik           |
| EncodingsWidget         | `charts/data/EncodingsWidget.tsx`           | Group | Gruppe ohne Titel mit Charttyp, Encodings, Zeitraster und Sortierung | EncodingsGroup         | umbenannt | 4a   | rendert genau eine Gruppe          |
| Group                   | `shared/ui/Group.tsx`                       | Group | Basis: Titel, Auge, Plus, Einklappen und Untergruppe per Context     | Group                  | bleibt    | –    | Basis                              |
| LabelsWidget            | `charts/format/LabelsWidget.tsx`            | Group | Data Labels der Marks mit Auge und Untergruppen                      | LabelsGroup            | umbenannt | 4a   | rendert genau eine Gruppe          |
| LegendInteractionWidget | `charts/format/LegendInteractionWidget.tsx` | Group | Auswahlmodus der Legende                                             | LegendInteractionGroup | umbenannt | 4a   | rendert genau eine Gruppe          |
| StrokeWidget            | `shared/ui/StrokeWidget.tsx`                | Group | eine Kontur mit Auge, z. B. Border oder Gridlines                    | StrokeGroup            | umbenannt | 4a   | rendert genau eine Gruppe          |
| TooltipWidget           | `charts/format/TooltipWidget.tsx`           | Group | Tooltip der Marks mit Auge und Untergruppen                          | TooltipGroup           | umbenannt | 4a   | rendert genau eine Gruppe          |
| ZoomWidget              | `charts/format/ZoomWidget.tsx`              | Group | Zoom der X-Achse                                                     | ZoomGroup              | umbenannt | 4a   | rendert genau eine Gruppe          |

## Rows

| Komponente (heute)   | Datei                                | Ebene | Zweck (ein Satz)                                                         | Ziel             | Status    | Teil | Grund                                                    |
| -------------------- | ------------------------------------ | ----- | ------------------------------------------------------------------------ | ---------------- | --------- | ---- | -------------------------------------------------------- |
| LayoutControls       | `shared/ui/LayoutControls.tsx`       | Rows  | Zeilen der Layout-Gruppe: Größe, Abstand und Anordnung                   | LayoutRows       | umbenannt | 4a   | entscheidet Auswahl und Reihenfolge der Zeilen           |
| NumberFormatControls | `shared/ui/NumberFormatControls.tsx` | Rows  | Zeilen eines Zahlenformats: Format, Nachkommastellen, Notation, Vorschau | NumberFormatRows | umbenannt | 4a   | entscheidet Auswahl der Zeilen; O9 ordnet sie später neu |
| PositionControls     | `shared/ui/PositionControls.tsx`     | Rows  | Zeilen der Position-Gruppe: Koordinaten, Platz oder Auswahl              | PositionRows     | umbenannt | 4a   | entscheidet Auswahl der Zeilen                           |
| StrokeStyleControls  | `shared/ui/StrokeStyleControls.tsx`  | Rows  | Zeilen einer Kontur: Paint, Breite und Linienstil                        | StrokeStyleRows  | umbenannt | 4a   | kapselt ein Bündel an mehreren Stellen                   |
| TextStyleControls    | `shared/ui/TextStyleControls.tsx`    | Rows  | Zeilen eines Textes: Größe, Gewicht, Kursiv, Farbe und Ausrichtung       | TextStyleRows    | umbenannt | 4a   | kapselt ein Bündel; Gewicht und Kursiv ändern sich in 4b |

## Row

| Komponente (heute) | Datei                                | Ebene | Zweck (ein Satz)                                                 | Ziel            | Status    | Teil | Grund                                    |
| ------------------ | ------------------------------------ | ----- | ---------------------------------------------------------------- | --------------- | --------- | ---- | ---------------------------------------- |
| BoxFieldsRow       | `shared/ui/BoxFieldsRow.tsx`         | Row   | eine Zeile mit Koordinaten oder Maßen eines Kastens              | BoxRow          | umbenannt | 4a   | „Field“ meint nur Datenfelder            |
| DateFormatSelect   | `charts/format/DateFormatSelect.tsx` | Row   | breite Zeile mit dem Datumsformat                                | DateFormatRow   | umbenannt | 4a   | ist eine Zeile, kein eigenes Control     |
| EffectRow          | `shared/ui/EffectRow.tsx`            | Row   | ein Effekt als Control mit Art, das den Editor öffnet, und Minus | EffectRow       | bleibt    | –    | Name passt zur Grammatik                 |
| GradientStopRow    | `shared/ui/GradientStopRow.tsx`      | Row   | ein Verlaufsstopp mit Farbe, Position, Deckkraft und Minus       | GradientStopRow | bleibt    | 4c   | eigenes Raster, O2 bringt es auf die Row |
| PaintRow           | `shared/ui/PaintRow.tsx`             | Row   | Paint und Deckkraft einer Fläche oder Kontur                     | PaintRow        | bleibt    | 4c   | wird in 4c überall die Zeile einer Paint |
| Row                | `shared/ui/Row.tsx`                  | Row   | Basis: festes Raster `1fr 1fr 24px` mit Aktionsspalte            | Row             | bleibt    | –    | Basis                                    |

## Control

| Komponente (heute)     | Datei                               | Ebene   | Zweck (ein Satz)                                            | Ziel                      | Status                       | Teil | Grund                                          |
| ---------------------- | ----------------------------------- | ------- | ----------------------------------------------------------- | ------------------------- | ---------------------------- | ---- | ---------------------------------------------- |
| AlignmentControl       | `shared/ui/AlignmentControl.tsx`    | Control | Anfang, Mitte oder Ende als Icon-Gruppe                     | SegmentedControl          | geht auf in SegmentedControl | 4b   | gleiches Verhalten, nur andere Optionen        |
| CheckList              | `table/CheckList.tsx`               | Control | Werteliste mit Häkchen im Tabellenfilter                    | CheckList                 | bleibt                       | –    | eigenes Verhalten (Mehrfachauswahl)            |
| ColorControl           | `shared/ui/ColorControl.tsx`        | Control | Swatch mit Hex-Wert oder Presetname einer Farbe             | PaintControl              | geht auf in PaintControl     | 4c   | `PaintControl` mit nur Solid                   |
| ColorSwatch            | `shared/ui/ColorSwatch.tsx`         | Control | Swatch, der den Farbwähler öffnet                           | ?                         | unklar                       | –    | siehe unten                                    |
| DataTableFilterPopover | `table/DataTableFilterPopover.tsx`  | Control | Filter-Knopf im Spaltenkopf mit Popover und Zurücksetzen    | DataTableFilterControl    | umbenannt                    | 4a   | setzt Auslöser, Popover und Editor zusammen    |
| DetailsControl         | `shared/ui/DetailsControl.tsx`      | Control | Icon und Kurztext, öffnet Details in einem Editor           | DetailsControl            | bleibt                       | –    | Name beschlossen                               |
| FontWeightControl      | `shared/ui/FontWeightControl.tsx`   | Control | Schriftgewicht als Segmente                                 | SelectControl („Schnitt“) | geht auf in SelectControl    | 4b   | mit Kursiv ein Auswahlfeld „Schnitt“           |
| GradientControl        | `charts/format/GradientControl.tsx` | Control | Verlauf der Farbskala mit zwei Enden                        | ?                         | unklar                       | 4c   | siehe unten                                    |
| PaintControl           | `shared/ui/PaintControl.tsx`        | Control | Swatch einer Paint mit Hex-Wert bzw. Typ, öffnet den Editor | PaintControl              | bleibt                       | 4c   | nimmt in 4c `ColorControl` auf                 |
| PaletteControl         | `charts/format/PaletteControl.tsx`  | Control | Palette der kategorialen Farben in einem Menü               | SelectControl             | geht auf in SelectControl    | 4b   | gleiches Verhalten, nur andere Optionen        |
| PositionGrid           | `shared/ui/PositionGrid.tsx`        | Control | 3×3-Raster für die Lage eines Elements um den Plot          | SegmentedControl          | geht auf in SegmentedControl | 4b   | gleiches Verhalten, nur andere Optionen        |
| RangeSlider            | `table/RangeSlider.tsx`             | Control | Bereich mit zwei Griffen auf einer Spur                     | RangeControl              | umbenannt                    | 4a   | eigenes Verhalten, Name nach Grammatik         |
| RotationDial           | `shared/ui/RotationDial.tsx`        | Control | Winkel einer Drehung oder Richtung                          | NumberControl             | geht auf in NumberControl    | 4b   | Winkel ist eine Zahl mit Einheit °             |
| ScrubbableNumber       | `shared/ui/ScrubbableNumber.tsx`    | Control | Zahl per Ziehen, Tippen oder Pfeiltasten, optional Auto     | NumberControl             | geht auf in NumberControl    | 4b   | aus Button und `NumberInput`, mit Prozentmodus |
| SegmentedControl       | `shared/ui/SegmentedControl.tsx`    | Control | eine Auswahl aus Segmenten                                  | SegmentedControl          | bleibt                       | 4b   | nimmt Ausrichtung und Position auf             |
| SelectControl          | `shared/ui/SelectControl.tsx`       | Control | eine Auswahl aus einem Menü                                 | SelectControl             | bleibt                       | 4b   | nimmt Palette, Datumsformat und Schnitt auf    |

## Primitive

| Komponente (heute) | Datei                           | Ebene     | Zweck (ein Satz)                                                  | Ziel                | Status             | Teil | Grund                                                   |
| ------------------ | ------------------------------- | --------- | ----------------------------------------------------------------- | ------------------- | ------------------ | ---- | ------------------------------------------------------- |
| Button             | `shared/ui/Button.tsx`          | Primitive | Basis: Button mit Pillen-Fläche                                   | Button              | bleibt             | 4b   | bekommt Arten (Text, Icon, Kachel, Swatch, ohne Fläche) |
| Chip               | `shared/ui/Chip.tsx`            | Primitive | Pille als Button, z. B. ein Datenfeld oder ein aktiver Filter     | Chip                | unklar             | 4b   | siehe unten                                             |
| CommandButton      | `app/CommandButton.tsx`         | Primitive | Icon-Button eines Befehls, gedrückt solange der Befehl aktiv ist  | ?                   | unklar             | 4b   | siehe unten                                             |
| IconBadge          | `shared/ui/IconBadge.tsx`       | Primitive | Icon mit optionalem Label, z. B. im Kopf eines Panels             | IconBadge           | bleibt             | –    | kleinster Anzeige-Baustein                              |
| IconButton         | `shared/ui/IconButton.tsx`      | Primitive | Button nur mit Icon, benannt für Screenreader und Tooltip         | IconButton          | bleibt             | 4b   | wird dünne Variante von `Button`                        |
| InlineTextInput    | `shared/ui/InlineTextInput.tsx` | Primitive | Text an Ort und Stelle ändern, Enter übernimmt, Escape bricht ab  | ?                   | unklar             | 4b   | siehe unten                                             |
| NumberInput        | `shared/ui/NumberInput.tsx`     | Primitive | natives Zahlenfeld mit Entwurf bis Enter oder Blur und Begrenzung | NumberInput         | bleibt             | 4b   | wird Eingabeteil von `NumberControl`                    |
| OptionContent      | `shared/ui/OptionContent.tsx`   | Primitive | Icon und Label einer Option in Menüs, Auswahlen und Segmenten     | OptionContent       | bleibt             | –    | kleinster Anzeige-Baustein                              |
| OptionsMenu        | `shared/ui/OptionsMenu.tsx`     | Primitive | Liste von Optionen in einem Menü                                  | Menu                | umbenannt          | 4b   | Variante von `Popover` laut §21                         |
| Popover            | `shared/ui/Popover.tsx`         | Primitive | Basis: Auslöser, Aufklappen und Fläche, Variante `editor`         | Popover             | bleibt             | –    | Basis                                                   |
| PopoverNode        | `shared/ui/Popover.tsx`         | Primitive | interner Knoten eines Popovers im Popover-Baum                    | PopoverNode         | bleibt             | –    | interner Teil von `Popover`                             |
| TextInput          | `shared/ui/TextInput.tsx`       | Primitive | natives Textfeld, optional mit Icon                               | TextInput           | bleibt             | 4b   | wird Variante von `Input`                               |
| WidgetButton       | `shared/ui/WidgetButton.tsx`    | Primitive | Kachel als Button, z. B. ein Charttyp im Picker                   | Button (Kachel-Art) | geht auf in Button | 4b   | Kachel-Optik als Art von `Button`                       |

## Tile

| Komponente (heute)    | Datei                             | Ebene | Zweck (ein Satz)                                                 | Ziel                | Status    | Teil | Grund                             |
| --------------------- | --------------------------------- | ----- | ---------------------------------------------------------------- | ------------------- | --------- | ---- | --------------------------------- |
| DatasetCard           | `datasets/DatasetCard.tsx`        | Tile  | Kachel des Datasets mit Upload                                   | DatasetTile         | umbenannt | 4a   | „Card“ ist ein Objekttyp          |
| DraggableObjectOption | `objects/ObjectPicker.tsx`        | Tile  | Kachel eines Objekts im Picker, Klick fügt hinzu, Ziehen legt ab | ObjectOptionTile    | umbenannt | 4a   | ist eine Kachel                   |
| FieldProfileWidget    | `datasets/FieldProfileWidget.tsx` | Tile  | Profilkachel eines Datenfelds                                    | FieldProfileTile    | umbenannt | 4a   | ist eine Kachel                   |
| ObjectOptionContent   | `objects/ObjectPicker.tsx`        | Tile  | Icon und Name einer Objekt-Option, auch beim Ziehen              | ObjectOptionContent | bleibt    | –    | Inhalt der Kachel, auch im Ziehen |
| StatWidget            | `datasets/StatWidget.tsx`         | Tile  | Kachel einer Kennzahl im Profil                                  | StatTile            | umbenannt | 4a   | ist eine Kachel                   |
| Tile                  | `shared/ui/Tile.tsx`              | Tile  | Basis: Kachel                                                    | Tile                | bleibt    | –    | Basis                             |

## Fachansicht

| Komponente (heute)    | Datei                              | Ebene       | Zweck (ein Satz)                                               | Ziel                  | Status    | Teil | Grund                                        |
| --------------------- | ---------------------------------- | ----------- | -------------------------------------------------------------- | --------------------- | --------- | ---- | -------------------------------------------- |
| App                   | `app/App.tsx`                      | Fachansicht | App-Shell, setzt Workspaces, Panels und Befehle zusammen       | App                   | bleibt    | –    | außerhalb der Panel-Ebenen                   |
| AskCevynBar           | `ai/AskCevynBar.tsx`               | Fachansicht | Eingabeleiste von Ask Cevyn                                    | AskCevynBar           | bleibt    | –    | außerhalb der Panel-Ebenen                   |
| CardItem              | `cards/CardItem.tsx`               | Fachansicht | Inhalt einer Card im Objektrahmen                              | CardContent           | umbenannt | 6    | Inhalt im Rahmen, parallel zu `ChartContent` |
| ChartColorScale       | `charts/ChartColorScale.tsx`       | Fachansicht | Farbskala eines Charts als HTML neben dem Canvas               | ChartColorScale       | bleibt    | –    | Teil der Chart-Darstellung                   |
| ChartGrid             | `workspace/ChartGrid.tsx`          | Fachansicht | Raster aller Objekte auf der Arbeitsfläche                     | ObjectGrid            | umbenannt | 6    | enthält alle Objektarten, nicht nur Charts   |
| ChartItem             | `charts/ChartItem.tsx`             | Fachansicht | Inhalt eines Charts im Objektrahmen                            | ChartContent          | umbenannt | 6    | Namensraum vom ECharts-Builder trennen       |
| ChartLegend           | `charts/ChartLegend.tsx`           | Fachansicht | Legende eines Charts als HTML neben dem Canvas                 | ChartLegend           | bleibt    | –    | Teil der Chart-Darstellung                   |
| DataTable             | `table/DataTable.tsx`              | Fachansicht | virtualisierte Tabelle der Daten                               | DataTable             | bleibt    | –    | Ausnahme laut §21                            |
| DataTableColumnHeader | `table/DataTableColumnHeader.tsx`  | Fachansicht | Spaltenkopf mit Typ, Sortierung, Filter und Verteilung         | DataTableColumnHeader | bleibt    | –    | Teil der Tabelle                             |
| DataTableRow          | `table/DataTableRow.tsx`           | Fachansicht | eine Tabellenzeile mit Zeilennummer                            | DataTableRow          | bleibt    | –    | Tabellenzeile, keine Panel-Row               |
| DataTableToolbar      | `table/DataTableToolbar.tsx`       | Fachansicht | Leiste über der Tabelle mit Zeilenzahl, Filter-Chips und Reset | DataTableToolbar      | bleibt    | –    | Teil der Tabelle                             |
| DatasetProfileView    | `datasets/DatasetProfileView.tsx`  | Fachansicht | Profil des Datasets mit Kennzahlen und Feldern als Kacheln     | DatasetProfileView    | bleibt    | –    | Fachansicht im Data-Workspace                |
| DraggableFieldChip    | `datasets/FieldList.tsx`           | Fachansicht | ziehbarer Chip eines Datenfelds                                | DraggableFieldChip    | bleibt    | –    | „Field“ meint hier ein Datenfeld             |
| DragPreviewOverlay    | `workspace/DragPreviewOverlay.tsx` | Fachansicht | Vorschau unter dem Zeiger beim Ziehen                          | DragPreviewOverlay    | bleibt    | –    | Teil des Ziehens auf die Arbeitsfläche       |
| DropSlot              | `workspace/DropSlot.tsx`           | Fachansicht | Ablageziel für ein gezogenes Feld über einem Objekt            | DropSlot              | bleibt    | 6    | Ort `objects/` laut Inventur §5              |
| EChartCanvas          | `charts/EChartCanvas.tsx`          | Fachansicht | ECharts-Canvas eines Charts                                    | EChartCanvas          | bleibt    | –    | Teil der Chart-Darstellung                   |
| EncodingDropSlot      | `charts/EncodingDropSlots.tsx`     | Fachansicht | ein Ablageziel für ein Encoding                                | EncodingDropSlot      | bleibt    | 6    | wird entlang Rahmen, Inhalt, Slots getrennt  |
| EncodingDropSlots     | `charts/EncodingDropSlots.tsx`     | Fachansicht | Ablageziele aller Encodings, solange ein Feld gezogen wird     | EncodingDropSlots     | bleibt    | 6    | wird entlang Rahmen, Inhalt, Slots getrennt  |
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

| Komponente (heute)     | Datei                           | Ebene | Zweck (ein Satz)                                            | Ziel | Status | Teil | Grund       |
| ---------------------- | ------------------------------- | ----- | ----------------------------------------------------------- | ---- | ------ | ---- | ----------- |
| DateRangeFilterForm    | `table/DataTableFilterForm.tsx` | ?     | Zeitraum als Bereich mit zwei Griffen im Tabellenfilter     | ?    | unklar | –    | siehe unten |
| EmptyState             | `shared/ui/EmptyState.tsx`      | ?     | Hinweis mit Icon und Text, wenn eine Ansicht leer ist       | ?    | unklar | –    | siehe unten |
| MeasureRangeFilterForm | `table/DataTableFilterForm.tsx` | ?     | Zahlenbereich mit zwei Griffen im Tabellenfilter            | ?    | unklar | –    | siehe unten |
| StepRange              | `table/DataTableFilterForm.tsx` | ?     | Bereich über feste Schritte oder Hinweis bei nur einem Wert | ?    | unklar | –    | siehe unten |
| ValuesFilterForm       | `table/DataTableFilterForm.tsx` | ?     | Auswahl einzelner Werte mit Suche im Tabellenfilter         | ?    | unklar | –    | siehe unten |

## Unklar

Je Eintrag die offene Frage; wir klären sie gemeinsam.

1. **ColorSwatch:** Bleibt der Swatch mit Farbwähler ein eigenes Control,
   oder geht er in 4b/4c auf, als `SwatchButton` (Primitive) plus
   `PaintControl` mit nur Solid?
2. **GradientControl:** Bleibt es das Control für den Verlauf der
   Farbskala, oder geht es in 4c in der Zeile „Data color“ auf?
3. **Filterformulare** (`DateRangeFilterForm`, `MeasureRangeFilterForm`,
   `ValuesFilterForm`, `StepRange`): Sind sie Rows des Filter-Editors
   (z. B. `DateRangeFilterRows`) oder Controls? Gehört `StepRange` in
   `RangeControl`?
4. **CommandButton:** Wird es in 4b eine dünne Variante von `IconButton`
   bzw. `Button`, oder bleibt es eine eigene Komponente in `app/`?
5. **InlineTextInput:** Wird es in 4b eine Variante von `Input` (Übernahme
   bei Enter und Außenklick), oder bleibt es ein eigenes Primitive?
6. **Chip:** Ein Button in Pillenform (noch mit `forwardRef`, das in
   React 19 entfallen kann). Ordner `primitives/` steht fest; wird er in
   4b eine Art von `Button`, oder bleibt er ein eigenes Primitive?
7. **EmptyState:** Welche Ebene? Der geplante Ordner `feedback/` hat in
   §21 keine Ebene.
8. **StyleGallery:** Control (wählt einen Stil für das Dashboard) oder
   Fachansicht (Galerie wie `ObjectPicker`)?
9. **DataPanel:** Bleibt es in `datasets/` oder zieht es nach
   `app/data/` (Inventur §5), und in welchem Teil?
10. **SurfaceLayers, SurfaceBorder, MiniHistogram:** Fachansichten, die in
    `shared/ui/` liegen. In welchen Ordner kommen sie beim Einsortieren
    nach Ebene?
