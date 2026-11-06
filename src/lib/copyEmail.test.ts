import { copyEmail } from './copyEmail'

const EMAIL = 'qkqhsm1@hanyang.ac.kr'

test('copies the address when the clipboard works', async () => {
  const written: string[] = []
  const navigated: string[] = []
  const result = await copyEmail(EMAIL, { writeText: async (t: string) => void written.push(t) }, (u) => navigated.push(u))
  expect(result).toBe('copied')
  expect(written).toEqual([EMAIL])
  expect(navigated).toEqual([])
})

test('falls back to mailto when there is no clipboard', async () => {
  const navigated: string[] = []
  expect(await copyEmail(EMAIL, undefined, (u) => navigated.push(u))).toBe('fallback')
  expect(navigated).toEqual([`mailto:${EMAIL}`])
})

test('falls back to mailto when the clipboard refuses', async () => {
  const navigated: string[] = []
  const refusing = { writeText: () => Promise.reject(new Error('denied')) }
  expect(await copyEmail(EMAIL, refusing, (u) => navigated.push(u))).toBe('fallback')
  expect(navigated).toEqual([`mailto:${EMAIL}`])
})
