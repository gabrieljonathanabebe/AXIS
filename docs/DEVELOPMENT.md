# Cevyn – Development Guidelines

## 1. Ziel

Diese Datei definiert die technischen Arbeitsregeln für Änderungen an
Cevyn.

Sie gilt für menschliche Entwicklung und Coding Agents.

## 2. Line Length

Zielwert für Codezeilen:

```text
maximal 80 Zeichen
```

Eine Zeile soll nicht unnötig umgebrochen werden, wenn sie innerhalb
von 80 Zeichen sinnvoll lesbar bleibt.

Wenn eine Zeile 80 Zeichen überschreitet, soll sie nach den
idiomatischen Regeln der jeweiligen Sprache umgebrochen werden.

Lesbarkeit hat Vorrang vor mechanischem Formatting.

Keine künstlich schwer lesbaren Konstruktionen erzeugen, nur um die
80-Zeichen-Regel einzuhalten.

## 3. Language

Dokumentation:

```text
Deutsch
```

Code:

```text
Englisch
```

Identifiers:

```text
Englisch
```

Technische und etablierte Produktbegriffe können auch in deutscher
Dokumentation Englisch bleiben.

Beispiele:

- ChartSpec
- Format-Popover
- Build Panel
- Calculated Field
- Workspace
- Data Engine

## 4. Scope Control

Änderungen auf den aktuellen Task begrenzen.

Keine unrelated Refactorings durchführen.

Wenn während einer Aufgabe ein größeres Architekturproblem entdeckt
wird:

1. Problem erklären;
2. mögliche Lösung beschreiben;
3. nicht automatisch großflächig refactoren.

## 5. Implementation Permission

Keine eigenständigen Codeänderungen durchführen, wenn der Nutzer nur
über:

- Architektur,
- Produktideen,
- UX,
- Alternativen,
- zukünftige Features

diskutiert.

Implementierung nur bei ausdrücklicher Aufforderung.

## 6. Inspect Before Implementing

Vor jeder neuen Implementierung:

1. relevante bestehende Dateien lesen;
2. nach ähnlicher Funktionalität suchen;
3. bestehende Komponenten prüfen;
4. bestehende Types prüfen;
5. bestehende CSS-Klassen und Tokens prüfen;
6. bestehende Architektur respektieren.

## 7. Reuse Before Creation

Bevorzugt:

```text
bestehende generische Komponente
+ neue Prop
```

statt:

```text
neue Spezialkomponente für einen einzelnen Use Case
```

Dasselbe gilt für:

- Hooks
- Utilities
- Types
- CSS
- Formatters
- Controls

Eine neue Abstraktion soll einen klaren wiederverwendbaren Zweck
haben.

## 8. Frontend Principles

Frontend:

- React
- TypeScript
- Vite
- ECharts
- dnd-kit
- Custom CSS
- Lucide React

React-Komponenten sollen nicht unnötig Renderer-spezifische Logik und
Domain Logic vermischen.

Chart-Konfiguration soll über das Cevyn Domain Model laufen.

## 9. Backend Principles

Backend:

- FastAPI
- Python
- Polars für CSV-Daten und gruppierte Chart-Abfragen

Data Operations sollen möglichst unabhängig von der langfristigen
Execution Engine modelliert werden.

Datasets liegen aktuell als Polars-DataFrames im In-Memory-Store.
DuckDB kann später bei konkretem Bedarf eingeführt werden.

Lokale Konfiguration steht in `backend/.env` (nicht im Repo) und wird
beim Start geladen; Änderungen erfordern einen Neustart des Backends:

```bash
ANTHROPIC_API_KEY=sk-ant-...
CEVYN_AI_STUB=1   # 1: AI Commands ohne Claude (Stub), 0: echter Aufruf
```

Keine Architekturkomplexität nur für hypothetische Skalierung
einführen.

## 10. Types

Types sollen zentrale Domain Concepts klar ausdrücken.

Keine parallelen Types für dasselbe Konzept erzeugen, wenn ein
bestehender Type sinnvoll erweitert werden kann.

Renderer-spezifische Types sollen nicht unnötig in das Domain Model
durchsickern.

## 11. CSS

Vor einer neuen CSS-Klasse prüfen:

- existiert bereits ein passender Style?
- existiert ein Design Token?
- kann eine generische Klasse erweitert werden?
- ist der Style wirklich komponentenspezifisch?

Keine Copy-Paste-Duplikate für minimale Varianten erzeugen.

CSS liegt neben seiner Komponente; `styles/` hält nur Tokens, Themes und
Basis (Abschnitt 21, S5).

## 12. Icons

Primäres Icon-System:

`Lucide React`

Für spezialisierte Visualisierungsicons können eigene SVGs verwendet
werden.

Diese sollen sich visuell an Lucide orientieren.

Wenn sinnvoll, eigene Icons über `createLucideIcon()` integrieren.

## 13. Verification

Alle Checks dieses Abschnitts auf einmal, aus jedem Ordner aufrufbar:

```bash
scripts/check.sh            # Backend und Frontend: Format, Lint, Build, Tests
scripts/check.sh --smoke    # zusätzlich der Smoke-Test
```

Das Skript hält beim ersten Fehler an und lässt das Terminal im Ordner,
aus dem es aufgerufen wurde. Die einzelnen Befehle folgen hier.

Nach relevanten Frontend-Änderungen mindestens, im Ordner `frontend/`:

```bash
npm run format
npm run build
npm run test
```

`npm run format` formatiert neben dem Frontend auch `docs/`, `AGENTS.md`
und `README.md`.

