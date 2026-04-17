import type { KeywordItem } from '../../types/api'

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

export default function EditableKeywordList({ items, onChange, placeholder }: {
  items: KeywordItem[]
  onChange: (items: KeywordItem[]) => void
  placeholder?: string
}) {
  const add = () => onChange([...items, { id: generateId(), text: '', emphasized: false }])
  const remove = (id: string) => onChange(items.filter(i => i.id !== id))
  const update = (id: string, patch: Partial<KeywordItem>) => onChange(items.map(i => i.id === id ? { ...i, ...patch } : i))

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex gap-2 items-center">
          <input type="text" value={item.text} onChange={e => update(item.id, { text: e.target.value })} placeholder={placeholder ?? '키워드 입력'}
            className="flex-1 px-3 py-2 rounded bg-[var(--color-navy-light)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm" />
          <button type="button" onClick={() => update(item.id, { emphasized: !item.emphasized })}
            className={`px-2 py-1 text-lg ${item.emphasized ? 'text-[var(--color-gold)]' : 'text-slate-500'}`}>
            &#9733;
          </button>
          <button type="button" onClick={() => remove(item.id)} className="text-red-500 hover:text-red-600 px-2">&#10005;</button>
        </div>
      ))}
      <button type="button" onClick={add} className="px-4 py-1.5 text-sm rounded-md border border-dashed border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] transition-colors">
        + 추가
      </button>
    </div>
  )
}
