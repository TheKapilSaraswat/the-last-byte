export interface ProcessStep {
  number: string
  title: string
  description: string
  detail: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Understand the business, its customers, goals and requirements before anything is designed.',
    detail: 'A short working session, a clear brief, and an honest scope.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Plan the experience, structure, content and visual direction around real business goals.',
    detail: 'Wireframes, direction and a structure you can react to early.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Implement the website or system, then test responsiveness, performance and functionality.',
    detail: 'Real pages and working software — not static mockups.',
  },
  {
    number: '04',
    title: 'Launch & Improve',
    description:
      'Deploy, measure what matters, and make the agreed improvements after go-live.',
    detail: 'A live product, then refinements based on how it is used.',
  },
]
