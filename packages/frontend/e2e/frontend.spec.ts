import { test, expect } from '@playwright/test'

// ─── T1: HomePage 렌더링 ───
test('T1: HomePage renders title and two CTA buttons', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('이터널 본딩 매칭')
  expect(await page.locator('button').count()).toBe(2)
})

// ─── T2: HomePage → FormPage 네비게이션 ───
test('T2: "내 프로필 작성하기" navigates to /form', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("내 프로필 작성하기")')
  await expect(page).toHaveURL('/form')
  await expect(page.locator('h1')).toContainText('프로필 작성')
})

// ─── T3: HomePage → MatchInputPage 네비게이션 ───
test('T3: "매칭 확인하기" navigates to /match', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("매칭 확인하기")')
  await expect(page).toHaveURL('/match')
  await expect(page.locator('h1')).toContainText('매칭 시작')
})

// ─── T4: FormPage 스텝 인디케이터 렌더링 ───
test('T4: FormPage shows step indicator with 6 steps', async ({ page }) => {
  await page.goto('/form')
  await expect(page.locator('text=1 / 6')).toBeVisible()
})

// ─── T5: FormPage Section1 닉네임 입력 ───
test('T5: FormPage Section1 nickname input works', async ({ page }) => {
  await page.goto('/form')
  const input = page.locator('input[placeholder="인게임 닉네임"]')
  await expect(input).toBeVisible()
  await input.fill('테스트닉네임')
  await expect(input).toHaveValue('테스트닉네임')
})

// ─── T6: FormPage 다음/이전 버튼으로 스텝 이동 ───
test('T6: FormPage step navigation works (next/prev)', async ({ page }) => {
  await page.goto('/form')
  await expect(page.locator('text=1 / 6')).toBeVisible()
  await page.click('button:has-text("다음")')
  await expect(page.locator('text=2 / 6')).toBeVisible()
  await page.click('button:has-text("이전")')
  await expect(page.locator('text=1 / 6')).toBeVisible()
})

// ─── T7: FormPage Section1 서버 선택 ───
test('T7: FormPage Section1 server radio select', async ({ page }) => {
  await page.goto('/form')
  const serverBtn = page.locator('label:has-text("카벙클")')
  await expect(serverBtn).toBeVisible()
  await serverBtn.click()
  await expect(serverBtn).toHaveClass(/bg-\[var\(--color-gold\)\]/)
})

// ─── T8: FormPage 6스텝 전체 순회 ───
test('T8: FormPage can navigate through all 6 steps', async ({ page }) => {
  await page.goto('/form')
  for (let i = 1; i <= 6; i++) {
    await expect(page.locator(`text=${i} / 6`)).toBeVisible({ timeout: 3000 })
    if (i < 6) await page.click('button:has-text("다음")')
  }
  await expect(page.locator('button:has-text("제출하기")')).toBeVisible()
})

// ─── T9: SharePage 직접 접근 시 렌더링 ───
test('T9: SharePage renders with linkId param', async ({ page }) => {
  await page.goto('/share/test-link-123')
  await expect(page.locator('h1')).toContainText('프로필이 생성되었습니다')
  await expect(page.locator('text=test-link-123')).toBeVisible()
})

// ─── T10: MatchInputPage 입력 필드 렌더링 ───
test('T10: MatchInputPage renders two input fields', async ({ page }) => {
  await page.goto('/match')
  expect(await page.locator('input[type="text"]').count()).toBe(2)
})

// ─── T11: MatchInputPage 버튼 비활성화 (빈 입력) ───
test('T11: MatchInputPage submit disabled when inputs empty', async ({ page }) => {
  await page.goto('/match')
  await expect(page.locator('button:has-text("매칭 시작")')).toBeDisabled()
})

// ─── T12: ResultPage 로딩 스피너 또는 에러 표시 (백엔드 없음) ───
test('T12: ResultPage shows loading or error when no backend', async ({ page }) => {
  await page.goto('/result/fake-match-id')
  const spinner = page.locator('.animate-spin')
  const errorText = page.locator('.text-red-400')
  await expect(spinner.or(errorText)).toBeVisible({ timeout: 5000 })
})

// ─── T13: FormPage Section2 커플링 우선순위 UI ───
test('T13: FormPage Section2 coupling priority renders', async ({ page }) => {
  await page.goto('/form')
  await page.click('button:has-text("다음")')
  await expect(page.locator('text=2 / 6')).toBeVisible()
  await expect(page.locator('text=커플링 성향 우선순위')).toBeVisible()
  await expect(page.locator('text=BL')).toBeVisible()
  await expect(page.locator('text=GL')).toBeVisible()
  await expect(page.locator('text=HL')).toBeVisible()
})

// ─── T14: CSS 테마 변수 적용 확인 ───
test('T14: CSS theme variables are applied (dark navy bg)', async ({ page }) => {
  await page.goto('/')
  const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bgColor).toBe('rgb(15, 23, 42)')
})
