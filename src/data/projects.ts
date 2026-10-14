export type PreviewKind = 'hospitality' | 'menu' | 'dashboard' | 'education'

export interface Project {
  id: string
  number: string
  title: string
  category: string
  /** Honest status label. These are self-initiated concepts, not client work. */
  status: 'Concept Project' | 'Studio Concept' | 'Prototype'
  summary: string
  description: string
  tags: string[]
  preview: PreviewKind
  focus: string[]
  /** Relative size in the magazine layout. */
  size: 'large' | 'medium' | 'small'
}

export const projects: Project[] = [
  {
    id: 'hospitality',
    number: '01',
    title: 'Hospitality Website',
    category: 'Hotel & Guesthouse',
    status: 'Concept Project',
    summary:
      'An elegant booking-first website for a boutique hotel or guesthouse.',
    description:
      'A calm, editorial hospitality site designed around one job: getting a visitor from “just looking” to a room enquiry. Strong imagery zones, transparent room information and a persistent enquiry path.',
    tags: ['Next.js-ready', 'Responsive', 'Enquiry flow'],
    preview: 'hospitality',
    focus: [
      'Room & amenity storytelling',
      'Dates + guests enquiry hand-off',
      'Location & contact clarity',
    ],
    size: 'large',
  },
  {
    id: 'digital-menu',
    number: '02',
    title: 'Digital Menu',
    category: 'Restaurant & Café',
    status: 'Studio Concept',
    summary:
      'A premium QR-accessible menu built for fast scanning and easy edits.',
    description:
      'A contactless menu that loads instantly on any phone, groups dishes clearly and lets staff update prices without touching code. Built as a reusable system across multiple outlets.',
    tags: ['QR access', 'No-print updates', 'Mobile-first'],
    preview: 'menu',
    focus: [
      'Category tabs & search',
      'Dietary tags at a glance',
      'Owner-editable content',
    ],
    size: 'medium',
  },
  {
    id: 'business-dashboard',
    number: '03',
    title: 'Business Dashboard',
    category: 'Leads & Reporting',
    status: 'Prototype',
    summary:
      'A lead-tracking and reporting interface for a small sales team.',
    description:
      'A focused internal tool that replaces a messy spreadsheet. Enquiries land in one place, move through clear stages, and roll up into simple reporting the owner can actually read.',
    tags: ['Internal tool', 'Role access', 'Reporting'],
    preview: 'dashboard',
    focus: [
      'Lead pipeline stages',
      'At-a-glance metrics',
      'Clean, quiet data UI',
    ],
    size: 'medium',
  },
  {
    id: 'education',
    number: '04',
    title: 'Education Website',
    category: 'Coaching Institute',
    status: 'Concept Project',
    summary:
      'A structured website for a coaching institute with admissions enquiries.',
    description:
      'A trustworthy institute website that explains programmes clearly, answers common parent questions up front, and funnels interest into a single, well-designed admission enquiry.',
    tags: ['Content-led', 'Accessible', 'Enquiry-led'],
    preview: 'education',
    focus: [
      'Programme comparison',
      'Faculty & results structure',
      'Admission enquiry flow',
    ],
    size: 'small',
  },
]
