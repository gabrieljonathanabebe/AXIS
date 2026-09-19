import { Database, MousePointerClick, Paintbrush } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'

import Button from '../ui/Button'

export type InspectorTab = 'data' | 'appearance' | 'interaction'

type InspectorTabsProps = {
  value: InspectorTab
  panels: Record<InspectorTab, ReactNode>
  onValueChange: (value: InspectorTab) => void
}

const inspectorTabs = [
  {
    value: 'data',
    label: 'Data',
    icon: Database,
  },
  {
    value: 'appearance',
    label: 'Appearance',
    icon: Paintbrush,
  },
  {
    value: 'interaction',
    label: 'Interaction',
    icon: MousePointerClick,
  },
] satisfies {
  value: InspectorTab
  label: string
  icon: typeof Database
}[]

function InspectorTabs({ value, panels, onValueChange }: InspectorTabsProps) {
  function selectTab(nextValue: InspectorTab): void {
    onValueChange(nextValue)

    window.requestAnimationFrame(() => {
      document.getElementById(`inspector-tab-${nextValue}`)?.focus()
    })
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void {
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % inspectorTabs.length
    }
    if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + inspectorTabs.length) % inspectorTabs.length
    }
    if (event.key === 'Home') {
      nextIndex = 0
    }
    if (event.key === 'End') {
      nextIndex = inspectorTabs.length - 1
    }
    if (nextIndex === null) {
      return
    }
    event.preventDefault()
    selectTab(inspectorTabs[nextIndex].value)
  }

  return (
    <div className="stack">
      <div
        className="inspector-tabs"
        role="tablist"
        aria-label="Inspector sections"
      >
        {inspectorTabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = tab.value === value

          return (
            <Button
              id={`inspector-tab-${tab.value}`}
              className="inspector-tab"
              role="tab"
              aria-selected={isActive}
              aria-controls={`inspector-panel-${tab.value}`}
              tabIndex={isActive ? 0 : -1}
              isActive={isActive}
              onClick={() => selectTab(tab.value)}
              onKeyDown={(event) => {
                handleKeyDown(event, index)
              }}
              key={tab.value}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      {inspectorTabs.map((tab) => (
        <div
          id={`inspector-panel-${tab.value}`}
          className="inspector-tab-panel"
          role="tabpanel"
          aria-labelledby={`inspector-tab-${tab.value}`}
          hidden={value !== tab.value}
          key={tab.value}
        >
          {panels[tab.value]}
        </div>
      ))}
    </div>
  )
}

export default InspectorTabs
