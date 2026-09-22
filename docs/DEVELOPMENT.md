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

Nach relevanten Frontend-Änderungen mindestens:

```bash
npm run format
npm run build
```

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
npm run format
npm run build
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