Frontend-Tests laufen mit Vitest (`npm run test`, einmaliger Lauf ohne
Watch-Modus). Sie liegen als `*.test.ts` neben der getesteten Datei,
z. B. `charts/getColorScaleTicks.test.ts`, und decken reine Funktionen
ohne React und ECharts ab.

Nach relevanten Backend-Änderungen, im Ordner `backend/`:

```bash
uv run ruff format .
uv run ruff check --fix .
uv run pytest
```

Die Tests liegen in `backend/tests/` (pytest, Dev-Abhängigkeit über
`uv add --dev`) und spiegeln `app/`: `datasets/`, `queries/` und
`integration/` für Prüfungen über HTTP, die mehrere Domänen berühren.
Fixtures in `tests/conftest.py`, gültig für alle Unterordner: ein
kleines Sales-Dataset mit von Hand prüfbaren Summen und ein
`TestClient`, der die App ohne Server startet und dabei das
Demo-Dataset lädt.

Nach Änderungen, die das Aussehen oder die Bedienung nicht verändern
sollen (z. B. Refactorings), zusätzlich im Ordner `frontend/`:

```bash
npm run smoke
```

Der Smoke-Test (Playwright, nur Chromium) öffnet die App mit den
Demo-Daten in Hell und Dunkel und vergleicht jeden Zustand pixelgenau mit
einem Referenzbild: jeden Charttyp, die Card, die Format-Panels mit
Untergruppen, offene Popover, Hover, Drag und die Data View. Laufende
Server auf den Ports 8000 und 5173 nutzt er, sonst startet er sie selbst.
Die Tests liegen in `frontend/smoke/` (`*.smoke.ts`), die Referenzbilder
in `frontend/smoke/__screenshots__/<plattform>/`. Chromium läuft mit
`--disable-partial-raster`, sonst schwankt die Kantenglättung zwischen
zwei Läufen um einzelne Farbwerte.

Referenzbilder nur bewusst neu erzeugen, wenn sich das Aussehen gewollt
ändert (`npm run smoke -- --update-snapshots`), und die neuen Bilder vor
dem Commit ansehen. Sie sind plattformabhängig: Heute gibt es den Satz
für macOS (`darwin`), Linux für die CI kommt später als eigener Satz
dazu. Bei einem roten Vergleich zeigt `npx playwright show-report`
Referenz, neues Bild und Unterschied.

Strukturberichte prüfen die Regeln aus Abschnitt 21 und melden vorerst
nur, ohne den Lauf scheitern zu lassen; scharf werden sie im
Refactoring-Slice (`ROADMAP.md`, 3.14, Teil 10). Im Ordner `frontend/`:

```bash
npm run check:boundaries  # Schichtgrenzen (ESLint-Grenzen)
npm run check:copies      # Kopien, Frontend und Backend (jscpd)
npm run check:cycles      # Ringabhängigkeiten (madge)
npm run check:unused      # Ungenutztes (knip)
```

Im Ordner `backend/`:

```bash
uv run lint-imports       # Schichtgrenzen (import-linter)
```

Umgang mit den Berichten: am Ende eines Slices bzw. Teils ausführen und
mit dem Stand davor vergleichen (bis Teil 10 die Zahlen in `ROADMAP.md`,
3.14, Teil 2). Neue Befunde durch die eigene Änderung vor dem Abschluss
beheben oder im Abschluss begründen; bestehende Befunde nicht nebenbei
beheben, sondern nur im Slice, der dafür vorgesehen ist. Der Abschluss
nennt die Zahlen vorher und nachher, wenn sie sich geändert haben.

Bei der Arbeit in Vertical Slices werden diese Befehle einmalig
am Ende des vollständigen Slices ausgeführt, nicht nach jedem einzelnen
Implementierungsblock.

Während eines Slices nur gezielte Zwischenprüfungen ausführen, wenn sie
für den nächsten Block erforderlich sind. Diese ersetzen die einmalige
abschließende Verification nicht.

Fehler, die durch die aktuelle Änderung verursacht wurden, vor
Abschluss beheben.

Falls weitere Tests für einen betroffenen Bereich existieren, diese
ebenfalls ausführen.

Keine unrelated bestehenden Fehler stillschweigend als Folge der
aktuellen Änderung darstellen.

## 14. Milestone Completion

Ein Feature gilt erst als abgeschlossen, wenn:

- die angeforderte Funktion implementiert ist;
- relevante Edge Cases berücksichtigt wurden;
- bestehende Funktionalität nicht offensichtlich regressiert;
- Format/Build erfolgreich sind;
- relevante Dokumentation geprüft wurde.

## 15. Documentation Check

Nach einem abgeschlossenen Task prüfen:

```text
Hat sich Produktvision geändert?
→ PRODUCT_VISION.md

Hat sich Architektur geändert?
→ ARCHITECTURE.md

Gibt es ein neues generisches UI Pattern?
→ DESIGN_SYSTEM.md

Hat sich der Workflow geändert?
→ DEVELOPMENT.md

Hat sich Entwicklungsstand/Priorität geändert?
→ ROADMAP.md
```

Nur tatsächlich betroffene Dateien verändern.

## 16. Git Checkpoints

Nach einem abgeschlossenen:

- Feature,
- Bugfix,
- Refactoring,
- Milestone

einen Git-Checkpoint vorschlagen.

Nicht automatisch committen oder pushen, sofern dies nicht
ausdrücklich verlangt wurde.

Format:

```bash
cd "$(git rev-parse --show-toplevel)/frontend"
npm run format
npm run build
cd "$(git rev-parse --show-toplevel)"
git status --short
git add <betroffene-dateien>
git diff --cached --check
git diff --cached --stat
git commit -m "<type>: <description>"
git push
```

