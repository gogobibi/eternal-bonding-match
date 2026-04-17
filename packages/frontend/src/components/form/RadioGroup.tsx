interface Props<T extends string> {
  options: readonly T[]
  value: T | undefined
  onChange: (v: T) => void
  name?: string
}

export default function RadioGroup<T extends string>({ options, value, onChange, name }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map(opt => {
        const selected = value === opt
        return (
          <label
            key={opt}
            className={`cursor-pointer px-4 py-1.5 rounded-md border text-sm transition-colors ${
              selected
                ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
                : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={selected}
              onChange={() => onChange(opt)}
            />
            {opt}
          </label>
        )
      })}
    </div>
  )
}
