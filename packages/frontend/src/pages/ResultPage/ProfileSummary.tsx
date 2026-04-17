interface Props {
  nicknameA?: string | null
  serverA?: string | null
  nicknameB?: string | null
  serverB?: string | null
}

function ProfileCard({ nickname, server }: { nickname?: string | null; server?: string | null }) {
  return (
    <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-center shadow-sm">
      <p className="text-[var(--color-gold)] font-semibold truncate">{nickname ?? '익명'}</p>
      {server && <p className="text-slate-500 text-xs mt-1 tracking-wider">{server}</p>}
    </div>
  )
}

export default function ProfileSummary({ nicknameA, serverA, nicknameB, serverB }: Props) {
  if (!nicknameA && !nicknameB) return null

  return (
    <div className="flex items-stretch gap-3">
      <ProfileCard nickname={nicknameA} server={serverA} />
      <div className="flex items-center text-[var(--color-gold)] text-xl">×</div>
      <ProfileCard nickname={nicknameB} server={serverB} />
    </div>
  )
}
