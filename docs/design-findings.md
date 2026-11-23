# Optik-Funde

Kleine Auffälligkeiten in der Oberfläche, die beim Arbeiten auffallen:
Stellen, die anders aussehen als gleichartige Stellen, unruhige Abstände
oder Ausrichtung, ungenutzter Platz, unklare Darstellung. Kleine Funde
werden in der Optik-Runde am Ende eines Teils erledigt (je Fix ein
Commit mit geprüften Differenzbildern), größere sind Eingabe für den
Slice „Design-Richtlinien und Optik-Audit“. Bevorzugt in einer Basis
lösen (`Row`, `Group`, `.control-frame`) statt an einer einzelnen Stelle.

Stand je Fund: offen · erledigt (Commit) · verschoben (Slice).

### O1 Row ohne Aktion nutzt die volle Breite

Ort: `shared/ui/Row`, alle Gruppen mit Zeilen ohne Icon

Vorher:

```text
[ Decimals  ] [ Notation  ]  ·
[ Prefix               ]     ·
```

Nachher:

```text
[ Decimals     ] [ Notation    ]
[ Prefix                       ]
```

Vorschlag: In einer Gruppe (oder einem Editor), deren Zeilen kein Minus,
Zahnrad oder Aktion haben, lassen alle Zeilen die leere Icon-Spalte weg;
hat eine Zeile ein Icon, behalten alle die Spalte, damit die Felder der
Gruppe fluchten (heute nur Text-Gruppen mit dem Kursiv-Icon und die
Gruppe Line mit dem Zahnrad; beide fallen mittelfristig weg). `isFull`
entfällt. · Aufwand: S · Wo lösen: `Row.css` · Stand: offen (4a)

### O2 Stopp-Zeile auf dem Raster der Row

Ort: `shared/ui/GradientStopRow`, Gruppe „Stops“ im `PaintEditor`

Vorher:

```text
■ [↔ 0 %     ] [◐ 100 %    ] −
■ [↔ 100 %   ] [◐ 100 %    ] −
```

Nachher:

```text
[■ 0 %       ] [◐ 100 %    ]  −
[■ 100 %     ] [◐ 100 %    ]  −
```

Vorschlag: Der Swatch rückt an die Stelle des Icons im Positionsfeld;
die Zeile ist eine `pair`-Row mit Minus in der Icon-Spalte und fluchtet
mit der Fill-Zeile; das eigene Raster `.gradient-stop` entfällt. ·
Aufwand: S · Wo lösen: `GradientStopRow` über `Row` · Stand: offen (4a)

### O3 Hinweis „No matching fields“ eingerückt

Ort: `datasets/FieldList`, Build Panel, Gruppe „Fields“ bei leerer Suche

Vorher:

```text
[🔍 xyz              ]
    No matching fields
```

Nachher:

```text
[🔍 xyz              ]
No matching fields
```

Vorschlag: Die Einrückung stammt aus der Zeit der verschachtelten
Sections; seit Section → Group stehen die Feldgruppen bündig, der
Hinweis auch; danach wird `--indent-nested` nicht mehr genutzt. ·
Aufwand: S · Wo lösen: `FieldList.css`, `tokens.css` · Stand: offen
(4a)

### O4 Titel von Achse und Objekt verschieden aufgebaut

Ort: `charts/format/AxisTitleGroup`, `objects/ObjectTitleWidget`

Vorher:

```text
Achse:                    Objekt:
TITLE              👁     CONTENT
[ Automatic         ]     [ Automatic         ]
[ 12 ][ Bold ]            TEXT
                          [ 14 ][ Bold ] [≡]
```

Nachher:

```text
beide:
TITLE              👁
[ Automatic         ]
[ 12 ][ Bold ]   (Ausrichtung nur beim Objekt)
```

Vorschlag: Eine gemeinsame `TitleGroup` mit optionaler Ausrichtung und
Schriftgrenzen; das Auge des Objekttitels bleibt im Panel-Kopf. ·
Aufwand: M · Wo lösen: neue `TitleGroup` · Stand: offen (Teil 8 oder
Design-Slice)

### O5 Filter-Popover breiter als die Editoren

Ort: `table/DataTable.css` (`.data-filter-popover`)

Vorher:

```text
Editor:  |<-- 250 px -->|
Filter:  |<--- 260 px --->|
```

Nachher:

```text
Editor:  |<-- 250 px -->|
Filter:  |<-- 250 px -->|
```

Vorschlag: Der Filter nutzt die Breite und den Innenabstand der
Editor-Fläche (`variant="editor"` ohne die Platzierung links) statt
eigener Werte. · Aufwand: S · Wo lösen: `Popover.css` · Stand: offen
(Design-Slice)
