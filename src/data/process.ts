export interface ProcessStep {
  number: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Tell us about your business',
    description:
      'Share a few details about what you do and what you need. It only takes a minute.',
  },
  {
    number: '02',
    title: 'Discuss your requirements and price',
    description:
      'We talk through the options, agree the scope and confirm a clear price.',
  },
  {
    number: '03',
    title: 'Approve the plan and let us build it',
    description:
      'Once you are happy with the plan and the price, we get to work.',
  },
  {
    number: '04',
    title: 'Review the result before handover',
    description:
      'You check everything before we hand it over, and we make any agreed changes.',
  },
]
