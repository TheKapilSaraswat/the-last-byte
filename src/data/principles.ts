export interface Principle {
  number: string
  title: string
  body: string
  /** Short technical annotation rendered in mono type. */
  spec: string
}

export const principles: Principle[] = [
  {
    number: '01',
    title: 'Thoughtful by design',
    body: 'Every screen has a reason to exist. Layout, hierarchy and wording are decided deliberately, not decorated after the fact.',
    spec: 'HUMAN / INTENT',
  },
  {
    number: '02',
    title: 'Built for real-world use',
    body: 'The website is tested on the phones and browsers your customers actually use, not just a designer’s laptop.',
    spec: 'RESP / CONTENT',
  },
  {
    number: '03',
    title: 'Performance matters',
    body: 'Fast, light pages keep people around. Speed is treated as part of the user experience, not an afterthought.',
    spec: 'CORE / SPEED',
  },
  {
    number: '04',
    title: 'Clear communication',
    body: 'No jargon walls. You get plain explanations of what is being built, why it matters, and what it costs.',
    spec: 'PLAIN / PROCESS',
  },
  {
    number: '05',
    title: 'Designed to grow',
    body: 'Systems are structured so they can be extended later — new pages, features or automations without a rebuild.',
    spec: 'SCALE / MODULAR',
  },
]
