# Cevyn – Roadmap

## 1. Zweck

Diese Datei beschreibt den aktuellen Entwicklungsstand und die nächsten
Prioritäten. Sie ist bewusst kompakt:

- Abschnitt 3 sagt, was als Nächstes kommt. Ein neuer Chat beginnt mit
  dem ersten offenen Slice dort.
- Abgeschlossene Slices stehen nur als eine Zeile unter „Erreicht“. Wie
  etwas umgesetzt ist, beschreiben `ARCHITECTURE.md` und
  `DESIGN_SYSTEM.md`; die Details eines Slices stehen in der
  Git-Historie.
- Punkte außerhalb der Planung, auch Bugs und bekannte technische
  Schulden, sind GitHub Issues mit Labels und Prioritäten
  (`DEVELOPMENT.md`, „Issues und Labels“).

Status: Idee · geplant · in Arbeit · implementiert · später. Nur
tatsächlich implementierte und verifizierte Funktionalität gilt als
implementiert.

## 2. Stand

Data-Bereich (Profiling, Semantic Roles), Visualize mit
Multi-Chart-Canvas, Cross-Highlighting, Cards, Ask Cevyn V1 und die
Bearbeitung am Objekt (Format-Panel statt Inspector) sind in einem
ersten vollständigen Stand. Die Appearance-Specs sind auf gemeinsame
Bausteine umgestellt (`TextStyle`, `StrokeStyle`, `NumberFormat`,
`Fill`, `Paint`, `Effect`, `Layout`, `ColorValue` als feste Farbe), das
Format-Panel rechts der Arbeitsfläche zeigt alle Gruppen eines Elements
in fester Reihenfolge und in kompakten Controls im Figma-Stil, mit
Position und Layout auch für Chart und Card. Die App ist neutral
(Akzent nur für Zustände); das Dashboard trägt seine Farben selbst und
bekommt sie aus Dashboard-Styles (Rezept plus Material, Galerie im
Dashboard-Panel, Anwenden als ein Undo-Schritt). Canvas und Container
tragen eine echte Füllung (`Fill`) mit Deckkraft. Flächen und Linien
können Verläufe tragen, Serien einen Fade in ihrer Farbe. Marks haben
Glow oder Schatten, Container eine Liste von Effekten (Schatten,
Innenschatten, Background Blur, Korn). Die Fläche eines Kastens ist ein
eigener Baustein (`Surface`); Legende und Farbskala sind HTML in
Plätzen um den Chart-Canvas. Legende und Tooltip tragen eine eigene
Fläche, die Farbskala ist aufgebaut wie eine Achse, und jeder Rand hat
ein Auge. Datumsachsen gruppieren nach einem wählbaren Zeitraster und
schreiben Daten per Vorlage; ein Klick auf einen Zeitraum wählt ihn
ganz. Kategorien lassen sich nach Wert oder Name sortieren und auf Top
oder Bottom N begrenzen. Ein provisorischer Schalter in der TopBar
wechselt zwischen hellem und dunklem Editor-Theme.

Nächstes Ziel ist ein Alpha-Release.

## 3. Alpha

Ziel: ein vollständiger, vorzeigbarer Workflow für einen kleinen Kreis
von Testern: Daten laden, verstehen, Dashboard bauen (von Hand oder mit
Ask Cevyn), gestalten, speichern und wieder öffnen.

Reihenfolge (jeder Punkt ein eigener Slice oder eine kurze Folge von
Slices; Abhängigkeiten stehen beim Punkt):

1. Effect (Glow) für Marks – implementiert
2. Marks vervollständigen – implementiert
3. Format-Popover: Gruppen statt Sections – implementiert
4. Kompakte Controls im Figma-Stil – implementiert
5. Neutrale Farben und Hintergründe – implementiert
6. Verläufe für Flächen und Linien – implementiert
7. Effekte: Schatten, Background Blur und Korn – implementiert
8. Dashboard-Styles – implementiert
9. Arbeitsfläche, Format-Panel und Objekt-Layout – implementiert
10. Kästen als HTML (3.10a) und Farbskala wie eine Achse und Flächen
    für Kästen (3.10b) – implementiert
11. Zeitraster und DateFormat – implementiert
12. Sortierung und Top N – implementiert
13. Theme-Umschalter in der TopBar (provisorisch) – implementiert
14. Refactoring: Struktur und Modelle vor der Persistenz – **in
    Arbeit**; direkt danach der Slice „Design-Richtlinien und
    Optik-Audit“ (geplant, ohne eigene Nummer)
15. Table-Objekt
16. Tooltip-Felder
17. Dashboard-Einstellungen
18. Build Panel neu ordnen und Ebenen-Baum
19. Ask Cevyn ausbauen
20. Unabhängigkeit vom App-Namen
21. Persistenz
22. Alpha-Infrastruktur und Vollbild

Kleine Lückenfüller zwischen den Slices: einzelne offene Zeilen der
Ist/Soll-Liste in `DESIGN_SYSTEM.md` („Style-Bausteine und Abdeckung“).

### 3.14 Refactoring: Struktur und Modelle vor der Persistenz (in Arbeit)

Die Struktur ist seit dem letzten Refactoring wieder auseinandergelaufen,
`shared/ui` liegt flach, CSS liegt zentral statt bei den Komponenten, und
einiges ist doppelt. Vor der Persistenz (3.21) ist außerdem die letzte
günstige Gelegenheit, die Modelle zu vereinfachen. Ziel sind die Regeln
in `DEVELOPMENT.md`, Abschnitt 21 „Struktur- und Code-Regeln“
(Prinzipien, Namensgrammatik mit Basiskomponenten, Glossar, Werkzeuge).

Regeln für den Slice:

- ohne Verhaltensänderung: Die App sieht danach exakt aus wie vorher und
  verhält sich so; Build, Lint, Tests und der Bildvergleich des
  Smoke-Tests belegen das. Ausnahmen sind Teil 6, Teil 11 und in Teil 5
  Escape im Modus „übernehmen“ von `Input` (neu für `NumberInput`)
- Verschieben (`git mv`) und Ändern nie im selben Commit
- keine Feature-Arbeit parallel, auch keine PRs am Frontend von außen;
  das Refactoring berührt sehr viele Dateien
- je Teil ein Chat und ein Checkpoint; innerhalb eines Teils heißen die
  Abschnitte „Schritt“; die Teile 2, 3, 4 und 10 sind mechanisch (kurz
  prüfen, eine niedrigere Reasoning-Stufe reicht), die Teile 1, 5 bis 9
  und 11 enthalten Logik (genau prüfen)
- Fundliste: Vor jedem Teil die Tabelle „Funde während des Slices“
  unten lesen. Was beim Arbeiten auffällt und nicht in den laufenden
  Teil gehört (doppelte Logik, unpassende Namen, Besitz), trägt der
  Agent dort selbst ein, statt es nebenbei zu ändern oder ein Issue
  anzulegen. Passt ein Fund klar zu einem späteren Teil, steht er
  zusätzlich dort. Abgearbeitet wird die Liste zwischen den Teilen oder
  in Teil 10
- Optik-Funde: Was beim Arbeiten optisch auffällt (Stellen, die anders
  aussehen als gleichartige, unruhige Abstände oder Ausrichtung,
  ungenutzter Platz, unklare Darstellung), trägt der Agent mit Skizze
  vorher und nachher in `docs/design-findings.md` ein, bevorzugt mit
  einer Lösung in einer Basis (`Row`, `Group`, `.control-frame`)
- Optik-Runde am Ende jedes Teils: kleine Optik-Funde werden erledigt,
  jeder Fix ein eigener Commit; größere sind Eingabe für den
  Design-Slice