Im Vorschlag die Platzhalter durch konkrete Dateipfade ersetzen.
Generierte Dateien wie `__pycache__` und fremde Änderungen nicht
automatisch mitstagen.

Geeignete Commit Prefixes:

```text
feat:
fix:
refactor:
docs:
style:
chore:
```

Commit Message kurz und konkret halten.

## 17. Agent Communication

Bei kleinen Änderungen direkt und kompakt arbeiten.

Bei größeren Änderungen:

1. bestehende Architektur analysieren;
2. betroffene Bereiche nennen;
3. kleinen Plan formulieren;
4. anschließend implementieren, wenn dies angefordert wurde.

Keine unnötigen langen Erklärungen während Routineänderungen.

Bei neuen oder architekturrelevanten Konzepten nachvollziehbar
erklären, warum eine Lösung gewählt wurde.

Technische Schritte mit anwendungsnahen Beispielen erklären: was der
Nutzer tut oder was ankommt (z. B. konkretes JSON, eine Eingabe in der
Console oder im UI) und was mit bzw. ohne die Änderung passiert. Kurze
Tabellen der Form „Eingabe → Effekt“ sind dafür gut geeignet.

Terminal-Befehle laufen einheitlich vom Repo-Root:

- Jeder Codeblock mit Terminal-Befehlen beginnt und endet im Repo-Root.
- Braucht ein Befehl einen Unterordner, steht am Anfang des Blocks
  `cd "$(git rev-parse --show-toplevel)/frontend"` (bzw. `/backend`) und
  am Ende `cd "$(git rev-parse --show-toplevel)"`.
- Git-Befehle laufen immer im Repo-Root.

```bash
cd "$(git rev-parse --show-toplevel)/frontend"
npm run build
npm run smoke
cd "$(git rev-parse --show-toplevel)"
git status --short
```

## 18. Vertical Slices und Chat-Übergaben

Ein Vertical Slice wird innerhalb eines einzelnen Chats bearbeitet.

Innerhalb eines Slices in wenigen sinnvollen Implementierungsblöcken
arbeiten. Ein Block soll einen zusammenhängenden Teil des Datenflusses
oder Verhaltens abdecken und einen nachvollziehbaren Zwischenstand
erzeugen.

Nicht jede einzelne Zeile als eigenen Schritt behandeln. Gleichzeitig
nicht den gesamten Slice in einem einzigen großen Schritt umsetzen.

Am Slice-Anfang zuerst entscheiden, dann vertiefen:

- nur die Doku und die relevanten Abschnitte der genannten Dateien
  lesen, keine ganzen Dateien;
- danach sofort einen kurzen Plan als Text und die offenen
  Entscheidungen gesammelt als Fragen stellen; Varianten nicht lange
  intern durchspielen, bei echter Unklarheit fragen;
- Fragen über die interaktive Fragen-Ansicht des Agents stellen (in
  Claude Code `AskUserQuestion`), nicht als Fließtext: je Frage die
  Antworten als auswählbare Optionen, die Empfehlung als erste Option
  mit „(Recommended)“ im Label; höchstens vier Fragen pro Runde, mehr in
  einer zweiten Runde;
- stellen die Optionen etwas Sichtbares dar (Layout, Control, Anordnung
  im Panel, Darstellung im Chart), bekommt jede Option eine
  minimalistische Skizze als Vorschau, die beim Hovern erscheint (z. B.
  eine ASCII-Skizze der Panel-Zeilen); reine Logik- oder
  Benennungsfragen brauchen keine Skizze;
- Library-Quellcode und Detailprüfungen erst in dem Block, dessen Code
  davon abhängt;
- je Block nur die Dateiabschnitte lesen, die er braucht;
- Reasoning-Stufe: extra high nur für die Entscheidungen am Anfang,
  für die Blöcke reicht high; dem Nutzer sagen, wenn die Entscheidungen
  getroffen sind und er umstellen kann.

Wenn der Nutzer den Anwendungscode selbst eingibt:

- pro Block konkrete Dateipfade und zusammenhängenden Code angeben;
- jede einzelne Codeergänzung als eigenen Codeblock formulieren, auch
  einzeilige Änderungen wie Imports oder Props;
- direkt über jedem Codeblock Datei und genaue Einfügestelle nennen,
  bezogen auf benachbarten bestehenden Code („nach …“, „ersetzen …“);
- Dateipfade als klickbaren Markdown-Link relativ zum Repo-Root
  angeben, bei bestehenden Dateien mit Zeilenanker auf die
  Einfügestelle, z. B.
  `[createAxesOptions.ts:97](frontend/src/charts/echarts/createAxesOptions.ts#L97)`;
  wird ein bestehender Bereich ersetzt oder gelöscht, markieren Linktext
  und Anker den ganzen Bereich, z. B.
  `[markGroups.tsx:149-165](frontend/src/charts/format/markGroups.tsx#L149-L165)`;
  bei mehrdeutigen Dateinamen (z. B. `types.ts`) den Ordner im Linktext
  mitnennen;
- neue Dateien ohne Zeilenanker und mit dem vollständigen Pfad ab
  Repo-Root als Linktext, z. B.
  „Neue Datei `frontend/src/charts/format/ChartFormatPopover.tsx`“, da
  der Link selbst noch auf keine Datei zeigt;
- Zeilennummern vor jedem Block aus dem aktuell gespeicherten Stand
  bestimmen, da sie sich durch vorherige Blöcke verschieben;
- mehrere Änderungen in derselben Datei von oben nach unten angeben, in
  der Reihenfolge, in der der Nutzer sie einträgt; jede Zeilennummer ist
  bereits um die Verschiebung durch die Änderungen darüber korrigiert und
  stimmt nach dem Eintragen der vorherigen (nicht von unten nach oben);
