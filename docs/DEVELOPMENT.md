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
- Inspector
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

## 12. Icons

Primäres Icon-System:

`Lucide React`

Für spezialisierte Visualisierungsicons können eigene SVGs verwendet
werden.

Diese sollen sich visuell an Lucide orientieren.

Wenn sinnvoll, eigene Icons über `createLucideIcon()` integrieren.

## 13. Verification

Nach relevanten Frontend-Änderungen mindestens, im Ordner `frontend/`:

```bash
npm run format
npm run build
```

`npm run format` formatiert neben dem Frontend auch `docs/`, `AGENTS.md`
und `README.md`.

Bei der Arbeit in Vertical Slices werden diese beiden Befehle einmalig
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
(cd frontend && npm run format && npm run build)
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

## 18. Vertical Slices und Chat-Übergaben

Ein Vertical Slice wird innerhalb eines einzelnen Chats bearbeitet.

Innerhalb eines Slices in wenigen sinnvollen Implementierungsblöcken
arbeiten. Ein Block soll einen zusammenhängenden Teil des Datenflusses
oder Verhaltens abdecken und einen nachvollziehbaren Zwischenstand
erzeugen.

Nicht jede einzelne Zeile als eigenen Schritt behandeln. Gleichzeitig
nicht den gesamten Slice in einem einzigen großen Schritt umsetzen.

Wenn der Nutzer den Anwendungscode selbst eingibt:

- pro Block konkrete Dateipfade und zusammenhängenden Code angeben;
- jede einzelne Codeergänzung als eigenen Codeblock formulieren, auch
  einzeilige Änderungen wie Imports oder Props;
- direkt über jedem Codeblock Datei und genaue Einfügestelle nennen,
  bezogen auf benachbarten bestehenden Code („nach …“, „ersetzen …“);
- Dateipfade als klickbaren Markdown-Link relativ zum Repo-Root
  angeben, bei bestehenden Dateien mit Zeilenanker auf die
  Einfügestelle, z. B.
  `[createAxesOptions.ts:97](frontend/src/chart/echarts/createAxesOptions.ts#L97)`
  oder für einen Bereich `#L97-L99`; neue Dateien ohne Zeilenanker;
- Zeilennummern vor jedem Block aus dem aktuell gespeicherten Stand
  bestimmen, da sie sich durch vorherige Blöcke verschieben;
- keinen Code in Fließtext oder Aufzählungspunkte packen;
- bei Ersetzungen den vollständigen neuen Abschnitt zeigen;
- nach jedem Codeblock in wenigen kurzen Stichpunkten erklären, was
  passiert: aus Review- und Architektursicht (Verantwortung,
  Datenfluss, Entscheidung, Auswirkung), nicht Zeile für Zeile und
  ohne Syntax-Erklärungen; Ziel ist Überblick ohne langes Lesen;
- Antworten insgesamt knapp halten;
- nach dem Block den gespeicherten Ist-Zustand prüfen;
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
und mit Punkt aufrufen (`from app import store` →
`store.register_dataset(...)`), damit die Zuständigkeit am Aufruf
sichtbar ist; keine Kurz-Aliase. Models und Types direkt importieren
(`from app.models import ChartQueryRequest`). Externe Libraries nach
ihrer üblichen Konvention (`import polars as pl`).

Pydantic-Modelle erhalten einen einzeiligen Klassen-Docstring, gefolgt
von einer Leerzeile vor den Feldern; `models.py` wird mit
Abschnittsmarkern nach Endpoint bzw. Thema gegliedert. Klassen-Docstrings
werden Teil des JSON-Schemas: bei Request- und Result-Modellen erscheinen
sie nur in der API-Doku, bei den Action-Modellen in `app/ai/models.py`
sind sie die Beschreibungen, die Claude im Ask-Cevyn-Tool liest; dort nur
bewusst als Prompt-Änderung anpassen.

TypeScript: exportierte Funktionen, Hooks und Komponenten erhalten einen
einzeiligen JSDoc-Kommentar (`/** … */`). `@param` und `@returns` nur,
wenn sie über die Types hinaus etwas aussagen. Kommentare innerhalb von
Funktionen nur für nicht offensichtliche Entscheidungen.

Properties in Options- und Konfigurationsobjekten alphabetisch sortieren,
wenn ihre Reihenfolge keine Semantik besitzt. Das gilt auch für neu
angelegte ECharts-Option-Builder.

Spreads und andere reihenfolgeabhängige Properties dort platzieren, wo das
beabsichtigte Überschreibungsverhalten erhalten bleibt. Lesbarkeit und
korrektes Verhalten haben Vorrang vor mechanischer Sortierung.
