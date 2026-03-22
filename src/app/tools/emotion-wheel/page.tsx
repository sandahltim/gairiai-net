import type { Metadata } from 'next';
import { FeelingsCheckInWheel } from '@/components/FeelingsCheckInWheel';

export const metadata: Metadata = {
  title: 'Zoo Crew Emotion Wheel | gairiai',
  description:
    'Free preschool emotion wheel with Zoo Crew feeling characters, local teacher check-ins, and a classroom-ready printable companion pack.',
  openGraph: {
    title: 'Zoo Crew Emotion Wheel',
    description:
      'An interactive preschool emotion wheel with Zoo Crew characters, teacher-friendly zone grouping, and printable classroom support.',
    type: 'website',
  },
};

export default function EmotionWheelPage() {
  return <FeelingsCheckInWheel />;
}
