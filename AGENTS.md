# Cevyn – Agent Instructions

Diese Datei definiert die permanenten Arbeitsregeln für Coding Agents,
die an Cevyn arbeiten.

Die Dokumentation unter `/docs` ist Teil der Codebase und dient als
Source of Truth für Produkt, Architektur, Design und Entwicklung.

## 1. Vor jeder Änderung

Vor einer Implementierung:

1. Bestehende Implementierung analysieren.
2. Relevante Dateien und Abhängigkeiten identifizieren.
3. Nach bestehenden Komponenten, Styles, Hooks, Utilities, Types und
   Patterns suchen.
4. Relevante Dokumentation unter `/docs` lesen.
5. Bestehende Architektur bevorzugen und nur gezielt erweitern.

Keine parallele oder duplizierte Implementierung erstellen, wenn eine
bestehende Abstraktion sinnvoll erweitert werden kann.

Bevorzugt:

`ExistingComponent + new prop`

statt:

`NewSpecialCaseComponent`

## 2. Dokumentation

Folgende Dateien sind die Source of Truth:

- Produkt und langfristige Richtung:
  `docs/PRODUCT_VISION.md`
- Technische Architektur und Datenflüsse:
  `docs/ARCHITECTURE.md`
- UI, Designsystem und wiederverwendbare Controls:
  `docs/DESIGN_SYSTEM.md`
- Coding-, Workflow- und Git-Regeln:
  `docs/DEVELOPMENT.md`
- Aktueller Entwicklungsstand und Prioritäten:
  `docs/ROADMAP.md`

Bei einer Aufgabe nur die dafür relevanten Dokumente zusätzlich lesen.

## 3. Implementierungsverhalten

Code nur verändern, wenn der Nutzer ausdrücklich eine Implementierung
oder Codeänderung verlangt.

Diskussionen über:

- Architektur,
- UX,
- mögliche Features,
- Produktideen,
- Refactorings,
- Alternativen

sind nicht automatisch eine Erlaubnis, Code zu verändern.

Bei größeren oder architekturrelevanten Änderungen zuerst die
bestehende Struktur analysieren und einen kleinen Implementierungsplan
formulieren.

Keine unnötigen Rewrite-Refactorings durchführen.

Änderungen möglichst fokussiert auf die aktuelle Aufgabe begrenzen.

## 4. Reuse before creation

Vor dem Erstellen einer neuen:

- React-Komponente,
- CSS-Klasse,
- Utility,
- Hook,
- Type-Definition,
- Helper-Funktion,
- Inspector-Control-Komponente

zuerst nach einer bestehenden Lösung suchen.

Generische bestehende Komponenten bevorzugt über Props erweitern.

Gemeinsames Styling zentral halten und keine nahezu identischen
One-off-CSS-Regeln erzeugen.

## 5. Architektur

Cevyn besitzt ein eigenes Domain Model.

Externe Libraries sind Implementierungsdetails und nicht das
Produktmodell.

Insbesondere gilt:

`UI → ChartSpec → ECharts Adapter → EChartsOption → ECharts`

Keine ECharts-spezifischen Optionen unkontrolliert über React-
Komponenten verteilen.

Weitere Architekturregeln stehen in:

`docs/ARCHITECTURE.md`

## 6. Dokumentationspflege

Dokumentation ist Bestandteil eines abgeschlossenen Milestones.

Nach einer relevanten Änderung prüfen, ob Dokumentation betroffen ist.

Nur tatsächlich betroffene Dokumente aktualisieren.

### `docs/ROADMAP.md`

Aktualisieren, wenn:

- ein Feature begonnen wurde;
- ein Feature abgeschlossen wurde;
- ein Milestone abgeschlossen wurde;
- sich Prioritäten wesentlich ändern;
- ein geplanter Scope hinzugefügt oder entfernt wird.

### `docs/ARCHITECTURE.md`

Aktualisieren, wenn:

- sich Architektur verändert;
- eine neue Architekturebene eingeführt wird;
- sich ein wichtiger Datenfluss verändert;
- zentrale Domain Models verändert werden;
- sich Verantwortlichkeiten zwischen Frontend und Backend verändern;
- eine dauerhafte Architekturentscheidung getroffen wird.

Nicht für gewöhnliche Implementierungsdetails aktualisieren.

### `docs/DESIGN_SYSTEM.md`

Aktualisieren, wenn:

- eine wiederverwendbare UI-Komponente eingeführt wird;
- eine bestehende Komponente eine wichtige generische Fähigkeit erhält;
- sich ein Designprinzip ändert;
- ein neues wiederverwendbares Control-Pattern etabliert wird.

Keine einmaligen visuellen Tweaks dokumentieren.

### `docs/PRODUCT_VISION.md`

Nur aktualisieren, wenn:

- sich der Produktscope verändert;
- ein neuer großer Workspace oder Produktbereich beschlossen wird;
- sich ein grundlegendes Produktprinzip ändert.

Nicht verändern, nur weil ein bestehendes Feature implementiert wurde.

### `docs/DEVELOPMENT.md`

Aktualisieren, wenn:

- Coding Conventions geändert werden;
- sich der Entwicklungsworkflow ändert;
- Verification Commands geändert werden;
- Git-Regeln geändert werden.

### `AGENTS.md`

Nur verändern, wenn sich permanente Regeln für Coding Agents ändern.

## 7. Dokumentationswahrheit

Niemals Funktionalität als abgeschlossen dokumentieren, nur weil sie
Teil eines Prompts oder Plans war.

Ein Feature darf erst als implementiert dokumentiert werden, wenn das
entsprechende Verhalten tatsächlich in der Codebase vorhanden und
sinnvoll verifiziert ist.

Diskutierte Möglichkeiten sind keine beschlossenen
Architekturentscheidungen.

Zwischen folgenden Zuständen unterscheiden:

- Idee
- geplant
- in Arbeit
- implementiert
- später

## 8. Verification

Nach relevanten Codeänderungen die in
`docs/DEVELOPMENT.md` definierten Checks durchführen.

Fehler, die durch die aktuelle Änderung verursacht wurden, vor
Abschluss der Aufgabe beheben.

## 9. Git Checkpoints

Nach einem sinnvollen abgeschlossenen:

- Feature,
- Bugfix,
- Refactoring,
- Architektur-Milestone

selbstständig einen Git-Checkpoint vorschlagen.

Nicht automatisch committen oder pushen, sofern der Nutzer dies nicht
ausdrücklich verlangt.

Der Vorschlag soll als kompakter Copy-Paste-Block erfolgen:

```bash
npm run format
npm run build
git add . && git commit -m "<type>: <description>" && git push
```

Commit Message passend zur Änderung wählen.

Keine Git-Checkpoints mitten in einer noch unvollständigen Änderung
vorschlagen.
