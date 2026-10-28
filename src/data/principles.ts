export interface Principle {
  number: string
  title: string
  body: string
}

export const principles: Principle[] = [
  {
    number: '01',
    title: 'Plain English, always',
    body: 'No jargon. You will always understand what we are building, why it matters and what it costs.',
  },
  {
    number: '02',
    title: 'Built around your business',
    body: 'Your website and tools are shaped to fit how you actually work, not a template that forces you to change.',
  },
  {
    number: '03',
    title: 'Mobile-first',
    body: 'Most of your customers are on a phone, so that is where we start and where we test the most.',
  },
  {
    number: '04',
    title: 'Honest pricing',
    body: 'Clear starting prices and a written quote before any work begins, with no surprise costs.',
  },
  {
    number: '05',
    title: 'You talk to the builder',
    body: 'No account managers and no hand-offs — you speak directly with the person doing the work.',
  },
]