- keinen Code in Fließtext oder Aufzählungspunkte packen;
- bei Ersetzungen den vollständigen neuen Abschnitt zeigen;
- nach jedem Codeblock in wenigen kurzen Stichpunkten erklären, was
  passiert: aus Review- und Architektursicht (Verantwortung,
  Datenfluss, Entscheidung, Auswirkung), nicht Zeile für Zeile und
  ohne Syntax-Erklärungen; Ziel ist Überblick ohne langes Lesen;
- Antworten insgesamt knapp halten;
- nach dem Block den gespeicherten Ist-Zustand prüfen;
- am Ende eines Schritts, der sichtbar etwas ändert, eine Tabelle für
  die Prüfung im Browser: was sich ändert | vorher sichtbar | jetzt
  sichtbar; ohne sichtbare Änderung entfällt sie;
- erst dann mit dem nächsten Block fortfahren.

Graphify ist derzeit kein verpflichtender Teil des Workflows und wird
nicht routinemäßig vor Codebase-Fragen ausgeführt.

Nach Abschluss eines Vertical Slices:

1. Verification und Dokumentationspflege abschließen (u. a.
   `ROADMAP.md`, bei Bedarf `ARCHITECTURE.md`);
2. einen Git-Checkpoint vorschlagen;
3. unaufgefordert eine kurze Übergabe für den nächsten Chat als
   kopierbaren Prompt mitliefern.

Die Übergabe ist ein kompakter Prompt in einem Codeblock, mit dem der
Nutzer direkt einen neuen Chat beginnt. Sie besteht aus höchstens
wenigen Stichpunkten und enthält:

- den nächsten geplanten Vertical Slice mit Verweis auf `ROADMAP.md`;
- den abgeschlossenen Stand;
- wichtige dauerhafte Entscheidungen;
- das Ziel des nächsten Slices;
- offene Entscheidungen, falls vorhanden;
- nur die dafür unmittelbar relevanten Dateien.

Der nächste Vertical Slice beginnt in einem neuen Chat. Sein Kontext
kommt aus der aktuellen Projektdokumentation und der kurzen Übergabe aus
dem vorherigen Chat.

Temporäre Arbeitsschritte gehören nicht in die Projektdokumentation.
Tatsächliche Änderungen am Entwicklungsstand werden weiterhin in
`ROADMAP.md` festgehalten; dauerhafte Architekturentscheidungen in
`ARCHITECTURE.md`.

## 19. Code Structure

Längere TypeScript- und Python-Module durch kurze Abschnittsmarker
strukturieren, wenn sie mehrere klar getrennte Bereiche enthalten.

Beispiel:

```ts
// ===== TYPES ================================================================
// ===== CONSTANTS ============================================================
// ===== HELPERS ==============================================================
// ===== FUNCTION =============================================================
// ===== RETURN ===============================================================
```

Die Bezeichnungen sind kurz, englisch und beschreiben die tatsächliche
Verantwortung des folgenden Abschnitts. Keine Marker einfügen, wenn eine
Datei oder Funktion bereits ohne sie unmittelbar erfassbar ist.

Ziel der Dokumentation im Code: Mensch und KI erfassen eine Funktion,
ohne ihren Rumpf lesen zu müssen.

Importpfade im Frontend: über Ordnergrenzen mit dem Alias `@/` (zeigt
auf `src/`, definiert nur in `tsconfig.app.json`), im selben Ordner
relativ mit `./`; kein `../`.

Import-Reihenfolge wird automatisch gesetzt, nicht von Hand:

- Frontend: `@ianvs/prettier-plugin-sort-imports` über `npm run format`;
  Gruppen: externe Pakete, eigene Module (`@/` vor `./`), `import type`
  zuletzt, jeweils alphabetisch, getrennt durch eine Leerzeile
- Backend: Ruff (`ruff check --fix`, Regel `I`); Gruppen:
  Standardbibliothek, externe Pakete, `app.…`

Python: jede Funktion erhält einen Docstring statt loser Kommentare
darüber. Ein Satz, was die Funktion tut; unter `Args:` eine Zeile
`name: kurzer Satz` pro Argument; unter `Returns:` (bzw. `Yields:`) ein
Satz zum Rückgabewert; `Raises:` nur bei bewusst ausgelösten Fehlern.
Ohne Argumente entfällt `Args:`. Einfache Funktionen (z. B. Routen, die
nur delegieren, oder kurze Helfer) erhalten nur ein bis zwei Sätze ohne
`Args:`/`Returns:`. Keine Leerzeilen zwischen den
Abschnitten und keine Bindestriche vor den Einträgen (Pylance rendert die
Einträge selbst als Liste; ein `- ` davor zerstört das Parsing).

```python
def read_csv_frame(source: BytesIO | Path) -> pl.DataFrame:
    """
    Read a CSV file into a DataFrame with typed columns.
    Args:
        source: Uploaded file content or path to a CSV file.
    Returns:
        The rows, with detected dates and common null markers as nulls.
    """
```

Imports im Backend: Funktionen eigener Module über das Modul importieren
und mit Punkt aufrufen (`from app.datasets import store` →
`store.register_dataset(...)`), damit die Zuständigkeit am Aufruf
sichtbar ist; keine Kurz-Aliase. Models und Types direkt importieren
(`from app.queries.models import ChartQueryRequest`). Externe Libraries
nach ihrer üblichen Konvention (`import polars as pl`).

Pydantic-Modelle erhalten einen einzeiligen Klassen-Docstring, gefolgt
von einer Leerzeile vor den Feldern; `models.py` wird mit
Abschnittsmarkern nach Endpoint bzw. Thema gegliedert. Klassen-Docstrings
werden Teil des JSON-Schemas: bei Request- und Result-Modellen erscheinen
sie nur in der API-Doku, bei den Action-Modellen in `app/ai/models.py`
sind sie die Beschreibungen, die Claude im Ask-Cevyn-Tool liest; dort nur
bewusst als Prompt-Änderung anpassen.

