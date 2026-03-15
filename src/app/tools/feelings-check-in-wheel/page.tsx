import type { Metadata } from 'next';
import { FeelingsCheckInWheel } from '@/components/FeelingsCheckInWheel';

export const metadata: Metadata = {
  title: 'Free Preschool Feelings Check-In Wheel | gairiai',
  description:
    'Free preschool feelings check-in wheel with Zoo Crew emotion characters, a local-only teacher overview, and a printable poster plus cards.',
  openGraph: {
    title: 'Free Preschool Feelings Check-In Wheel',
    description:
      'An interactive feelings wheel for preschool classrooms with Zoo Crew emotion characters, local teacher check-ins, and a free printable PDF.',
    type: 'website',
  },
};

export default function FeelingsCheckInWheelPage() {
  return <FeelingsCheckInWheel />;
}
