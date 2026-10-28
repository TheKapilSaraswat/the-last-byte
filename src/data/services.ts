import {
  LayoutTemplate,
  QrCode,
  Boxes,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export interface ServicePlan {
  /**
   * Stable plan key, shared with the backend pricing catalogue so a live
   * discount from the dashboard can be matched to the right package here.
   */
  planKey: string
  /** Optional plan name, e.g. "Starter Website". Omitted for single-option services. */
  name?: string
  /** Headline price, e.g. "₹4,999" or "Custom quote". */
  price: string
  /** Prefix shown before the price, e.g. "Starting at" or "From". */
  pricePrefix?: string
  /** Label for the feature list, e.g. "What's included" or "Typical examples". */
  listLabel: string
  features: string[]
}

export interface Service {
  id: string
  number: string
  title: string
  /** Plain-English description of what this service is. */
  summary: string
  /** Compact headline price for dense spots (e.g. the hero snapshot). */
  price: string
  icon: LucideIcon
  /** One or more pricing options. Websites have two; the others have one. */
  plans: ServicePlan[]
  /** What is not included, or depends on the agreed package. */
  excludes: string
}

export const services: Service[] = [
  {
    id: 'websites',
    number: '01',
    title: 'Business Websites',
    summary:
      'A professional online presence so customers can find you, trust you and get in touch. Choose the option that fits your business.',
    price: 'Starting at ₹4,999',
    icon: LayoutTemplate,
    plans: [
      {
        planKey: 'starter',
        name: 'Starter Website',
        price: '₹4,999',
        pricePrefix: 'Starting at',
        listLabel: "What's included",
        features: [
          'Up to 4 standard pages (Home, About, Services, Contact)',
          'Mobile-friendly layout',
          'Contact form or enquiry link',
          'Relevant map and WhatsApp links',
          'Basic on-page SEO',
          'Two rounds of reasonable revisions',
        ],
      },
      {
        planKey: 'business',
        name: 'Business Website',
        price: '₹8,999',
        pricePrefix: 'Starting at',
        listLabel: "What's included",
        features: [
          'Up to 6 standard pages',
          'More tailored branding and layout',
          'Enquiry form and contact links',
          'Basic on-page SEO',
          'Two rounds of revisions',
        ],
      },
    ],
    excludes:
      'Domain, hosting, paid tools, professional copywriting and complex features are not included unless expressly included in the written quotation. Booking systems, payment integration, e-commerce and dashboards require a separate quotation.',
  },
  {
    id: 'menus',
    number: '02',
    title: 'QR Menus & Digital Pages',
    summary:
      'Give customers one simple link to view your menu or business details. They just scan a QR code — no app to install.',
    price: 'Starting at ₹999',
    icon: QrCode,
    plans: [
      {
        planKey: 'single',
        price: '₹999',
        pricePrefix: 'Starting at',
        listLabel: "What's included",
        features: [
          'One simple mobile-friendly page',
          'Business details, menu or services',
          'Relevant contact and location links',
          'QR code',
          'One round of corrections',
        ],
      },
    ],
    excludes:
      'Hosting duration, renewals and advanced editing features depend on the agreed package. We do not promise permanent hosting or unlimited updates.',
  },
  {
    id: 'software',
    number: '03',
    title: 'Custom Business Tools',
    summary:
      'Make everyday work easier with a simple tool built around the way your business already runs.',
    price: 'From ₹5,999',
    icon: Boxes,
    plans: [
      {
        planKey: 'single',
        price: '₹5,999',
        pricePrefix: 'From',
        listLabel: 'Typical examples',
        features: [
          'Enquiry tracking',
          'Simple record management',
          'Basic reports and dashboards',
        ],
      },
    ],
    excludes:
      'Final price depends on your requirements, authentication, integrations, data handling and testing.',
  },
  {
    id: 'automation',
    number: '04',
    title: 'Business Automation',
    summary:
      'Cut out repetitive manual work — like sending updates or moving data between tools — so your team saves time.',
    price: 'Custom quote',
    icon: Workflow,
    plans: [
      {
        planKey: 'single',
        price: 'Custom quote',
        listLabel: 'Typical examples',
        features: [
          'Enquiry notifications',
          'Routine data processing',
          'Repetitive workflow automation',
        ],
      },
    ],
    excludes:
      'Price depends on the specific workflow and any third-party services or recurring costs.',
  },
]
