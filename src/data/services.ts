import {
  LayoutTemplate,
  QrCode,
  Boxes,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export interface Service {
  id: string
  number: string
  title: string
  /** One-line outcome-focused summary. */
  summary: string
  /** The business result this produces, in plain language. */
  outcome: string
  includes: string[]
  icon: LucideIcon
  /** Which of the four varied layouts this entry uses. */
  layout: 'wide' | 'split' | 'stacked' | 'list'
}

export const services: Service[] = [
  {
    id: 'websites',
    number: '01',
    title: 'Websites & Digital Experiences',
    summary:
      'Modern, responsive websites and landing pages that make a business look credible and turn visitors into enquiries.',
    outcome:
      'A first impression that earns trust — clear messaging, fast pages, and an obvious next step for every visitor.',
    includes: [
      'Marketing sites & landing pages',
      'Responsive design & performance',
      'Content structure & copy support',
      'SEO-ready foundations',
    ],
    icon: LayoutTemplate,
    layout: 'wide',
  },
  {
    id: 'menus',
    number: '02',
    title: 'Digital Menus & Business Pages',
    summary:
      'QR-accessible menus, digital catalogues, service pages, contact experiences, and WhatsApp integration.',
    outcome:
      'Customers reach what they need in seconds — no printing, no friction, and every page pushes toward a conversation.',
    includes: [
      'QR menu & catalogue systems',
      'Service & contact pages',
      'WhatsApp order/enquiry hand-off',
      'Easy in-house content updates',
    ],
    icon: QrCode,
    layout: 'split',
  },
  {
    id: 'software',
    number: '03',
    title: 'Custom Software & Business Tools',
    summary:
      'Purpose-built applications, admin panels, booking workflows, lead management, reporting, and business dashboards.',
    outcome:
      'The repetitive work your team does by hand becomes a reliable system with visibility into what is actually happening.',
    includes: [
      'Admin panels & dashboards',
      'Bookings, leads & CRM flows',
      'Reporting & data views',
      'Role-based access where needed',
    ],
    icon: Boxes,
    layout: 'stacked',
  },
  {
    id: 'automation',
    number: '04',
    title: 'Automation & Intelligent Systems',
    summary:
      'Practical workflow automation, integrations, data processing, and AI-assisted features where they genuinely improve the business.',
    outcome:
      'Fewer manual steps between an enquiry and a result — systems that connect tools and quietly do the busywork.',
    includes: [
      'Workflow & task automation',
      'Tool-to-tool integrations',
      'Data cleanup & processing',
      'AI where it adds real value',
    ],
    icon: Workflow,
    layout: 'list',
  },
]