TypeScript: jede Funktion erhält einen JSDoc-Kommentar (`/** … */`)
statt loser `//`-Kommentare, auch nicht exportierte Helper, Hooks,
Komponenten und Handler innerhalb von Komponenten:

- kleine Funktionen: nur ein Satz;
- größere bzw. wichtige Funktionen: Zusammenfassung, bei Bedarf ein
  Satz zur Entscheidung, dazu `@param` je Parameter und `@returns` mit
  je einem kurzen Satz, analog zu `Args` und `Returns` in Python (im
  Editor per `/**` + Enter vorbefüllt);
- Konstanten und Types, die eine Erklärung brauchen, ebenfalls mit
  JSDoc statt `//`;
- einzelne Props und Felder eines Types erhalten keinen eigenen JSDoc;
  ihre Bedeutung steht im JSDoc der Komponente bzw. Funktion;
- Begründungen gehören in den JSDoc der Funktion; `//` innerhalb einer
  Funktion nur ausnahmsweise, wenn eine einzelne Zeile sonst
  missverständlich wäre.

```ts
/** Measures an element relative to the chart item. */
function getRectInItem(target: Element, item: HTMLElement): Rect {

/**
 * Places the format pencil next to an element where the chart has room.
 * @param element Element whose pencil is placed.
 * @param rect Bounds of the element inside the chart item.
 * @param itemWidth Width of the chart item.
 * @returns Above, after or before the element.
 */
function getFormatButtonPlacement(
```

Gilt für neuen und geänderten Code; bestehende Funktionen werden beim
Anfassen nachgezogen.

Properties in Options- und Konfigurationsobjekten alphabetisch sortieren,
wenn ihre Reihenfolge keine Semantik besitzt. Das gilt auch für neu
angelegte ECharts-Option-Builder.

Spreads und andere reihenfolgeabhängige Properties dort platzieren, wo das
beabsichtigte Überschreibungsverhalten erhalten bleibt. Lesbarkeit und
korrektes Verhalten haben Vorrang vor mechanischer Sortierung.

## 20. Issues und Labels

Punkte außerhalb des aktuellen Slices (Bugs, Features, Aufräumen,
Ideen) stehen als GitHub Issues im Repository. Die Liste zeigt nur
Titel und Labels, Details stehen im Issue. Die Reihenfolge der Slices
bleibt in `ROADMAP.md`.

Jedes Issue trägt genau ein Typ-Label, optional einen Bereich und genau
eine Priorität (außer `idea`):

| Label                                                      | Farbe               | Bedeutung                       |
| ---------------------------------------------------------- | ------------------- | ------------------------------- |
| `bug`                                                      | Rot                 | funktioniert nicht wie erwartet |
| `feature`                                                  | Blau                | neue Funktion, entschieden      |
| `design`                                                   | Teal                | Optik und UX-Feinschliff        |
| `tech-debt`                                                | Amber               | Aufräumen, Refactoring, Tests   |
| `idea`                                                     | Violett             | noch nicht entschieden          |
| `prio:high`, `prio:medium`, `prio:low`                     | Pink, dunkel → hell | Priorität, siehe unten          |
| `area:*`: charts, canvas, format, data, ask-cevyn, backend | Lindgrün            | Bereich im Produkt              |

Prioritäten gelten innerhalb des Milestones (`Alpha`, `MVP`; ohne
Milestone: Backlog):

- `prio:high`: muss ins Release dieses Milestones; bei Bugs: ein
  Workflow geht kaputt, Daten werden falsch angezeigt oder ein Tester
  merkt es sofort
- `prio:medium`: soll ins Release, wenn Zeit ist; blockiert nichts
- `prio:low`: kann warten

Neues Issue: kurzer Titel (höchstens etwa 70 Zeichen), zwei bis vier
Zeilen oder Stichpunkte; bei Bugs **Wo**, **Was passiert**,
**Erwartet**. Auf Slices der Roadmap mit ihrem Namen verweisen, nicht
mit der Nummer, weil sich die Nummern beim Einfügen verschieben.

```bash
gh issue create --title "Line-Labels überlappen bei vielen Punkten" \
  --label bug,area:charts,prio:medium --body "…"
gh issue list --label prio:high --milestone Alpha
```

Umgang:

- `prio:high`: Bugs vor dem nächsten Slice beheben; Kleines als
  Lückenfüller zwischen zwei Slices; Großes wird ein eigener Slice in
  `ROADMAP.md`, der auf das Issue verweist
- ein Commit oder PR mit `Fixes #<nr>` schließt das Issue beim Merge
- zum Ende eines Slices `is:open milestone:Alpha label:prio:high` und
  `is:open label:bug` durchsehen

## 21. Struktur- und Code-Regeln

Allgemeine Regeln für das ganze Repository. Wo Frontend und Backend
technisch verschieden sind, steht eine kurze Übersetzung je Seite. Jede
Regel hat eine Prüfung, per Werkzeug oder per Prüffrage; Regeln, die nur
in der Doku stehen, driften wieder auseinander.

Neuer Code folgt diesen Regeln ab sofort. Den Bestand stellt der Slice
„Refactoring: Struktur und Modelle vor der Persistenz“ (`ROADMAP.md`)
um.

### Prinzipien

