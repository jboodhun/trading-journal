import { Select as BaseSelect } from '@base-ui-components/react/select'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  ariaLabel: string
}

export function Select({ value, onChange, options, ariaLabel }: SelectProps) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      onValueChange={(next) => {
        if (typeof next === 'string') onChange(next)
      }}
    >
      <BaseSelect.Trigger className="select-trigger" aria-label={ariaLabel}>
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <ChevronDown size={15} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6}>
          <BaseSelect.Popup className="select-popup">
            {options.map((option) => (
              <BaseSelect.Item key={option.value} value={option.value} className="select-item">
                <BaseSelect.ItemIndicator>
                  <Check size={14} />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
