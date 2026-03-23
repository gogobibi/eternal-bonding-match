import type { ProfileInput, PlayStyleItem } from '../../types/api'

export default function Section6Extra({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  const items = data.extra_items ?? []

  const add = () => onChange({ extra_items: [...items, { id: crypto.randomUUID(), text: '', emphasized: false }] })
  const remove = (id: string) => onChange({ extra_items: items.filter(i => i.id !== id) })
  const update = (id: string, patch: Partial<PlayStyleItem>) => onChange({ extra_items: items.map(i => i.id === id ? { ...i, ...patch } : i) })

  return (
    <div className="space-y-4">
      <h3 className="text-[var(--color-gold)] font-semibold">기타 하고 싶은 말</h3>
      {items.map(item => (
        <div key={item.id} className="flex gap-2 items-center">
          <input type="text" value={item.text} onChange={e => update(item.id, { text: e.target.value })} placeholder="자유롭게 입력해 주세요"
            className="flex-1 px-3 py-2 rounded bg-[var(--color-navy-light)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none" />
          <button type="button" onClick={() => update(item.id, { emphasized: !item.emphasized })}
            className={`px-2 py-1 text-lg ${item.emphasized ? 'text-[var(--color-gold)]' : 'text-slate-500'}`}>
            &#9733;
          </button>
          <button type="button" onClick={() => remove(item.id)} className="text-red-400 hover:text-red-300 px-2">&#10005;</button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="px-4 py-2 text-sm rounded border border-dashed border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] transition-colors">
        + 추가
      </button>
    </div>
  )
}
