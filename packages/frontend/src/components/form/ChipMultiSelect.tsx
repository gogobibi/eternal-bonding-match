interface Props<T extends string> {
  options: readonly T[]
  value: readonly T[] | undefined
  onChange: (v: T[]) => void
  size?: 'sm' | 'md'
}

export default function ChipMultiSelect<T extends string>({ options, value, onChange, size = 'md' }: Props<T>) {
  const selected = value ?? []
  const toggle = (opt: T) => {
    onChange(
      selected.includes(opt)
        ? (selected.filter(v => v !== opt) as T[])
        : ([...selected, opt] as T[])
    )
  }
  const pad = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const on = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`${pad} rounded-md border transition-colors ${
              on
                ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
                : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
