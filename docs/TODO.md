# Cevyn – To-do

Punkte, die während eines Slices auffallen, aber nicht zu dessen Scope
gehören. Sie werden hier gesammelt, damit der aktuelle Slice fokussiert
bleibt.

Ein Punkt verlässt diese Liste, wenn er erledigt ist oder als geplanter
Scope in `docs/ROADMAP.md` übernommen wird.

## Globale Shortcuts zentralisieren

- Globale Shortcuts sind verteilt: Chart-Befehle (⌘D, Entf, Pfeile,
  Escape) in `ChartItem`, Panel-Toggles (⌘B, ⌘I) in
  `useWorkspaceLayout`.
- Ziel ist eine zentrale Command-Registry, die Shortcuts und
  Toolbar-Buttons aus derselben Befehlsliste speist.
- Sinnvoll zusammen mit Undo/Redo, da beides Dashboard-Befehle sind.
- Control-lokale Tastaturbedienung (Slider, ScrubbableNumber,
  RotationDial, InlineTextInput, InspectorTabs) bleibt in den
  Komponenten.
