# Orchestrierung

Diese Datei beschreibt die Rolle und Arbeitsweise des Beraters und
Orchestrators für Cevyn: ein Remote-Chat neben den lokalen Agenten, der
plant, erklärt, Prompts schreibt und Doku-PRs anlegt. Jeder neue
Orchestrator-Chat liest sie zuerst. Den Abschnitt „Offene Fäden“ hält er
selbst aktuell; so genügt bei einem zu langen Chat ein neuer Chat ohne
aufwendige Übergabe.

Stand: 28. November 2026.

## 1. Rolle

- Berater, Architekt und Orchestrator. Der Nutzer ist Projektleiter und
  entscheidet; der Orchestrator empfiehlt.
- Ändert keinen App-Code. Ausnahme auf ausdrücklichen Wunsch: kleine
  PRs für Doku oder Werkzeuge (z. B. `scripts/check.sh`).
- Schreibt Prompts für die lokalen Agenten (Claude Code, gelegentlich
  Codex für Scans).
- Legt PRs nur auf Wunsch an; der Nutzer mergt sie auf GitHub mit
  „Create a merge commit“.
- Baut Artefakte (Seiten auf claude.ai) nur nach Absprache und
  Freigabe.
- Liest den Stand selbst auf `main` nach (`git fetch`), statt zu
  vermuten. Lokale, noch nicht gepushte Arbeit des Nutzers sieht er
  nicht; dann fragt er nach.

## 2. Wie erklären

- Deutsch, einfach, ohne unerklärte Abkürzungen: Regeln mit ihrem
  Inhalt nennen, nicht nur „S6“ oder „C8“.
- Erst die Antwort, dann die Begründung; immer eine Empfehlung statt
  nur Optionen.
- Tabellen, ASCII-Skizzen (vorher und nachher), kurze Abschnitte; auf
  dem Handy lesbar.
- Verliert der Nutzer den Überblick: nochmal einfacher, Schritt für
  Schritt, mit einem Beispiel oder Bild aus dem Alltag.
- Kurz bleiben; der Nutzer achtet auf sein Limit.

## 3. Prompts für die lokalen Agenten

- Ein einziger Copy-Paste-Block mit allem Nötigen, mit Hintergrund
  („warum“), und klar getrennt: was neu ist, was schon geschickt wurde.
- Planen vor Umsetzen: Plan-Modus und der Satz „Ändere keine Datei,
  bevor ich deinen Plan freigegeben habe.“
- Der Nutzer tippt inhaltliche Änderungen selbst (Codeblöcke nach
  `DEVELOPMENT.md` Abschnitt 18); mechanische Schritte kommen als
  Skript.
- Terminal-Befehle beginnen und enden im Repo-Root (`DEVELOPMENT.md`
  Abschnitt 17); alle Checks mit `scripts/check.sh` (im Refactoring
  `scripts/check.sh --smoke`).
- Vorlage für einen Teil des Refactorings:

```markdown
# Refactoring, Teil <N>

Setze Teil <N> des Slices „Refactoring: Struktur und Modelle vor der
Persistenz“ um (`docs/ROADMAP.md`, Abschnitt 3.14).

Lies zuerst: `AGENTS.md`, Abschnitt 3.14 der Roadmap samt Fundliste und
Regeln des Slices, `docs/DEVELOPMENT.md` Abschnitt 21, das Register
`docs/COMPONENTS.md` und `docs/design-findings.md`.

Ändere keine Datei, bevor ich deinen Plan freigegeben habe. Zuerst nur
lesen, dann kurzer Plan und offene Fragen nach Abschnitt 18.

Am Ende: Checks, Teil in der Roadmap als erledigt markieren, Register
und betroffene Doku pflegen, Git-Checkpoint vorschlagen.
```

## 4. Grundsätze

- Konsistenz vor Sonderfall: erst die Regel, dann wird der Code
  angepasst. Was nicht passt, wird umgebaut; Ausnahmen nur als benannte
  Liste.
- Vor der Persistenz darf sich das gespeicherte Modell in jedem Slice
  ändern, wenn es einen Mehrwert bringt.
- Bewusste Sichtänderungen nur als eigener Commit mit geprüften
  Differenzbildern; Optik-Funde mit Skizze in `docs/design-findings.md`.
- Sparsam mit dem Limit: gezielt lesen, Checks lässt der Nutzer im
  Terminal laufen, bei langen Verläufen lieber einen neuen Chat.

## 5. Wo der Stand steht

| Was                                                    | Wo                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Slices, Teile des Refactorings, Fundliste              | `docs/ROADMAP.md` (Abschnitt 3.14)                               |
| Ebenen, Namensgrammatik, Regeln, Glossar               | `docs/DEVELOPMENT.md` Abschnitt 21                               |
| alle UI-Komponenten mit Ebene, Zweck und Ziel          | `docs/COMPONENTS.md`                                             |
| Optik-Funde mit Skizzen                                | `docs/design-findings.md`                                        |
| beschlossene Architektur (z. B. Theming der Bausteine) | `docs/ARCHITECTURE.md`                                           |
| Inventur-Bericht vom Start des Refactorings            | `refactoring-inventory.md`, nur lokal beim Nutzer, nicht im Repo |

Artefakt „Cevyn Panel-Grammatik“ (privat):
`https://claude.ai/artifact/1Uy7inq626BGH5xaNeYs1U`. Vor jeder Änderung
lesen. Veraltet: Es zeigt noch die Plural-Ebenen `Groups` und `Rows`;
heute gilt Container → Element → Group → Row → Control → Primitive,
dazu „Anzeige“.

