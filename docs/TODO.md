# Cevyn – To-do

Punkte, die während eines Slices auffallen, aber nicht zu dessen Scope
gehören. Sie werden hier gesammelt, damit der aktuelle Slice fokussiert
bleibt.

Ein Punkt verlässt diese Liste, wenn er erledigt ist oder als geplanter
Scope in `docs/ROADMAP.md` übernommen wird.

## Inspector auf plain Sections umstellen

- Ziel: dieselbe ruhige Optik wie im Build Panel, also Sections ohne
  eigene Widget-Fläche, Trennung per Haarlinie, keine Widgets in
  Widgets
- Vorbild: `CollapsibleSection` mit `variant="plain"` inkl. Header-Stil
  (Versalien, sekundär, Hover primär, Icon in Akzentfarbe) in
  `CollapsibleSection.css`
- Achtung: Der Inspector nutzt `InspectorWidget`, nicht
  `CollapsibleSection` (eigener Header, Chevron, Subproperties);
  zuerst klären, ob `InspectorWidget` eine plain-Variante bekommt oder
  beide Komponenten zusammengeführt werden
- Einrückung einheitlich über `--indent-nested`;
  `.inspector-widget-subproperties` noch auf das Token umstellen

## Weitere Dashboard-Einstellungen

- Canvas-Hintergrund als Dashboard-Einstellung, analog zu den
  Container-Presets (Glass, Surface, None, eigene Farbe)
- Innen-Padding der Canvas als Teil von `DashboardLayout`
- beides im Layout-Widget des `DashboardInspector`, undo-fähig über
  `dashboard/updateLayout` bzw. eine passende Dashboard-Action
