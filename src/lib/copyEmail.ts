export async function copyEmail(
  email: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined,
  navigate: (url: string) => void,
): Promise<'copied' | 'fallback'> {
  if (clipboard) {
    try {
      await clipboard.writeText(email)
      return 'copied'
    } catch {
      // fall through to mailto
    }
  }
  navigate(`mailto:${email}`)
  return 'fallback'
}
