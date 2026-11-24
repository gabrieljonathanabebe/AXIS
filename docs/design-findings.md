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

Vorschlag: Zeilen ohne Icon lassen die leere Icon-Spalte weg, je Gruppe
entschieden. · Aufwand: S · Wo lösen: `Row.css` · Stand: verworfen.
Umgesetzt und wieder zurückgenommen: Spalten, die je Gruppe an anderer
Stelle beginnen, bleiben unruhig, auch wenn die oberste Gruppe
entscheidet. Ersetzt durch O6.

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
Aufwand: S · Wo lösen: `GradientStopRow` über `Row` · Stand: verschoben
(Teil 6, Paint wird dort ohnehin umgebaut)

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
Aufwand: S · Wo lösen: `FieldList.css`, `tokens.css` · Stand: erledigt
(Teil 4)

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
Aufwand: M · Wo lösen: neue `TitleGroup` · Stand: offen (Teil 10 oder
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

### O6 Festes Raster für jede Row

Ort: `shared/ui/Row`, alle Zeilen im Format-Panel und in Editoren

Vorher (nach O1):

```text
LAYOUT
[ W 12          ] [ H 14          ]
TEXT
[ 13 px    ] [ A A A    ]  I
FORMAT
[ Auto                         ▾ ]
```

Nachher:

```text
LAYOUT
[ W 12     ] [ H 14     ]  ·
TEXT
[ 13 px    ] [ A A A    ]  I
FORMAT
[ Auto                 ▾ ]  ·
```

Vorschlag: Jede Row hat immer dieselben drei Spalten `1fr 1fr 24px`, die
Aktionsspalte bleibt auch leer reserviert, wie in Figma. Arten vorerst:
Paar, Einzeln (Spalte 1), Breit (Spalte 1 und 2, nie über die
Aktionsspalte). Untergruppen ändern das Raster nicht. Provisorium bis
zum Design-Slice. · Aufwand: S · Wo lösen: `Row.css` · Stand: erledigt
(Teil 4)

### O7 In der Aktionsspalte nur Aktionen

Ort: Aktionsspalte jeder Row, heute der Kursiv-Schalter in jeder Gruppe
„Text“ (`TextStyleControls`)

Vorher:

```text
TEXT
[ 13 px    ] [ A A A    ]  I     ← I ist ein Wert, keine Aktion
[ ● EEF4FF ]               ·
```

Nachher:

```text
TEXT
[ 13 px    ] [ Inter     ▾ ]  ·
[ Bold Italic ▾ ][ ● EEF4FF ]  ·
```

Vorschlag: In der Aktionsspalte stehen nur Aktionen (Auge, ＋, −,
Zahnrad), nie Werte; der Kursiv-Schalter geht mit dem Schriftgewicht in
einem Auswahlfeld „Schnitt“ auf (Teil 5). · Aufwand: M · Wo lösen:
`TextStyleControls`, Regel in `DESIGN_SYSTEM.md` · Stand: offen (Teil 5)

### O8 Controls füllen ihre Zelle in gleicher Höhe und mit gleichem Rahmen

Ort: alle Controls in Rows, aufgefallen bei Format (`Auto` neben
`1,200 | 1.2K`)

Vorher:

```text
[⇥ Auto     ]  (1,200|1.2K)      ← Segmente schmaler, anderer Rahmen
```

Nachher:

```text
[⇥ Auto     ] [1,200 | 1.2K]  ·  ← beide füllen ihre Zelle
```

Vorschlag: Alle Controls haben dieselbe Höhe und denselben Rahmen
(`.control-frame`) und füllen ihre Zelle, auch `SegmentedControl`. ·
Aufwand: S · Wo lösen: `.control-frame`, `SegmentedControl.css` · Stand:
offen (Design-Slice)

### O9 Zeilen der Gruppe „Format“ neu ordnen

Ort: `shared/ui/NumberFormatControls`, Gruppe „Format“ (Labels, Tooltip,
Achsen, Card)

Vorher:

```text
FORMAT
[ Number                 ▾ ]  ·
[⇥ Auto    ] [1,200 | 1.2K]  ·
[⌶ $1.2K                 ]  ·
```

Nachher (Richtung, im Design-Slice festlegen):

```text
FORMAT
[ Number   ▾ ] [ 1.2K     ▾ ]  ·
[⇥ 2         ] [⌶ $ … €     ]  ·
```

Vorschlag: Format, Nachkommastellen, Notation und Vorschau als Ganzes
neu ordnen, sodass jede Zeile ein Paar ist und die Vorschau nicht eine
eigene Zeile braucht. · Aufwand: M · Wo lösen: `NumberFormatControls` ·
Stand: verschoben (Design-Slice)
