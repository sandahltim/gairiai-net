import type { Metadata } from 'next';
import { CalmDownCornerTool } from '@/components/CalmDownCornerTool';

export const metadata: Metadata = {
  title: 'Free Preschool Calm Down Corner Tool | gairiai',
  description:
    'Free preschool calm down corner tool with Zoo Crew strategy buddies, feeling check-ins, and a printable classroom kit.',
  openGraph: {
    title: 'Free Preschool Calm Down Corner Tool',
    description:
      'A free Zoo Crew calm down corner with feeling check-ins, step-by-step regulation prompts, and printable classroom support pages.',
    type: 'website',
  },
};

export default function CalmDownCornerPage() {
  return <CalmDownCornerTool />;
}
