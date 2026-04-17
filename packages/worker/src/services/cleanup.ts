export async function deleteLinkCascade(db: D1Database, linkId: string): Promise<void> {
  const link = await db.prepare('SELECT profile_id FROM links WHERE link_id = ?')
    .bind(linkId)
    .first<{ profile_id: string }>()

  if (!link) return

  const profileId = link.profile_id

  await db.batch([
    db.prepare('DELETE FROM matches WHERE profile_a_id = ? OR profile_b_id = ?').bind(profileId, profileId),
    db.prepare('DELETE FROM profiles WHERE profile_id = ?').bind(profileId),
    db.prepare('DELETE FROM links WHERE link_id = ?').bind(linkId),
  ])
}

export async function sweepExpiredLinks(db: D1Database): Promise<number> {
  const now = new Date().toISOString()
  const result = await db.prepare('SELECT link_id FROM links WHERE expires_at < ?')
    .bind(now)
    .all<{ link_id: string }>()

  const rows = result.results ?? []
  for (const row of rows) {
    await deleteLinkCascade(db, row.link_id)
  }
  return rows.length
}
