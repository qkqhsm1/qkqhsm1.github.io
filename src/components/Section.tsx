import { useId, type ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="mb-4 border-l-4 border-teal pl-3 text-[26px] font-semibold leading-[1.1] text-ink">
        {title}
      </h2>
      <ul>{children}</ul>
    </section>
  )
}
