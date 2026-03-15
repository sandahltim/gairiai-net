import type { Metadata } from 'next';
import { VisualScheduleBuilder } from '@/components/VisualScheduleBuilder';

export const metadata: Metadata = {
  title: 'Free Preschool Visual Schedule Builder | gairiai',
  description:
    'Free drag-and-drop visual schedule builder for preschool and kindergarten classrooms with Zoo Crew picture cards, printable layouts, and no login.',
  openGraph: {
    title: 'Free Preschool Visual Schedule Builder',
    description:
      'Build a free visual classroom schedule with Zoo Crew character cards, preset templates, and a printable preschool-friendly board.',
    type: 'website',
  },
};

export default function VisualScheduleBuilderPage() {
  return <VisualScheduleBuilder />;
}