| Nr. | Regel                                                                                                                                                                                                                                                                    | Prüfung                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| S1  | **Domäne zuerst:** Oben stehen Fachbereiche (`charts/`, `cards/`, `objects/`, `workspace/`, `datasets/`, `queries/`, `ai/`), keine Dateiarten.                                                                                                                           | Prüffrage im Review                                              |
| S2  | **Besitz bestimmt den Ort:** Was nur ein Teil nutzt, liegt bei ihm; nutzt es ein zweiter, wandert es zum nächsten gemeinsamen Ordner. Höchstens drei Ebenen unter der Domäne.                                                                                            | Prüffrage im Review                                              |
| S3  | **`shared` kennt keine Domäne** und enthält nur, was mindestens zwei Domänen nutzen.                                                                                                                                                                                     | ESLint-Grenzen, `import-linter`                                  |
| S4  | **Abhängigkeiten in eine Richtung:** Domänen nutzen `shared`, nie umgekehrt; eine Domäne greift nicht in die Interna einer anderen; keine Ringabhängigkeiten.                                                                                                            | ESLint-Grenzen, `import-linter`, `madge --circular`              |
| S5  | **Was sich zusammen ändert, liegt zusammen.** Frontend: Komponente, CSS und Test nebeneinander; `styles/` hält nur Tokens, Themes und Basis. Backend: `tests/` spiegelt die Struktur von `app/`.                                                                         | Prüffrage im Review                                              |
| S6  | **Objektarten unterscheidet nur ihr Bauplan:** Was je Objektart verschieden ist (Anlegen, Inhalt, Format-Panel, Abfrage, Titel, Style), steht in ihrem Eintrag in `objectDefinitions`; anderer Code fragt nicht nach `kind`.                                             | Suche nach `kind ===` außerhalb von `objects/`                   |
| C1  | **Eine Quelle je Wissen:** Jede Regel, jeder Standard, jede Tatsache steht an genau einer Stelle (Typ, Konstante, Registry); andere lesen sie.                                                                                                                           | `jscpd`, Prüffrage im Review                                     |
| C2  | **Ein Begriff pro Sache:** Dasselbe heißt überall gleich, in Frontend und Backend, in Typen, Funktionen und Texten (Glossar unten).                                                                                                                                      | Glossar, Prüffrage im Review                                     |
| C3  | **Explizit statt implizit:** Eine Bedeutung wird ausdrücklich übergeben, nicht aus einer Nebenwirkung erschlossen.                                                                                                                                                       | Prüffrage: Stimmt das noch, wenn jemand anderes das Objekt baut? |
| C4  | **Logik in Funktionen, Oberflächen dünn:** Komponenten und Router verdrahten; Berechnungen stecken in reinen Funktionen, die ohne UI und Server testbar sind.                                                                                                            | Tests (Vitest, pytest)                                           |
| C5  | **Die Rolle steht im Namen** (Namensgrammatik unten).                                                                                                                                                                                                                    | Prüffrage im Review                                              |
| C6  | **Bestehendes erweitern statt Sonderfall bauen** (`AGENTS.md`, „Reuse before creation“).                                                                                                                                                                                 | Prüffrage im Review                                              |
| C7  | **Zusammenführen nur bei gleichem Wissen:** Zwei Stellen, die gleich aussehen, aber aus verschiedenen Gründen geändert werden, bleiben getrennt; zusammengeführt wird ab dem zweiten echten Gebrauch.                                                                    | Prüffrage im Review                                              |
| C8  | **Defaults so früh wie möglich:** Ein Prop, der an jeder Aufrufstelle gleich wäre, setzt die Komponente selbst; Aufrufe übergeben nur, was sich unterscheidet.                                                                                                           | Prüffrage im Review                                              |
| M1  | **Einordnen vs. beschreiben:** Was Verhalten steuert, gehört an die Entität (z. B. `Field` mit Typ, Rolle, `native_grain`); was nur angezeigt wird, in ein eigenes Unterobjekt (`statistics`).                                                                           | Prüffrage im Review                                              |
| M2  | **Spec-Regeln für alles, was gespeichert wird:** Unterobjekte für Zusammengehöriges, `kind`-Unions, `null` heißt abgeleitet (wo nichts abzuleiten ist, heißt es „nicht gesetzt“, nie beides an einem Feld), `visible` statt Breite 0, gemeinsame Bausteine statt Kopien. | Prüffrage im Review, Prüfung der Spec vor der Persistenz         |
| P1  | **Jede Regel hat eine Prüfung;** was sich automatisch prüfen lässt, prüft die CI.                                                                                                                                                                                        | CI                                                               |

### Ebenen und Namensgrammatik im Frontend

Panels und Editoren bestehen aus Ebenen. Die Endung eines Namens sagt
die Ebene; jede Ebene setzt nur Bausteine der Ebenen darunter zusammen:

```text
Container   Panel, Editor        enthalten Elements bzw. Groups
  Element   ein Eintrag der Auswahl im Format-Panel, listet seine Groups
    Group   Kopf (Titel, Auge, ＋, Einklappen) und Rows
      Row   Controls nebeneinander, dazu Label und Aktion
        Control    verknüpft Primitives zu einem Wert
          Primitive  Button, Input, Popover und ihre Varianten
```

Ein Editor beginnt wieder bei Group.

Eine Basis ist die einzige Quelle für das, was ihre Ebene ausmacht.
Konkrete Komponenten bauen darauf auf und setzen ihre festen Props selbst
(C8).

