import type { Metadata } from 'next';
import { EmotionWheel } from '@/components/EmotionWheel';

export const metadata: Metadata = {
  title: 'Zoo Crew Emotion Wheel | gairiai',
  description:
    'Free preschool emotion wheel for circle time with spinning feelings, Zoo Crew characters, and classroom discussion prompts.',
  openGraph: {
    title: 'Zoo Crew Emotion Wheel',
    description:
      'A spinning Zoo Crew emotion wheel for circle time with emotion zones, body clues, and teacher-friendly discussion prompts.',
    type: 'website',
  },
};

export default function EmotionWheelPage() {
  return <EmotionWheel />;
}
