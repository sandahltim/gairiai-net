import type { OutfitMode } from '@/lib/zoo-characters';

type ZooCharacterAvatarProps = {
  characterId: string;
  mode: OutfitMode;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  title?: string;
};

function resolveFallbackSrc(characterId: string, mode: OutfitMode, explicit?: string): string {
  if (explicit) return explicit;
  return `/characters/${characterId}-${mode}.png`;
}

export function isSvgCharacterSupported(): boolean {
  return false;
}

export function ZooCharacterAvatar({ characterId, mode, alt, className, fallbackSrc, title }: ZooCharacterAvatarProps) {
  return <img src={resolveFallbackSrc(characterId, mode, fallbackSrc)} alt={alt} className={className} loading="lazy" title={title} />;
}