| Ebene     | Endung                         | Basis                                  | Was die Basis festlegt                                                                                                                                                                             | Beispiele                                                                                                    | Ordner in `shared/ui/` |
| --------- | ------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Container | `…Panel`                       | `Panel`                                | Rand, Kopf, Einklappen                                                                                                                                                                             | `FormatPanel`, `BuildPanel`                                                                                  | `containers/`          |
| Container | `…Editor`                      | `Editor`                               | Inhalt eines Popovers: Abstand, Kopf; setzt die Gruppenebene zurück, Gruppen darin beginnen oben                                                                                                   | `PaintEditor`, `ColorEditor`                                                                                 | `containers/`          |
| Element   | `…Element`                     | –                                      | kein Markup: listet die Groups eines Eintrags der Auswahl im Format-Panel                                                                                                                          | `LegendElement`, `ContainerElement`                                                                          | – (in der Domäne)      |
| Group     | `…Group`                       | `Group`                                | Titel, Auge, ＋, Einklappen, Icon in der Icon-Spalte, ausgeblendet nur die Überschrift, Ziel für Fokus und Scrollen                                                                                | `ZoomGroup`, `StrokeGroup`                                                                                   | `groups/`              |
| Row       | `…Row`                         | `Row`                                  | Raster `1fr 1fr 24px`, Zeilentypen (Paar, Einzeln, Breit), optional Label, Aktion bzw. Minus in der Icon-Spalte                                                                                    | `PaintRow`, `BoxRow`                                                                                         | `rows/`                |
| Control   | `…Control`                     | keine Komponente, nur `.control-frame` | verknüpft Primitives zu einem bearbeiteten Wert                                                                                                                                                    | `PaintControl`, `SelectControl`, `SegmentedControl`, `NumberControl`                                         | `controls/`            |
| Primitive | Basis oder `…Button`, `…Input` | `Button`, `Input`, `Popover`           | `Button`: Optik, Arten (Text, Icon, Kachel, Swatch, Chip), Fläche (auch ohne, `ghost`) und `pressed`; `Input`: natives Eingabefeld, Modus live oder übernehmen; `Popover`: Auslöser und Aufklappen | `IconButton`, `SwatchButton`, `SelectButton`, `Chip`, `TextInput` (auch inline), `NumberInput`, `SelectMenu` | `primitives/`          |
| außerhalb | `…Tile`                        | `Tile`                                 | Kachel außerhalb der Panels, z. B. im Profil                                                                                                                                                       | `StatTile`, `DatasetTile`                                                                                    | `tiles/`               |
| Anzeige   | –                              | –                                      | nicht klickbar, außerhalb der Kette, von jeder Ebene nutzbar                                                                                                                                       | `EmptyState`, `MiniHistogram`, `SurfaceLayers`, `SurfaceBorder`, `IconBadge`, `OptionLabel`                  | `display/`             |

- **Nur nach unten:** Jede Ebene nutzt nur Ebenen darunter. Die Ordner
  unter `shared/ui/` folgen den Ebenen; die ESLint-Grenzen prüfen die
  Richtung. Fachliche Elemente, Groups, Rows und Editoren liegen in
  ihrer Domäne (z. B. `charts/format/`) und folgen derselben Richtung.
  Einzige Ausnahme ist das Popover (übernächste Regel).
- **Element:** genau ein Eintrag der Auswahl oben im Format-Panel und das
  Ziel von Cmd+Klick, z. B. Marks, Legende oder Achse (die Listen gibt es
  als `ChartFormatElement`, `CardFormatElement` und
  `ContainerFormatElement`). Ein Element hat keine Basis und kein eigenes
  Markup, es listet nur seine Groups. Die Elemente je Objektart stehen im
  Bauplan (S6); Auswahl und Cmd+Klick lesen dieselbe Liste. Elemente
  liegen in ihrer Domäne.
- **Varianten sind dünn:** Eine Variante (`IconButton`, `TextInput`,
  `SelectMenu`) setzt nur feste Props und ruft ihre Basis auf; Optik und
  Verhalten stehen einmal in der Basis.
- **Primitive ist nur, was man klickt oder tippt:** Ein Schalter, der
  gedrückt bleibt, setzt `pressed` an `Button` (Zustand und Optik), z. B.
  `CommandButton`. Ein `Input` arbeitet live (jede Eingabe gilt sofort,
  z. B. eine Suche) oder übernehmend (Entwurf; Enter oder Verlassen
  übernimmt, Escape bricht ab, z. B. eine Zahl oder ein Titel).
- **Anzeige liegt außerhalb der Kette:** Was nur anzeigt und nicht
  klickbar ist, z. B. ein Hinweis bei leerer Ansicht, ein Icon mit Label
  oder eine kleine Verteilung, liegt in `display/` und darf von jeder
  Ebene genutzt werden; Anzeige nutzt selbst nur Anzeige.
- **Ein Control unterscheidet sich durch Verhalten, nicht durch Inhalt:**
  Gleiches Verhalten mit anderen Optionen ist dasselbe Control mit
  anderer Konfiguration. Ausrichtung, Schriftgewicht und Position sind
  `SegmentedControl`, ein Winkel ist `NumberControl` mit Einheit °,
  Palette und Datumsformat sind `SelectControl`.
- **Optik als Klasse, Verhalten als Komponente:** Controls haben keine
  Basis-Komponente; ihr Rahmen ist die Klasse `.control-frame`, Swatch
  mit Text die Klasse `.swatch-control`.
- **Auslöser, Aufklappen und Inhalt getrennt:** Zahnrad oder Swatch ist
  ein Button, das Aufklappen ein `Popover`, der Inhalt ein `Editor`; ein
  Control setzt sie zusammen, das Zahnrad einer Zeile setzt die `Row`
  über `details` selbst zusammen. Das Popover hält den Offen-Zustand
  selbst (von außen steuerbar, z. B. für einen Editor, der nach dem
  Hinzufügen offen sein soll) und gibt das Schließen per Context an den
  Editor; Kopf und Schließen-X gehören zum Editor.
