import { Fragment } from 'react'
import type { Author } from '@/content/cv'

export function AuthorName({ author }: { author: Author }) {
  if (author.me === 'lead') return <span className="font-semibold text-teal">{author.name}</span>
  if (author.me === 'co') return <span className="font-semibold">{author.name}</span>
  return <>{author.name}</>
}

export function AuthorList({ authors }: { authors: Author[] }) {
  return (
    <>
      {authors.map((a, i) => (
        <Fragment key={a.name}>
          {i > 0 && ', '}
          <AuthorName author={a} />
        </Fragment>
      ))}
    </>
  )
}
