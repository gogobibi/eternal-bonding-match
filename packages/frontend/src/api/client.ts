import type { CreateProfileRequest, CreateProfileResponse, CreateLinkResponse, GetLinkResponse, CreateMatchResponse, GetMatchResponse } from '../types/api'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error ?? res.statusText)
  }
  return res.json()
}

export function postProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  return request('/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export function postLink(profileId: string): Promise<CreateLinkResponse> {
  return request('/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile_id: profileId }) })
}

export function getLink(linkId: string): Promise<GetLinkResponse> {
  return request(`/links/${linkId}`)
}

export function postMatch(linkIdA: string, linkIdB: string): Promise<CreateMatchResponse> {
  return request('/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ link_id_a: linkIdA, link_id_b: linkIdB }) })
}

export function getMatch(matchId: string): Promise<GetMatchResponse> {
  return request(`/match/${matchId}`)
}