- **Ein Popover beginnt eine neue Hierarchie:** Über ein Popover darf
  jede Ebene einen Editor öffnen. Sie importiert dafür nur den leeren
  Rahmen `Editor`; den fachlichen Inhalt (z. B. `PaintEditor`) reicht der
  Aufrufer herein, er wird nie importiert. Sonst entstehen Ringe, z. B.
  `PaintControl` → `PaintEditor` → Stopp-Zeile → `PaintControl`.
- **Eine Komponente rendert nur ihre eigene Ebene:** Ein `…Group`
  rendert seine `Group` selbst; ein Aufrufer legt nie eine `Group` um
  eine Komponente herum, und ein Element rendert nie eine.
- **Keine Plural-Ebenen:** Was in der Auswahl steht, ist ein Element;
  wiederverwendet wird immer eine ganze Group (z. B. `TextGroup`), nie
  ein Bündel von Zeilen oder Gruppen. Die Reihenfolge der Groups folgt
  der festen Reihenfolge in `DESIGN_SYSTEM.md`.
- **Eine `Group` in einer `Group` wird Untergruppe:** Sie erkennt das
  über React-Context und zeigt statt des Titels in Großbuchstaben eine
  kleine Überschrift; Auge, ＋ und Icon-Spalte bleiben gleich.
  Höchstens zwei Ebenen. Ein `Editor` beginnt wieder auf oberster Ebene,
  weil der Context auch durch das Portal eines Popovers reicht.
  Untergruppen gibt es nur noch bis zum Design-Slice; neue entstehen
  nicht.
- **`Field` meint nur Datenfelder:** Ein Name mit `Field` bzw. `field`
  zeigt im Frontend ein Datenfeld (`FieldList`, `.field-chip`), nie ein
  Control.
- **Ausnahmen** stehen außerhalb der Ebenen und nur in dieser Liste:
  Fachansichten (`DataTable`, Canvas, `ObjectFrame`, `EditableText`,
  Galerien aus Kachel-Buttons wie `ObjectPicker` und `StyleGallery`) und
  die Farbfläche mit Hue-Regler im `ColorEditor`. Was sich sonst nicht
  einordnen lässt, wird so umgebaut, dass es passt.
- **Funktionen:** `use…` (Hook), `create…` bzw. `build…` (erzeugt
  Neues), `get…` (leitet ab), `is…` bzw. `has…` (Ja/Nein), `format…`
  (Text für Menschen), `parse…` (liest Eingaben), `…Definition` bzw.
  Registry (Konfiguration je Typ); im Backend dieselben Rollen in
  `snake_case` (`build_…`, `get_…`, `validate_…`).

### Glossar

Erste Einträge; neue Begriffe kommen hinzu, sobald zwei Namen für
dasselbe auffallen (C2).

| Begriff         | Bedeutung                                                                                            | nicht                                        |
| --------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Gruppe (Group)  | Abschnitt mit Titel im Format- oder Build-Panel, auch einklappbar                                    | Widget, Section                              |
| Control         | verknüpft Primitives zu einem bearbeiteten Wert in einer Zeile                                       | Field, Input                                 |
| Input           | natives Eingabefeld für Text oder Zahl (Primitive)                                                   | Field, Control                               |
| Primitive       | `Button`, `Input` oder `Popover` und ihre Varianten; kleinste Ebene, nur was man klickt oder tippt   | Atom                                         |
| Anzeige         | nicht klickbarer Baustein außerhalb der Ebenen, z. B. `EmptyState` (`shared/ui/display/`)            | Primitive, Feedback                          |
| Element         | formatierbarer Teil eines Objekts, ein Eintrag der Auswahl im Format-Panel (Marks, Legende, Achse …) | Section, Groups                              |
| Details         | Inhalt hinter einem Auslöser (Zahnrad oder Zusammenfassung), immer ein `Editor`                      | Settings, Options                            |
| Field           | Spalte eines Datasets (`Field`, im Frontend `DataField`); nur in dieser Bedeutung                    | Column, Control                              |
| Tile            | Kachel, z. B. im Profil oder in der Auswahl der Charttypen                                           | Widget, Card                                 |
| Card            | Objekttyp mit einem aggregierten Wert                                                                | Tile                                         |
| grain           | Zeitraster (Tag, Woche, Monat, Quartal, Jahr)                                                        | granularity                                  |
| direction       | Sortierrichtung `asc` bzw. `desc`                                                                    | order                                        |
| leere Kategorie | ein Wert ohne Kategorie; ein Name an einer Stelle, wird im Refactoring festgelegt                    | `''`, `(empty)`, `No category` nebeneinander |

### Werkzeuge

| Werkzeug             | Prüft                                                 | Seite    | Aufruf                     |
| -------------------- | ----------------------------------------------------- | -------- | -------------------------- |
| ESLint-Grenzen       | S3, S4, Ebenen in `shared/ui`                         | Frontend | `npm run check:boundaries` |
| `import-linter`      | S3, S4                                                | Backend  | `uv run lint-imports`      |
| `madge --circular`   | Ringabhängigkeiten (S4)                               | Frontend | `npm run check:cycles`     |
| `knip`               | Ungenutztes (C1)                                      | Frontend | `npm run check:unused`     |
| `jscpd`              | Kopien (C1, C7)                                       | beide    | `npm run check:copies`     |
| `openapi-typescript` | API-Typen aus dem Backend erzeugt statt von Hand (C1) | beide    | Teil 7 des Refactorings    |
| Vitest, pytest       | Logik (C4)                                            | beide    | `npm run test`, `pytest`   |

Eingerichtet werden sie im Refactoring-Slice, in der CI laufen sie ab
„Alpha-Infrastruktur und Vollbild“.
