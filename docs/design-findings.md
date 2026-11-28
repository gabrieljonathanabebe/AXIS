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

Ort: `charts/format/AxisTitleGroup`, `objects/TitleElement`

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

Vorschlag: Eine gemeinsame `TitleGroup` in `shared/ui/groups/`, Variante
von `TextGroup` (§21): Zeile mit dem Titeltext und dem Standardtitel als
Platzhalter, optional Ausrichtung und Schriftgrenzen; Nutzer sind
Achsentitel, Titel der Farbskala und Objekt-Titel, `AxisTitleGroup` geht
darin auf. Das Auge des Objekttitels bleibt im Panel-Kopf. · Aufwand: M ·
Wo lösen: neue `TitleGroup` · Stand: geplant (Teil 5, eigener
Optik-Commit nach Schritt 10.7)

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

### O10 Gewählte Option im Menü verliert beim Hover ihre Fläche

Ort: Menü jeder Auswahl (`SelectMenu`, `.select-menu-item`), z. B. Format oder
Aggregation

Vorher:

```text
[ Number     ✓ ]   ← gewählt: aktive Fläche
[ Percent      ]
  Maus auf „Number“:
[ Number     ✓ ]   ← Fläche wechselt auf den Hover-Ton
```

Nachher:

```text
  Maus auf „Number“:
[ Number     ✓ ]   ← bleibt aktiv, wie ein gewähltes Segment
```

Vorschlag: Der Hover-Ton gilt nur für nicht gewählte Optionen
(`.menu-item:hover:not(:disabled, .is-active)`), wie beim
`SegmentedControl`. · Aufwand: S · Wo lösen: `Menu.css` · Stand: erledigt (Teil 5, Schritt 4)

### O11 Swatch sitzt im Control über der Mitte

Ort: jeder Swatch in einem Control (`ColorControl`, `PaintControl`,
`DetailsControl`, `GradientControl`, Stopp-Zeile)

Vorher:

```text
[ ● EEF4FF ]   ← Swatch 1–2 px über der Mitte
```

Nachher:

```text
[ ● EEF4FF ]   ← Swatch genau mittig
```

Vorschlag: Die Hülle `.color-swatch` entfällt; sie ist ein Block,
dessen Zeilenhöhe Platz für Unterlängen lässt, sodass der Swatch auf der
Grundlinie sitzt. Ohne Hülle zentriert das Raster des Controls den
Swatch. · Aufwand: S · Wo lösen: Controls mit Swatch, `SwatchButton.css`
· Stand: erledigt (Teil 5, Schritt 4)

### O12 Scrollbalken der Legende liegt über den Einträgen

Ort: Legende mit Überlauf „scroll“ (`ChartLegend.css`,
`.chart-legend-entries.is-scrolling`), z. B. Pie mit fünf Ländern unten

Vorher:

```text
[■ United States  ■ Germany  ■ Japan  ■ France]
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔   ← Balken mitten über den Einträgen
```

Nachher:

```text
[■ United States  ■ Germany  ■ Japan  ■ France]
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                 ← Balken unter den Einträgen
```

Vorschlag: Platz für den Balken unter (bzw. neben) den Einträgen, z. B.
`scrollbar-gutter: stable` oder ein Innenabstand in Balkenbreite;
macOS blendet den Balken sonst über dem Inhalt ein. · Aufwand: S · Wo
lösen: `ChartLegend.css` · Stand: offen

### O13 Inhalt des Format-Panels springt mit dem Scrollbalken

Ort: jedes scrollende Panel (`Panel.css`, `.panel.is-scrollable
.panel-content`), z. B. Format-Panel einer Legende, Auge von Border
schließen

Vorher:

```text
mit Scrollbalken        ohne Scrollbalken
BORDER         👁 ▐     BORDER           👁
                ↑ 12 px               ↑ näher am Rand
```

Nachher:

```text
BORDER         👁 ▐     BORDER         👁
                ↑ 12 px                ↑ 12 px
```

Nur in Safari; Chrome ist korrekt. In Safari ist der Abstand rechts
auch sonst uneinheitlich und hängt von der Breite des Fensters ab.

Vorschlag: Der Abstand rechts bleibt gleich, ob der Inhalt scrollt oder
nicht. `scrollbar-gutter: stable` und der eigene `::-webkit-scrollbar`
halten die Rinne in Chrome frei; Safari rechnet sie anders (überlagernde
Balken in macOS). Dort die Rinne nicht vom Balken abhängig machen, z. B.
mit vollem Innenabstand wie im Firefox-Zweig. · Aufwand: S · Wo lösen:
`Panel.css` (Basis, gilt für alle Panels) · Stand: offen