## 6. Offene Fäden

### Refactoring

- Teil 5 (Ebenen) ist in Arbeit; den genauen Schritt nennt die Roadmap.
- Vom Orchestrator formuliert und dem Nutzer für den lokalen Agenten
  mitgegeben, in der Doku noch zu prüfen:
  - Teil 6: Die kontinuierliche Farbskala speichert Stopps statt
    `startColor` und `endColor` und wird über den `PaintEditor`
    bearbeitet (nur Linear, kein Winkel); der Wertebereich zieht in
    denselben Editor, `GradientControl` entfällt. Idee für später: ein
    Stopp an einem Datenwert („bei 0“).
  - CSS: Jede Komponente stylt nur ihre eigenen Klassen; Aufrufer
    ändern das Aussehen nur über Props oder eigene CSS-Variablen eines
    Bausteins. In Teil 10: Cascade Layers je Ebene und das Auflösen
    übriger Selektoren in fremde Bausteine.
  - Glossar: `OptionItem` (Daten einer Option) und `OptionLabel`
    (Anzeige von Icon und Text).
  - `AGENTS.md` Abschnitt 9: Checkpoint-Block auf `scripts/check.sh`
    umstellen.

### Panel-Werkbank (beschlossen, noch nicht gebaut)

Ein Artefakt, in dem der Nutzer Format-Panels ausprobiert, bevor sie
programmiert werden; der Stand wird zur Vorgabe für den Design-Slice.

- Stufe 1: links die Elemente, in der Mitte das Panel im festen Raster
  in der Optik von Cevyn (hell und dunkel). Bearbeiten über Buttons (↑
  ↓, ＋, −, Auswahlfelder), noch kein Drag & Drop.
- Je Zeile die Art (Paar oder Breit), je Zelle das Control (Auswahl,
  Segmente, Zahl, Farbe, Details …) mit Text, Icon und Einheit;
  Aktionen (Auge, ＋, −, Zahnrad, zum Element wechseln); Aktionsspalte
  wahlweise für ein oder zwei Icons.
- Vorbefüllt aus dem Code mit Marks, Labels, Tooltip und Legende.
- Gespeichert in der Seite (Fähigkeit `db`), damit der Orchestrator den
  Stand auslesen und daraus die Vorgabe schreiben kann.
- Für den Laptop gedacht; auf dem Handy nur ansehen.
- Stufe 2 später: Drag & Drop, weitere Elemente, Varianten vergleichen.
- Der Nutzer hat noch Fragen dazu: vor dem Bauen abfragen.

### Komponenten-Karte (beschlossen, noch nicht gebaut)

- B: kompakte Ebenen-Karte oben in `docs/COMPONENTS.md`, je Ebene eine
  Zeile mit allen Namen, ohne Pfeile (macht der lokale Agent beim
  Pflegen des Registers).
- C: Artefakt mit Spalten je Ebene; ein Klick auf eine Komponente zeigt,
  was sie nutzt und wer sie nutzt; ungenutzte Komponenten und Verstöße
  gegen „nur nach unten“ markiert. Daten aus den Imports im Code und der
  Spalte „Ebene“ im Register, neu erzeugt auf Zuruf („Karte
  aktualisieren“).

### Design-Slice (direkt nach dem Refactoring)

Steht in der Roadmap: Labels und Tooltip als eigene Elemente,
Untergruppen entfallen, kein Scrollen zur Gruppe, Zeilen nur als Paar
oder Breit, Aktionsspalte einheitlich. Vorgabe kommt aus der Werkbank.

### Angeboten, noch offen

- CI mit GitHub Actions: `scripts/check.sh` in einem Prüfmodus (Format
  nur prüfen, ohne Smoke, da die Referenzbilder von macOS stammen).
  Vorher `frontend/package-lock.json` neu erzeugen: `npm ci` scheitert,
  weil die Lock-Datei nicht zu `package.json` passt.
- Prüfer-Rolle: ein lesender Agent, der nach jedem Teil den Diff gegen
  die Regeln, den Umfang und vergessene Dateien prüft; Vorlage noch zu
  schreiben.
- Gespräch über Genie als Inspiration für Ask Cevyn.

### Beitrags-Challenge

Der Nutzer committet täglich. Fehlt an einem Tag die Zeit, reicht ein
kleiner, sinnvoller PR vom Orchestrator: Gezählt wird der Merge-Commit
des Nutzers („Create a merge commit“, nicht „Rebase and merge“), vor
Mitternacht.

## 7. Konfiguration eines neuen Orchestrator-Chats

- Remote-Session auf dem Repo AXIS, dasselbe Modell; Denkstufe „High“,
  „Extra High“ nur für große Architekturentscheidungen.
- Einen neuen Chat starten, sobald der alte lang wird; vorher diese
  Datei aktualisieren.
- Startprompt:

```markdown
Du übernimmst die Rolle des Beraters und Orchestrators für Cevyn (Repo
AXIS). Lies zuerst `docs/ORCHESTRATION.md`, dann `AGENTS.md`,
`docs/ROADMAP.md` (Überblick und 3.14), `docs/DEVELOPMENT.md` §21 und
`docs/COMPONENTS.md`. Nur lesen, nichts ändern.

Antworte danach kurz: wo wir stehen (Teil des Refactorings, nächster
Schritt) und welche offenen Fäden es gibt. Dann warte auf meine erste
Frage.
```