- der Smoke-Test schützt vor ungewollten Schäden: Was er findet und
  nicht gewollt ist, wird zurückgebaut. Eine Abweichung, die eine
  Verbesserung ist und bleiben soll (z. B. ein Swatch, der ohne Hülle
  genau mittig sitzt), darf im Umbau-Commit stehen: Differenzbilder
  ansehen (`npx playwright show-report`), nach dem OK die Referenzbilder
  im selben Commit erneuern. Größere Sichtänderungen wie „Schrift“ und
  „Schnitt“ bleiben eigene Commits

Inventur (erledigt): Scan gegen Abschnitt 21 von `DEVELOPMENT.md`. Der
Bericht liegt lokal als `refactoring-inventory.md` im Repo-Root (nicht
versioniert) und ist Eingabe für jeden Teil. Wichtigste Funde:

- das Aussehen hängt an der Importreihenfolge in `index.css`: Mehrere
  gleich spezifische Regeln gewinnen nur, weil ihre Datei später kommt
- `.control` ist die Klasse des `IconButton`
- Undo fasst schnelle Änderungen nur bei der Aggregation zusammen, nicht
  bei Sortierung und Zeitraster
- die leere Kategorie wird je Charttyp anders angezeigt und beim
  Vergleichen anders behandelt (#32)
- 16 Ringe zwischen den `types.ts`-Dateien (nur Typimporte); `cards/`
  und `table/` importieren das Query-Vokabular aus `charts/`
- Weichen nach `kind` außerhalb des Objekt-Bauplans, u. a. in
  `workspaceReducer`, `ChartGrid`, `applyDashboardStyle`,
  `useWorkspaceDnd` und `App`
- Request- und Response-Typen stehen doppelt, in Python und von Hand in
  TypeScript

Teile:

1. Sicherheitsnetz (erledigt): Playwright mit Bildvergleich (`npm run smoke`):
   Demo-Daten, jeder Charttyp und eine Card, Legende, Farbskala,
   Format-Panel mit Untergruppen, offene Popover, Drag-Überlagerung, Hell
   und Dunkel; Referenzbilder vor dem ersten Umbau, danach pixelgenauer
   Vergleich bei jedem Checkpoint. Dazu Tests, die das heutige Verhalten
   festhalten: Vitest für Undo-Zusammenfassung, Sortierung, Zeitraster,
   Typwechsel und leere Kategorie, pytest für Profil und Grenzwerte der
   Queries
2. Werkzeuge (erledigt): Pfad-Alias `@/`, `madge`, `knip`, `jscpd`,
   ESLint-Grenzen und `import-linter` als Skripte, die vorerst nur melden;
   Stand beim Einrichten: 8 Ringe, 52 Grenzverstöße, 12 Kopien, 1
   ungenutzte Datei und 45 ungenutzte Exporte im Frontend, Backend-Vertrag
   erfüllt
3. Verschieben (erledigt): CSS neben die Komponenten (#12), `index.css`
   bleibt die geordnete Importliste; Bausteine aus `shared/`, die nur
   ein Bereich nutzt, in diesen Bereich; Backend-Tests nach
   `tests/datasets`, `tests/queries` und `tests/integration`; rein
   mechanisch. Ergebnis: `CheckList` und `RangeSlider` liegen in
   `table/`, `DateFormatSelect`, `EffectControls`, `GradientControl` und
   `PaletteControl` in `charts/format/`, `StatWidget` in `datasets/`;
   das Stop-Raster steht vorab in eigener `GradientStopsControl.css`.
   In `shared` bleiben `WidgetButton` (Button-Form der Widget-Basis, geht
   in Teil 4 in `Tile` auf) und `NumberInput` (wird das generische
   Zahlen-Input). `ChartItem.css` und `EncodingDropSlots.css` bleiben bis
   Teil 8 unter `styles/canvas/`, `field.css` bis Teil 4 unter `styles/`
4. Namen und Basen (erledigt; Regeln in `DEVELOPMENT.md` Abschnitt 21,
   „Ebenen und Namensgrammatik“, Register in `docs/COMPONENTS.md`): Basen
   `Panel`, `Group` (Untergruppe per Context, einklappbar statt
   `CollapsibleSection`), `Row` (festes Raster mit Aktionsspalte, Minus
   über `remove`, Zahnrad über `details`), `Editor` (Inhalt eines
   Popovers mit Kopf und Schließen), `Tile`; der Control-Rahmen als
   Klasse `.control-frame`, Swatch mit Text als `.swatch-control`.
   `Popover` hält den Offen-Zustand selbst und hat die Variante `editor`.
   Entfallen sind `DetailsPopover`, `CollapsibleSection`, `DropdownField`,
   `FillListControls`, `GradientStopsControl`, `EffectControls` und
   `SurfaceEffectsControls`; dafür gibt es `BackgroundGroup`,
   `GradientStopRow` und für Marks und Flächen gemeinsam `EffectsGroup`,
   `EffectRow` und `EffectEditor`. Jede Gruppe rendert ihre `Group`
   selbst, das Auge eines Teils liefert `getVisibility`. Elemente,
   Groups, Rows und Tiles tragen ihre Endnamen, `shared/ui` ist nach
   Ebene geordnet (was im Register „unklar“ ist, liegt noch flach),
   CSS-Klassen folgen den Komponentennamen, überflüssige Defaults sind
   entfernt. Bewusste Sichtänderungen mit neuen Referenzbildern: Section
   → Group, festes Raster der Row (O6), Hinweis ohne Einrückung (O3).
   Strukturberichte danach: 8 Ringe, 52 Grenzverstöße, 13 Kopien, keine
   ungenutzte Datei, 43 ungenutzte Exporte und Typen
5. Ebenen (in Arbeit; Smoke vor jedem Commit): Primitives mit den Basen `Button`, `Input` und
   `Popover` und dünnen Varianten. `Button` bekommt Arten (Text, Icon,
   Kachel, Swatch, Chip), die Fläche `ghost` statt der Überschreib-Regeln
   und `pressed`; Varianten `IconButton`, `SwatchButton` (statt
   `ColorSwatch`), `SelectButton` und `Chip` (ohne `forwardRef`),
   `WidgetButton` entfällt, `CommandButton` bleibt Hülle in `app/`.
   `Input` arbeitet live oder übernehmend (Enter oder Verlassen übernimmt,
   Escape bricht ab), Varianten `TextInput` (auch inline auf der
   Arbeitsfläche, ersetzt `InlineTextInput`) und `NumberInput`; `SelectMenu` ist Variante von `Popover`. Anzeige
   (`EmptyState`, `MiniHistogram`, `SurfaceLayers`, `SurfaceBorder`,
   `IconBadge`, `OptionLabel`) zieht nach `shared/ui/display/`.
   Controls nach Verhalten zusammengeführt (Ausrichtung, Position →
   `SegmentedControl`; Winkel → `NumberControl`; Palette →
   `SelectControl`; `ScrubbableNumber` → `NumberControl` aus Button und
   `NumberInput`, mit den Einheiten `px`, `ms`, `percent` und `degree`;
   `StepRange` → Option `steps` von `RangeControl`). Die Bündel werden
   ganze Groups (`TextStyleControls` → `TextGroup`,
   `NumberFormatControls` → `NumberFormatGroup`, `LayoutControls` →
   `LayoutGroup`, `PositionControls` → `PositionGroup`,
   `StrokeStyleControls` geht in `StrokeGroup` auf, `SurfaceControls`
   entfällt, weil jedes Element seine Groups listet (neue `ShapeGroup`,
   Border und Effects lesen den Renderer), `ShadowControls` geht in
   `EffectEditor` auf). Vorher trennt die Spec Position und Layout
   (`position` mit `side` und `alignment`, `layout` mit `gap` und
   `padding`; der Titel bekommt `alignment` für seinen Text), damit jede
   Group ihr eigenes Unterobjekt liest. Jede Group nimmt `value` und
   `onChange`, kennt ihren Titel und zeigt das Auge nur über
   `visibility`. Die Filterformulare bleiben Inhalt des
   Filter-Popovers ohne Group (Bearbeiten und Inhalt teilen nur Control,
   Primitive und Anzeige, `DEVELOPMENT.md` §21). Labels und Tooltip nutzen die Groups schon jetzt
   als Untergruppen; eigene Elemente werden sie im Design-Slice.
   Import-Grenzen je Ebene melden (scharf in Teil 10). Verhalten, das
   kein Screenshot sieht (Runden, Escape, Pfeiltasten, Auto), sichern
   Vitest-Tests über reine Funktionen. Als eigener Optik-Commit:
   `FontWeightControl` und der Kursiv-Schalter gehen in zwei
   Auswahlfeldern „Schrift“ und „Schnitt“ auf (z. B. „Bold Italic“,
   kursive Inter aus `@fontsource-variable/inter`, Zeilen nach O7); das
   Modell bleibt
6. Paint vereinfachen, Verhaltensänderung mit neuen Referenzbildern;
   vor der Persistenz, weil sich das gespeicherte Modell ändert:
   - „Datenfarbe“ als Art einer Farbe (`ColorValue` mit
     `{ kind: 'series' }`), im Color Picker als Swatch „Data“ dort, wo
     es Daten gibt
   - `SeriesPaint` und der Fade entfallen; ein Fade ist ein Verlauf mit
     Stopps in Datenfarbe, z. B. „Data 100 %“ zu „Data 0 %“
   - eigene Zeile „Data color“ (Farbe, Palette oder Farbskala); die
     Fill-Zeile zeigt überall Paint-Feld und Deckkraft, der Editor
     öffnet immer am Swatch
   - ein `PaintEditor` (Typ, Winkel bzw. Form, Stopps); `ColorControl`
     geht in `PaintControl` mit nur Solid auf
   - der Ort legt erlaubte Typen und Farben fest: Marks und Linien nur
     Datenfarbe, radiale Verläufe nur für Flächen
   - Defaults, Style-Rezepte und Actions von Ask Cevyn anpassen
7. Eine Sprache für Frontend und Backend:
   - Request- und Response-Typen aus dem OpenAPI-Schema des Backends
     erzeugen (`openapi-typescript`, Skript `npm run api:types`) statt
     von Hand in `…Api.ts` und `types.ts`
   - gemeinsames Query-Vokabular in `queries/` (Aggregation, Filter,
     Sortierrichtung `direction` statt `order`, Selection-Filter in
     `queries/selection/`); `cards/` und `table/` importieren nicht mehr
     aus `charts/`
   - kategorische X in der Highlight-Query ausdrücklich statt aus
     `sort !== null`
   - Typ-Ringe lösen: Basistypen (z. B. `DashboardObjectBase`,
     `ObjectContainer`) getrennt von den Unions
8. Objekte:
   - Bauplan je Objektart: Was je Art verschieden ist (Anlegen, Inhalt im
     Rahmen, Format-Panel, Abfrage, Titel, Style anwenden, Drop-Ziele),
     steht in ihrem Eintrag in `objectDefinitions`; `workspace/`, `app/`
     und `dashboardStyle/` fragen nicht mehr nach `kind`. Prüfstein: Ein
     neuer Objekttyp braucht nur seinen Eintrag und seinen Ordner
   - gemeinsamer Code statt Paaren: `ChartItem` und `CardItem` →
     `ChartContent` und `CardContent`, Format-Panel, Titel und Abfrage
     über gemeinsame Bausteine; Encodings, Marks und der Kartenwert
     bleiben im Ordner ihrer Art
   - `chart/updateData` statt `chart/updateAggregation`,
     `chart/updateCategoryOrder` und `chart/updateTimeGrain`, wie
     `card/updateData`; Undo fasst wie heute nur Aggregationsänderungen
     zusammen; die Actions von Ask Cevyn bleiben und werden übersetzt
   - Objekte an einer Stelle nachschlagen: ein abgeleiteter Index aus der
     flachen Liste (Reihenfolge, nach Id, gewähltes Objekt) als
     Vorbereitung für Layout-Container (nach dem Alpha)
   - CSS-Trennung von Frame und Content (`chart-item*`,
     `encoding-drop-slot*`), mit Prüfung von Fokus und Drag; danach
     liegen die Teile neben Frame bzw. Content, `styles/canvas/` entfällt
     und #12 ist erledigt
9. Modelle:
   - Backend: ein Datensatz-Profil als einzige Quelle, die Summary wird
     daraus abgeleitet (Id und `row_count` einmal); Zählwerte
     (`missing_count`, `unique_count`) in `statistics`, `statistics` nie
     `null`, auch für Identifier; das Frontend folgt über die erzeugten
     Typen
   - gespeicherte Specs nach M2: Titel `text: string | null` statt
     `''`; Card-Quelle `{ kind: 'rows' } | { kind: 'field'; field;
aggregation }`; Linienfläche als `area: { visible, fill }`; feste
     Legendenhöhe als Konstante statt in der Spec; `limit: null` bleibt
     („kein Limit“)
10. Grenzen, Doku und Abschluss-Inventur: ESLint-Grenzen,
    `import-linter` und Ringprüfung scharf schalten; `DataPanel` zieht
    von `datasets/` nach `app/`; `ARCHITECTURE.md`,
    `DESIGN_SYSTEM.md` und `DEVELOPMENT.md` nach dem tatsächlichen Stand;
    JSDoc an den angefassten Funktionen; offene Einträge der Fundliste
    abarbeiten und die Kopien aus `npm run check:copies` einmal
    durchgehen: je Kopie zusammenführen (gleiches Wissen), bewusst
    getrennt lassen (C7, mit einem Satz Begründung) oder in die
    Fundliste; zum Schluss derselbe Scan wie bei der Inventur, gegen die
    Regeln in Abschnitt 21 und das Register: was er findet, wird erledigt
    oder als Ausnahme eingetragen
11. Fix der leeren Kategorie (#32), Verhaltensänderung, eigener
    Commit: ein Schlüssel für fehlende Werte beim Vergleichen (Selection,
    Filter, Gruppen im Backend), eine Anzeige über alle Charttypen

Kleine Funde nur mitnehmen, wenn die Datei ohnehin angefasst wird:
Funktionsnamen nach den Präfixen aus Abschnitt 21, Props, die an jeder
Aufrufstelle gleich sind, als Default, eine gemeinsame Schwelle für
Klick und Drag, überflüssige Exporte, Glossar-Einträge, der
Health-Endpunkt als Ausnahme in `ARCHITECTURE.md`.

Funde während des Slices (Regel oben, „Fundliste“):

| Fund                                                                                                                                                                                                                                            | Ort                                                                                                                                                                                                                        | Vorschlag                                                                                                                                                                                                    | Teil         | Stand                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------------------- |
| `NumberInput` und `ScrubbableNumber` haben beide Entwurf bis Enter/Blur und Begrenzen auf min/max                                                                                                                                               | `shared/ui/primitives/NumberInput.tsx`, `controls/NumberControl.tsx`                                                                                                                                                       | `NumberControl` = `Button` mit `useScrub` + `NumberInput`; Regeln in `inputDraft.ts`                                                                                                                         | 5            | erledigt (Schritt 5.4) |
| 10 von 13 Klassen an `Button` schalten seine Pillen-Fläche (Hintergrund, Rahmen, Hover) per CSS wieder aus                                                                                                                                      | `color-swatch-swatch`, `select-control-button`, `options-menu-item`, `segmented-control-option`, `position-grid-cell`, `check-list-item`, `scrubbable-number-handle`, `data-filter-clear(-all)`, `calculated-field-button` | `Button` bekommt die Fläche `ghost`; die Überschreib-Regeln entfallen. Swatch folgt in Schritt 4; `data-filter-clear-all` und `calculated-field-button` bleiben, weil sie beim Hover die volle Fläche zeigen | 5            | erledigt               |
| `OptionContent` (Anzeige) importiert den Typ `OptionItem` aus `Menu` (Primitive); auch Fachdateien hängen an der UI-Komponente                                                                                                                  | `shared/ui/display/OptionLabel.tsx`, `shared/ui/primitives/SelectMenu.tsx`                                                                                                                                                 | `OptionItem` in eigener Typdatei `shared/optionItem.ts`; Familien `Option…` (eine Option) und `Select…` (Auswahl)                                                                                            | 5            | erledigt (Schritt 6)   |
| Escape im `NumberControl` übernimmt den getippten Wert doch: das Verlassen danach liest noch den alten Entwurf                                                                                                                                  | `shared/ui/controls/NumberControl.tsx`                                                                                                                                                                                     | `NumberControl` nutzt `NumberInput` (`Input` im Modus „übernehmen“), Escape setzt vor dem Verlassen eine Marke                                                                                               | 5            | erledigt (Schritt 5.4) |
| Primitives und Controls lesen Farben, Radius und Schrift direkt aus den App-Tokens (`--color-*`, `--radius-*`, `--font-size-*`, rund 85 Stellen); überschreibbar sind nur `--control-border-color`, `--control-font-size` und `--control-width` | `shared/ui/primitives/*.css`, `shared/ui/controls/*.css`                                                                                                                                                                   | je Baustein `--control-*`-Variablen mit App-Token als Fallback (`ARCHITECTURE.md`, „Bausteine im Stil des Rahmens“)                                                                                          | Table-Objekt | offen                  |
| `Popover` hat immer die App-Fläche (`glass glass-thick`), `Chip` den App-Glanz (`--glass-highlight`)                                                                                                                                            | `shared/ui/primitives/Popover.tsx`, `Chip.css`                                                                                                                                                                             | Fläche über eine überschreibbare Variable, damit ein Dropdown im Table-Objekt im Stil des Dashboards aufgeht                                                                                                 | Table-Objekt | offen                  |
| Zustände nutzen fest den App-Akzent (`--color-accent`, `--shadow-accent`, 16 Stellen), z. B. Fokus von Feldern                                                                                                                                  | `shared/ui/primitives/*.css`, `shared/ui/controls/*.css`                                                                                                                                                                   | Akzent über eine Variable; auf dem Canvas entscheiden, ob der Akzent des Dashboards gilt                                                                                                                     | Table-Objekt | offen                  |
| Fester Radius `3px` statt Token                                                                                                                                                                                                                 | `shared/ui/controls/PositionGrid.css:48`                                                                                                                                                                                   | Plot-Zelle des Positionsrasters nutzt `--radius-xs`                                                                                                                                                          | Table-Objekt | erledigt (Schritt 8.2) |
| `AxisTitleGroup` und `ObjectTitleWidget` bearbeiten beide Text und Textstil eines Titels                                                                                                                                                        | `charts/format/AxisTitleGroup.tsx`, `objects/ObjectTitleWidget.tsx`                                                                                                                                                        | eine gemeinsame `TitleGroup` (Ausrichtung und Schriftgrenzen optional); ändert die Optik, also nur als bewusste Sichtänderung                                                                                | 10           | offen                  |
| Interaktionen heißen in der Spec `enabled` (Legende, Tooltip, Zoom), Teile der Optik `visible`; `getVisibility` passt deshalb nur auf die Optik                                                                                                 | `charts/types.ts` (`ChartInteractionSpec`)                                                                                                                                                                                 | vor der Persistenz entscheiden: bewusst so lassen (Verhalten statt Sichtbarkeit) oder angleichen                                                                                                             | 9            | offen                  |
| `--indent-nested` rückt nur noch den Hinweis „No matching fields“ ein, die Feldgruppen darüber nicht mehr (seit Section → Group)                                                                                                                | `datasets/FieldList.css`, `styles/tokens.css`                                                                                                                                                                              | Einrückung und Token entfernen                                                                                                                                                                               | 4            | erledigt               |
| Marks haben genau einen `Effect` (mit `{ kind: 'none' }`), Flächen eine Liste `SurfaceEffect[]`; die Oberfläche ist seit Teil 4 eine (`EffectsGroup`), das Modell noch zwei                                                                     | `shared/effect.ts`, `charts/types.ts`                                                                                                                                                                                      | ein Typ `Effect` mit allen Arten; Marks speichern `effects: Effect[]` (höchstens einer), `none` entfällt                                                                                                     | 9            | offen                  |
| `FieldList` und `DatasetProfileView` bauen dieselben einklappbaren Feldgruppen (Icon, Zahl, `defaultOpen`); `npm run check:copies` meldet die Kopie                                                                                             | `datasets/FieldList.tsx`, `datasets/DatasetProfileView.tsx`                                                                                                                                                                | eine gemeinsame `FieldGroup` für eine Feldgruppe                                                                                                                                                             | 10           | offen                  |
| `RangeControl` und `CheckList` lesen App-Tokens direkt (`--color-accent`, `--shadow-accent`, `--color-surface-default`) und feste Maße (Griff 16px, Zeile 30px)                                                                                 | `shared/ui/controls/RangeControl.css`, `CheckList.css`                                                                                                                                                                     | wie die übrigen Controls über `--control-*`-Variablen mit App-Token als Fallback; nötig für Filter auf dem Canvas                                                                                            | Table-Objekt | offen                  |
| `DataTableFilterEditor` trägt die Endung der Bearbeiten-Ebene (`…Editor`), ist aber Inhalt, den der Betrachter bedient                                                                                                                          | `table/DataTableFilterEditor.tsx`                                                                                                                                                                                          | Name nach der Domäne, z. B. `DataTableFilter`; mit dem Table-Objekt entscheiden                                                                                                                              | Table-Objekt | offen                  |
| Vier fast gleiche leise Hinweis-Stile (klein, gedämpfte Farbe)                                                                                                                                                                                  | `table/DataTable.css` (`data-filter-note`, `data-table-hint`), `datasets/StatTile.css` (`stat-tile-hint`), `styles/canvas/EncodingDropSlots.css` (`encoding-drop-slot-hint`)                                               | ein Hinweis-Baustein in `display/`, wenn die Stile wirklich dasselbe meinen (C7)                                                                                                                             | 10           | offen                  |
| `NumberFormatGroup` verschachtelt die Zahlen-Zeilen in `{hasDetails ? (<>…</>) : null}`; die Group liest sich dadurch unruhiger als eine Liste von Rows                                                                                         | `shared/ui/groups/NumberFormatGroup.tsx`                                                                                                                                                                                   | in der Bewertung am Ende des Slices prüfen, z. B. je Zeile eine eigene Bedingung statt eines Fragments                                                                                                       | 5            | offen                  |

Nicht in diesem Slice: das Öffnen des Fill-Editors ausdrücklich steuern;
Rechenlogik aus `ChartColorScale` und `EncodingsWidget` ziehen; CSS
direkt in den Komponenten laden statt über `index.css`; Mark-Profile;
das Zahlenformat des Tooltips (→ Tooltip-Felder); JSDoc für alle
Funktionen; `dashboardStyle/` aufteilen.

### Design-Richtlinien und Optik-Audit (geplant, direkt nach 3.14)

Eigener Slice ohne Nummer zwischen Refactoring und Table-Objekt:

- Planung vorab mit einer Panel-Werkbank (Artefakt); die Vorgabe für
  den Slice kommt von dort
- Richtlinien je Ebene in `DESIGN_SYSTEM.md` mit Skizzen, danach Prüfung
  anhand der Smoke-Screenshots und `docs/design-findings.md`; Fixe
  bevorzugt in den Basen
- Labels und Tooltip werden eigene Elemente in der Auswahl oben im
  Format-Panel (wie Legende und Achse); bei Marks bleibt je eine
  kompakte Gruppe mit Auge und einem Icon, das zum Element wechselt
- Untergruppen entfallen ganz (Regel in `DEVELOPMENT.md` Abschnitt 21
  und Context in `Group`)
- Scrollen zur Gruppe beim Klick entfällt; der Klick wählt weiter das
  Element aus
- Zeilen nur noch als Paar oder Breit, kein „Einzeln“ mehr
- Aktionsspalte einheitlich für ein oder zwei Icons festlegen

### 3.15 Table-Objekt (geplant)

Dritter Objekttyp neben Chart und Card, auf Basis von `DataTable` und
`table-query`:

- die Vorbereitung (gemeinsames Query-Vokabular in `queries/`, Bauplan
  je Objektart, CSS-Trennung von Frame und Content) erledigt das
  Refactoring (3.14)
- Randwerte des Tabellenfilters (`StepRange`) als reiner Helper mit Test
  (aus der Inventur des Refactorings)
- `TableInstance` in `DashboardObject`, Registry-Eintrag in
  `objectDefinitions`, Picker-Gruppe „Cards & Table“
- Format über die Bausteine: Kopfzeile (`TextStyle`, `Fill`), Zellen
  (`TextStyle`, `NumberFormat`, `DateFormat`), Zeilen- und Spaltenlinien
  (`StrokeStyle`), Zebra-Streifen (`Fill`), Container wie bei Chart und
  Card
- zu klären: welche Spalten die Table zeigt (alle, Auswahl per Drop),
  und ob sie wie die Card der Selection folgt

### 3.16 Tooltip-Felder (geplant)

Direkt nach dem Table-Objekt:

- frei wählbare Zusatzfelder im Tooltip (wie in Power BI), z. B.
  `customers` im Scatter von revenue und profit
- `interaction.tooltip.fields: string[]` existiert, wird aber nicht
  genutzt; für aggregierte Charts braucht jedes Feld eine Aggregation,
  daher Form `{ field, aggregation }[]` – Formänderung, also vor der
  Persistenz
- Scatter: Felder zusätzlich in der `points-query`; Bar, Line, Pie:
  `chart-query` liefert pro Gruppe zusätzliche aggregierte Werte
- Bedienung über dieselbe Feldliste wie die Spaltenauswahl der Table
  (Felder ziehen, sortieren, entfernen, Aggregation)
- dieselbe Feldwahl bestimmt auch den Inhalt der Datenlabels (heute fest
  Wert bzw. Anteil), z. B. Kategorie oder ein weiteres Feld

### 3.17 Dashboard-Einstellungen (geplant)

Im Format-Panel ohne Auswahl (aus 3.9), undo-fähig; als Unterobjekte
der `DashboardSpec` (wie `animation`), weil sich ihre Form vor der
Persistenz festlegen soll:

- zuerst Textobjekt und Dokumentname, wie in Power BI: Dokumentname und
  sichtbarer Titel trennen sich
  - der Dokumentname (`dashboard.name`) steht in der TopBar, wie der
    Dateiname in Figma und Power BI
  - der sichtbare Titel ist ein Textobjekt im Grid: bei neuen Dashboards
    oben über die volle Breite angelegt, verschiebbar, skalierbar,
    löschbar; weitere Textobjekte für Zwischenüberschriften, Erklärtexte
    und Fußnoten
  - ein Textobjekt ist ein Kasten mit Text (Container mit `Surface`,
    `EditableText`, `TextStyle`) und im Kern ein neuer Objekttyp in der
    Registry; eine Card ist fast dasselbe, nur mit Daten
  - direkt danach nutzen Chart- und Card-Titel denselben Baustein,
    eingebettet im Objekt: Sie bewegen und skalieren sich mit ihm (keine
    freie Position), ihr Standardtext kommt aus den Daten, die Fläche ist
    optional und standardmäßig durchsichtig; `ObjectTitleAppearance`
    gilt für Chart und Card zugleich, ohne Fläche bleibt die Optik
    gleich (vorher als Lückenfüller nach 3.10b geplant, verschoben,
    damit der Titel den allgemeinen Baustein nutzt statt einer
    Sonderlösung)
  - vor der Persistenz, weil Dokumentname und Titel ins Dateiformat
    eingehen
- `canvas.background` ist seit 3.5 da (`Fill`, Gruppe Background)
- feste Seitengröße: `pageSize` (`Auto` wie heute oder fest, z. B.
  1280 × 720) als Voraussetzung für Zoom; bei fester Größe steht die
  Seite aus 3.9 zentriert auf der Arbeitsfläche
- `layout.padding` (Innenabstand der Seite; in 3.9 ein fester Wert für
  Titel und Grid)
- `format.locale` statt der Konstante `LOCALE` in `shared/config.ts`;
  heute zeigt Cevyn `1,234.56` auch für deutsches Publikum
- `interaction.crossHighlight`: ob ein Klick auf eine Mark die übrigen
  Objekte filtert
- später: Palette und Schrift als Teil der Dashboard-Styles (3.8)

### 3.18 Build Panel neu ordnen und Ebenen-Baum (geplant)

Das Build Panel mischt heute drei Aufgaben in einer langen Spalte:
Hinzufügen (Charttypen, Card), Daten (Dataset, Felder) und den
ausgewählten Chart (Chart data, ganz unten). Vor „Ask Cevyn ausbauen“
(3.19), weil der Chat dort als Tab ins linke Panel kommt.

- nach Aufgabe ordnen, wie in Power BI und Looker Studio:
  - Hinzufügen in die Toolbar der Arbeitsfläche: „＋ Einfügen“ als
    Popover mit Charttypen, Card, Table, später Text, mit Suche
  - links die Daten: Dataset als Auswahl oben, Felder als schlanke
    Zeilen mit Typ-Icon statt umrandeter Pillen; Ziehen bleibt
  - „Chart data“ ins rechte Panel als Tab „Daten“ neben „Format“: die
    Encodings als Felder, in die man ziehen kann, dazu Grain, Sort und
    Show; das Limit von Top N als Eingabe statt nur als Vorlagen
- Ebenen-Baum als Tab im linken Panel, eine reine Ansicht über das
  bestehende Modell:
  - Dashboard › Objekte › ihre Teile (z. B. Chart › Title, Marks, X
    Axis, Y Axis, Legend)
  - Charts verhalten sich wie Komponenten in Figma: Teile sichtbar und
    formatierbar, die Struktur fest
  - Klick wählt aus wie ein Klick auf die Region, das Auge blendet aus,
    Doppelklick benennt um
- linkes Panel mit Tabs: Daten, Ebenen, ab 3.19 Ask

### 3.19 Ask Cevyn ausbauen (geplant)

Ziel: Ask Cevyn erstellt eigenständig ganze Dashboards und formatiert
sie. Die Architektur bleibt: Claude erzeugt nur Cevyn Actions, das
Frontend prüft sie und wendet sie als ein Undo-Schritt an. Hängt an
3.15 und 3.17, weil die KI nur kann, was es als Action gibt.

- Action-Schema nur noch einmal beschreiben (#30): Frontend-Types bzw.
  Strukturprüfung per Codegen aus dem OpenAPI-Schema des Backends
  (heute doppelt in `backend/app/ai/models.py` und
  `frontend/src/actions/parseCevynActions.ts`)
- neue Actions:
  - `card/create`, später `table/create`
  - Layout über Reihenfolge und Größenklassen (z. B. klein, halb,
    volle Breite); der Code berechnet die Grid-Positionen
  - Formatierung über die Bausteine („Element + Baustein“, z. B.
    `numberFormat` der Y-Achsenbeschriftung), Farben als echte Werte
  - Dashboard-Styles anwenden (3.8) und Dashboard-Einstellungen
  - Verweise innerhalb eines Batches: neue Objekte bekommen einen
    eigenen Namen (`ref`), damit spätere Actions im selben Aufruf sie
    ansprechen können
- Gestaltungsregeln im System-Prompt (z. B. KPI-Cards oben, wenige
  Charts, passender Charttyp je Rolle, kurze Titel)
- kompakter Appearance-Kontext für bestehende Objekte
- Chat mit Verlauf: das Frontend schickt den Verlauf mit, das Backend
  bleibt zustandslos; Fehler des Validators gehen an Claude zurück, das
  sich korrigiert; der Verlauf wird nur angehängt, nie umgeschrieben
- Chatfenster als Tab „Ask“ im linken Panel (aus 3.18); die Leiste
  unten auf der Arbeitsfläche bleibt die schnelle Eingabe und öffnet
  den Tab
- kleines Testset typischer Anfragen mit einfachen Prüfungen, um
  Verschlechterungen bei Prompt-Änderungen zu erkennen; Effort je nach
  Anfrage (ganzes Dashboard höher, kleine Änderungen niedriger)

### 3.20 Unabhängigkeit vom App-Namen (geplant)

Vor der Persistenz, weil der Name in Dateiendung und Dateiformat eingeht:

- Code-Bezeichner beschreiben die Funktion statt der Marke (z. B.
  `CevynAction` → `AssistantAction`, `AskCevynBar`, `useAskCevyn`,
  `run_cevyn_actions`)
- angezeigter Name als Konstante: `APP_NAME` und `ASSISTANT_NAME` in
  `shared/config.ts`, im Backend in einer `app/config.py` (API-Titel,
  System-Prompt)
- Doku, `AGENTS.md` und `README.md` anpassen
- der neue Name selbst ist noch offen

### 3.21 Persistenz (geplant)

- `serializeProject()` / `deserializeProject()` über den Workspace State
- `.cevyn`-Datei (JSON mit Format-Kennung und Version) speichern und
  öffnen; Autosave im Browser
- die Daten selbst: Uploads liegen im Backend nur im Arbeitsspeicher;
  das Projekt bringt sie mit (CSV oder Parquet in der Datei) oder lädt
  sie beim Öffnen neu hoch – zu Beginn des Slices entscheiden
- pro Version eine Migration; beim Laden prüfen wie bei
  `parseCevynActions`
- offene Schulden, die hier fällig werden: Semantic-Role-Overrides in
  den Project State (#29), Scroll- und Fokusverhalten beim Laden (#27,
  #28)

### 3.22 Alpha-Infrastruktur und Vollbild (geplant)

- Docker-Images für Frontend und Backend
- CI mit GitHub Actions: `npm run format`, `npm run build`,
  `npm run lint`, `uv run pytest`
- Betrieb: Empfehlung gehostete Web-App für einen eingeladenen Kreis;
  noch zu entscheiden
- Zugangsschutz (Einladungscode oder Magic Link über einen Anbieter),
  Upload-Limit, Datasets nach einer Zeit aus dem Speicher entfernen,
  Rate-Limit für Ask Cevyn
- Datenschutz-Hinweis für Tester (Daten gehen bei Ask Cevyn an die
  Claude-API)
- Vollbild für die Seite als Command mit Shortcut; Vollbild ist die
  Ansicht zum Analysieren und Präsentieren: Klicks, Brush und Legende
  analysieren nur, ohne Auswahl, Hover-Labels, Format- und
  Bearbeitungsaktionen (wie die Leseansicht in Power BI)

### Nicht im Alpha

- Slicer und dashboard-weite Filter (Abschnitt 4); die Selection
  deckt gemeinsames Filtern für den ersten Eindruck ab

## 4. Nach dem Alpha

### Slicer und Filterebenen (geplant)

Beschlossen:

- ein Objekttyp `slicer`; das Steuerelement (Dropdown, Liste, Range,
  Datum) folgt aus der Semantic Role und ist umschaltbar
- drei getrennte Filterebenen: Slicer (Dashboard), Selection
  (Cross-Highlight), Table-View-Filter (lokal, unverändert)
- die wirksamen Filter eines Objekts berechnet eine reine Funktion in
  der Workspace-Domäne; die Basis-Query trägt die Slicer-Filter, die
  Highlight-Query zusätzlich die Selection
- Slicer untereinander UND, Werte eines Slicers ODER; ein leerer Slicer
  filtert nicht, ein Slicer filtert sich nicht selbst
- der Slicer-Wert ist nicht undo-fähig (wie `selection`) und wird mit dem
  Projekt gespeichert; im MVP gilt ein Slicer für das ganze Dashboard
- Backend: ein gemeinsames Filtervokabular inklusive `date_range` für
  alle Queries, Filter auch für die Points Query; gemeinsame
  Filter-Controls mit der Table prüfen (`DataTableFilterForm`)

Ideen: Scope pro Slicer, kaskadierende Slicer-Optionen,
dashboard-weiter Filterbereich, Cross Filtering als Modus.

### Bearbeitung am Objekt (Rest)

- Encodings im Build Panel über ein X entfernen (wie in Power BI)
- eine gemeinsame „X Axis“ mit allen Gruppen statt der getrennten
  Elemente „X Axis“ und „X Axis Labels“; der Klick auf eine Region
  öffnet das Element und springt zur passenden Gruppe (Idee)
- Direct Manipulation von Elementen über ihre Regionen (z. B. Legende
  frei verschieben)

### Visualisierung

- Picker für viele Charttypen: Schnellauswahl in der Section „Charts“,
  „More“ als Popover mit Suche und Kategorien nach Zweck; Empfehlungen
  passend zu den gewählten Feldern (Idee)
- weitere Charttypen und Varianten als Issues: Stacked Bar (#13),
  Horizontal (#14), Stacked Area (#15), Heatmap (#16), Histogramm
  (#17), Kombi-Chart (#18); danach bei Bedarf Boxplot,
  Treemap, Sankey, Radar, Maps
- Drill-down, Referenzlinien, Mehrfachauswahl (#39), Range-Selection für Line
  und Bar
- Datum: Drill-down baut auf dem Zeitraster auf; später relative Daten
  („vor 3 Tagen“), Geschäftsjahre, eine Zeitzonen-Einstellung, Beispiele
  aus den echten Daten im DateFormat-Select, Datumsformat für Pie und
  Donut (#60)
- kleine Anteile bei Pie und Donut als „Other“ zusammenfassen (Idee)

### Canvas und Dashboard-Objekte

- Layout-Container wie Auto Layout in Figma, Container in Power Apps und
  Tableau: ein Container-Objekt im Grid, das seine Kinder horizontal
  oder vertikal anordnet (Gap, Padding, Ausrichtung, füllen oder an den
  Inhalt anpassen); für KPI-Leisten, Filterleisten, später Slicer neben
  einem Chart; der Ebenen-Baum aus 3.18 zeigt die Verschachtelung; das
  Grid bleibt, später kann die Seite selbst zum Container werden;
  vorbereitet im Refactoring (3.14: Objekte an einer Stelle durchlaufen)
  und in der Persistenz (3.21: Version und Migration von der flachen
  Liste zum Baum)
- Text-, Bild- und Vergleichs-Objekte; Textfelder als frei verschiebbare
  Kästen mit eigener Größe (Kasten-Modell, `ARCHITECTURE.md`)
- Kollisionsauflösung, Smart Guides, Gruppen, Mehrfachauswahl,
  Layers Panel, Z-Order
- Zoom (braucht `pageSize`, siehe 3.17)

### Daten

- Light Data Operations (Filter, Sort, Group) und Calculated Fields
  (`+ − × ÷`, Felder verbinden), die danach als normale Fields
  erscheinen
- Datenskala bei Bedarf: DuckDB, Parquet, Sampling, Caching – keine
  Migration nur aus Architekturgründen

### Explore und Machine Learning

- Explore: Python erzeugt Candidate Insights, die KI priorisiert und
  erklärt, Cevyn visualisiert über dieselbe Chart Engine
- Forecasts, Cluster und Anomalien als Erweiterung von Visual Analytics,
  kein eigenes ML-Studio

### Share

- Export: PNG, SVG, PDF, CSV, interaktives HTML (Titel und Container
  selbst zusammensetzen, #38)
- Publish: Share Link, veröffentlichte Dashboards
- Collaboration: Accounts, Organisationen, Rechte, Kommentare,
  Versionen; Speichern auf dem Server

## 5. MVP-Definition

Der erste echte Cevyn-MVP soll mindestens folgenden Workflow
ermöglichen:

```text
Upload Dataset
→ Understand Data
→ Review Types and Profile
→ Filter / Aggregate
→ Create Visualizations
→ Create Multiple Visualizations
→ Arrange Dashboard
→ Use Shared Filters and Selection
→ Save Project
→ Reopen Project
```

Das Ziel ist nicht maximale Feature-Anzahl, sondern ein vollständiger,
verständlicher und wiederholbarer Visual-Analytics-Workflow.

## 6. Erreicht

Kurzfassung der abgeschlossenen Slices; Details in `ARCHITECTURE.md`,
`DESIGN_SYSTEM.md` und der Git-Historie.

Daten

- CSV-Upload, Demo-Dataset im Backend (24.000 Rows), lesbare
  Upload-Fehler (422 statt 500)
- deterministisches `DatasetProfile` mit Physical Types, Semantic Roles,
  Statistiken und Histogrammen; Semantic-Role-Overrides, die Build
  Panel, Charts und Ask Cevyn sofort übernehmen
- Data-Bereich mit Profile (Kennzahl-Kacheln, Field-Kacheln) und Table
  (virtualisiert, Filter, Sortierung, Paging über `table-query`)
- Full Data Access: das Backend rechnet über den ganzen Datensatz
  (`chart-query`, `points-query` mit Sampling, `card-query`)

Visualisierung und Canvas

- Scatter, Line, Bar, Pie und Donut über den ECharts-Adapter mit
  Registry pro Charttyp; Series, Color- und Size-Encodings, Legende,
  kontinuierliche Farbskala
- Multi-Object-Canvas: `DashboardObject` (Chart, Card) mit Frame und
  Content, Grid-Layout, Move, Resize, Duplicate, Delete, Tastatur
- Cross-Highlighting über eine globale Selection (Klick und Brush), auch
  für Cards mit Selection-Label; der Scatter lädt die Felder einer
  fremden Selection mit, um seine Punkte abzugleichen
- Undo/Redo mit Coalescing, Command-Registry mit Shortcuts und
  Hover-Titeln
- Cards mit Feld per Drop, Aggregation, Zahlenformat

Bearbeitung am Objekt

- Format-Modus: Pinsel oder Enter öffnet das Format-Popover, Regionen
  für Titel, Achsen, Achsenbeschriftungen, Legende, Marks und die freie
  Fläche (Element „Chart“ bzw. „Card“), Hover-Label im Format-Modus
- Tooltip, Datenlabels und Color Scale als Elemente bzw. Gruppen im
  Popover
- Inspector entfernt; Widgets in ihren Domänen; Dashboard-Einstellungen
  (Gap, Background, Animation) im Zahnrad der Canvas-Toolbar
- Format-Popover mit Gruppen statt Sections: alle Gruppen untereinander,
  Element-Schalter im Kopf, Gruppen-Schalter in der Überschrift, kurze
  Zeilen-Labels, feste Reihenfolge je Element (Marks über
  `MARK_GROUP_ORDER`); Color der Marks verweist bei kontinuierlicher
  Farbe auf die Color Scale
- kompakte Controls im Figma-Stil: Zeilen ohne Label mit Icon und
  Einheit im Feld (`ScrubbableNumber` mit `icon`, `unit`, `onAuto`),
  Farbzeile (`PaintControl`, `ColorField`) mit der Datenfarbe der Marks
  samt Palette, Verlauf und Range (⚙), Seltenes hinter ⚙
  (`DetailsPopover`); Auge, ＋/− und Pinsel statt Schaltern, `Toggle`
  und `Slider` entfernt
- Icon-Gruppen mit Icon und Wort über die volle Breite, Optionen mit
  Icons auch in Selects (`OptionContent`, Aggregationen mit Σ, x̄, x̃),
  dichtere Menüs; `PositionGrid` für Legende und Farbskala,
  `RotationDial` als Feld mit Nadel
- Data Labels als eigenes Element mit Positionen je Charttyp
  (`labelPositions`, eigene Icons); Zoom als Toggles Scroll | Slider,
  Legend Interaction als Off | Multiple | Single, Animation mit Easing
  und Duration

- Arbeitsfläche und Seite getrennt: neutrale Arbeitsfläche mit Toolbar
  (Undo, Redo, Pinsel), die Seite trägt den Style, Titel und Grid
  fluchten und scrollen gemeinsam
- Format-Panel rechts statt Popover (`FormatPanel`, ⌘⇧B), folgt der
  Auswahl, ohne Auswahl das Dashboard; Zeilen-Raster `1fr 1fr 24px`
  (`ControlRow` mit `pair`, `single`, `wide`, `action`, `isFull`)
- Ort statt Modus: kein Format-Modus mehr; Klick-Grammatik (Klick,
  ⌘/Ctrl-Klick, Doppelklick) und Hover-Label
- kleine Elemente als Gruppen ihres Elternteils (`formatGroups`):
  Datenlabels und Tooltip in Marks, Achsen-Labels in der Achse,
  Selection in Value
- Gruppen Position und Layout wie in Figma (`PositionControls`,
  `LayoutControls`, `BoxFieldsRow`): Chart und Card mit X | Y und W | H
  in Grid-Zellen, begrenzt wie beim Ziehen und undo-fähig; Richtung von
  Legende und Farbskala folgt aus der Seite

Style-Bausteine und Farben

- `TextStyle`, `StrokeStyle`, `NumberFormat`, `Fill`/`SeriesFill` mit
  je einer `…Controls`-Komponente
- `Effect` mit `EffectControls`: Glow (None/Glow, Intensity) für alle
  Marks in der Serienfarbe; abgeblendete Serien und Punkte leuchten
  nicht, Scatter ab 500 Punkten ohne Glow
- alle Marks mit Fill, Border und Effect (Balken, Scatter-Punkte, erstmals
  eine Appearance für Pie und Donut mit Innenradius); Achsenlinie mit
  `StrokeStyle`; Achsentitel als `title: { text, textStyle }` wie
  überall
- `ColorValue` als feste Farbe, Paletten als `ColorValue[]`; Flächen
  unter Linien in der Serienfarbe
- Paletten stabil erweitert (`getPaletteColor`): ab der sechsten
  Kategorie hellere bzw. dunklere Runden derselben Farben statt
  Wiederholung; vorhandene Kategorien behalten ihre Farbe
- `Layout` mit Position- und Layout-Bausteinen für Container,
  Dashboard, Legende, Farbskala und Datenlabels; Achsentitel mit
  eigenem `visible`
- Line: Points Auto/On/Off, Datenlabels auch ohne Punkte; Scatter:
  flächentreue Größe mit Size range, Labels ohne Überlappung
- neutrale App („grau bis aktiv“): Hover und aktive Controls grau, der
  Akzent nur für Auswahl, Fokus, Drop-Ziele, Format-Fokus und
  Primäraktion; Dashboard und App mit getrennten Farben und Akzenten;
  Canvas (`canvas.background`) und
  Container als `Fill` mit Deckkraft auf eigener Ebene, ohne Glass,
  Schatten und Presets; das Objekt im Format-Popover als feiner Ring
- Verläufe: gemeinsamer `Paint` für Fill und Stroke (Solid, linearer
  und radialer Verlauf mit Stopps), Fade für Serien-Flächen und -Linien;
  Typwahl, Winkel und Stopp-Liste (⚙ in der Überschrift) im
  `PaintControl`; Adapter für ECharts und CSS, Container-Rahmen als SVG
- Effekte: Schatten neben Glow für Marks (Versatz, Farbe und Deckkraft
  hinter ⚙); Container mit einer Liste `container.effects` aus
  Schatten, Innenschatten, Background Blur und Korn auf festen Ebenen;
  Gruppe Effects mit ＋ und Zeilen Art | Hauptwert | ⚙ | −; 16 px
  Innenabstand der Canvas gegen abgeschnittene Schatten
- Dashboard-Styles: Rezept (`StyleRecipe` in der `DashboardSpec`) plus
  Material (`solid`, `frosted`, `glass`) ergibt alle Werte; Graphite,
  Midnight, Daylight, Bloom und Indigo; Anwenden schreibt echte Werte
  als ein Undo-Schritt, `takeStyleColors` übernimmt generisch jede
  Farbe der Defaults; neue Objekte entstehen im aktuellen Style; keine
  Theme-Tokens mehr; Galerie im Dashboard-Popover mit Vorschau live aus
  dem Rezept (`SurfaceLayers`); Schnellauswahl der Style-Farben in
  jedem Farbwähler; Dashboards behalten ihre Farben im hellen und
  dunklen Editor

Kästen als HTML (3.10a)

- Vorbereitung: Scatter flackert nicht mehr bei einer Selection (#51);
  Format-Fokus als Rahmen statt Abdunkeln: Ein Klick legt Fokus-Rahmen
  über den Teil, bis ein anderer Klick etwas anderes wählt, kein Puls,
  kein Hover-Fokus aus dem Panel, keine Tooltip-Vorschau; Umriss im
  vollen Akzent mit Halo, im Fokus dicker
- schnellere Updates (#52, offen): Brush-Action nur mit Fläche, Fokus
  ohne Neuzeichnen, Scrubben einmal pro Frame; Scatter mit 2.000
  Punkten beim Scrubben 345 → 132 ms. Merge statt `notMerge` brachte
  gemessen nichts; der Rest liegt bei vielen Scatter-Punkten (#57)
- die Palette füllt ihren Select-Button
- `Surface` als eigener Baustein für jeden Kasten: Typ, `SurfaceControls`,
  `SurfaceLayers`, `SurfaceBorder`, `SurfaceEffectsControls`; was ein
  Renderer zeichnet, steht in `SURFACE_CAPABILITIES`; der Container
  sieht aus wie vorher
- Position von Legende und Farbskala als Feld, das ein `PositionGrid`
  öffnet: die Legende mit vollem 3×3-Raster (links und rechts mittig,
  kein eigenes Alignment-Control), die Farbskala als Kreuz der vier
  Seiten (`variant="cross"`); statt des anfangs geplanten Kreuzes mit
  Ausrichtung daneben
- Plätze um den Chart-Canvas (`.chart-body`); Farbskala als HTML an
  allen vier Seiten mit Minimum und Maximum wie bisher
  (`getColorScaleRange`, `continuous.layout.orientation` entfällt);
  engere Plot-Ränder
- Legende als HTML mit gleichem Verhalten: Ein- und Ausblenden über
  eine versteckte ECharts-Legende, Single und Multiple, inaktive Farbe,
  Hervorheben beim Hover, Umbruch oder Scrollen; das Messen in
  `createGridOption` und `getPieCenter` entfallen; Legende ohne
  Interaction ist eine Format-Region (#9), lange Legenden oben und
  unten richten sich richtig aus (#55)

Farbskala wie eine Achse und Flächen für Kästen (3.10b)

- Farbskala mit den Bausteinen der Achse: Titel (Name der Metrik),
  Werte mit Text und Zahlenformat, Ticks (Auto: Minimum und Maximum,
  sonst runde Werte über `getColorScaleTicks`, mit Vitest-Tests),
  Werte auf der vom Plot abgewandten Seite, vertikal ein gedrehter
  Titel wie an der Y-Achse; W | H des Balkens und Ausrichtung oben und
  unten; nur der Balken ist ein Kasten (Radius, Rand), Titel und Werte
  sind eigene Format-Regionen mit Sprung zu ihrer Gruppe
- Legende mit Fläche (`surface`) und Padding (Standard 8); ihre
  Einträge scrollen innerhalb der Fläche
- Tooltip-Aussehen pro Chart (`appearance.tooltip`): Layout (Gap,
  Padding), Fläche über den Renderer `css` (`getSurfaceCssText`, ohne
  Rand-Verlauf und Korn), Text und Zahlenformat; „Style anwenden“
  übernimmt seine Fläche komplett
- Ränder mit Auge (`StrokeAppearance`, `StrokeWidget`) für Container,
  Legende, Farbskala, Tooltip, Balken, Punkte und Segmente;
  ausgeblendet mit 1 px statt Breite 0
- `SurfaceControls` zeigt nur die Gruppen, deren Felder ein Kasten hat;
  Fokus-Rahmen um Marks mit 2 px Abstand; Frontend-Tests mit Vitest
  (`npm run test`)

Zeitraster und DateFormat

- Zeitraster in der `chart-query` (`time_grain`, `dt.truncate`, Wochen
  ab Montag); Standard ist das native Raster des Felds
  (`Field.native_grain`), wählbar in der Zeile „Grain“ des Build Panels
  (`ChartDataSpec.timeGrain`, `null` = nativ)
- Datumswerte als Wanduhrzeit (`parseDateValue`), behebt #34; ein
  Formatter auf `Intl.DateTimeFormat` mit Locale als Parameter und
  zwischengespeicherten Instanzen
- DateFormat als Auswahl per Beispiel: Auto folgt dem Raster, Vorlagen
  je Raster im breiten Select unter dem Format-Select der X-Achse
  (`DateFormatSelect`); Achse, Tooltip-Überschrift, Pie-Legende und
  Titel („… by month“) folgen dem Raster
- Klick auf einen Zeitraum wählt den ganzen Zeitraum: Datumsbereich als
  Chart-Filter für Highlight-Query, Scatter und Cards
- Modell: `FieldProfile` baut auf `Field` auf; `Field` ordnet ein,
  `statistics` beschreibt

Sortierung und Top N

- `ChartDataSpec.sort` (Wert oder Kategorie, auf- oder absteigend) und
  `limit` (Top/Bottom N, `null` = alle); Standard Value ↓ wie zuvor
- die `chart-query` begrenzt und sortiert über den ganzen Datensatz,
  nur bei kategorischer X; Top N nach der Summe über alle Series
- die Highlight-Query übernimmt die Kategorien der Basis-Query
  (`categories`), statt ein eigenes Top N zu rechnen
- Zeilen Sort und Show im Build Panel unter Category, undo-fähig
- Charttyp-Wechsel behält `spec.data`: Zeitraster, Sort und Show auch
  über einen Scatter hinweg, die Aggregation zwischen aggregierten Typen
- Booleans durchgängig als „true“/„false“: Selection auf
  Boolean-Kategorien, Zellen der Table View und Farben im Scatter

Theme-Umschalter (provisorisch)

- `IconButton` (Sonne/Mond) rechts in der `TopBar` schaltet
  `data-theme` am `<html>`; ohne Persistenz und Undo, Charts zeichnen
  über `useDocumentTheme` neu
- Light Theme in drei Stufen (kühles Grau, fast weiße Panels, Controls
  als Ink-Alpha dunkler als das Panel); Prinzip in `DESIGN_SYSTEM.md`,
  „Ebenen und Kontrast je Theme“

Ask Cevyn V1

- Action Layer: `CevynAction`s, Strukturprüfung, Validierung,
  Übersetzung in Workspace Actions, ein Undo-Schritt
- Claude mit Tool `run_cevyn_actions`, Dataset-Profil und
  Chart-Regeln als gecachter Kontext; Eingabeleiste mit Thinking Glow

Entwicklung

- Backend nach Domänen, Frontend nach Domänen mit `shared/useQuery`
- pytest-Tests für Queries, Uploads und API (`uv run pytest`)
