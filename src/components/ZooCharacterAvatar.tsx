import type { ReactNode } from 'react';
import type { OutfitMode } from '@/lib/zoo-characters';

type ZooCharacterAvatarProps = {
  characterId: string;
  mode: OutfitMode;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  title?: string;
};

type CharacterRenderer = (mode: OutfitMode) => ReactNode;

const STROKE = '#1f2937';

const CHARACTER_RENDERERS: Record<string, CharacterRenderer> = {
  turtle: mode => (
    <>
      <circle cx="60" cy="68" r="27" fill="#4ade80" stroke={STROKE} strokeWidth="3" />
      <circle cx="60" cy="68" r="17" fill="#22c55e" stroke={STROKE} strokeWidth="2" opacity="0.9" />
      <circle cx="60" cy="37" r="15" fill="#86efac" stroke={STROKE} strokeWidth="3" />
      <circle cx="36" cy="70" r="9" fill="#86efac" stroke={STROKE} strokeWidth="3" />
      <circle cx="84" cy="70" r="9" fill="#86efac" stroke={STROKE} strokeWidth="3" />
      <ellipse cx="48" cy="95" rx="8" ry="6" fill="#86efac" stroke={STROKE} strokeWidth="3" />
      <ellipse cx="72" cy="95" rx="8" ry="6" fill="#86efac" stroke={STROKE} strokeWidth="3" />
      <circle cx="54" cy="35" r="3.2" fill="#111827" />
      <circle cx="66" cy="35" r="3.2" fill="#111827" />
      <path d="M54 44 Q60 48 66 44" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      {mode === 'classic' && <rect x="77" y="58" width="12" height="15" rx="3" fill="#16a34a" stroke={STROKE} strokeWidth="2" />}
      {mode === 'special' && (
        <>
          <path d="M60 16 L70 34 H50 Z" fill="#f43f5e" stroke={STROKE} strokeWidth="2.5" />
          <circle cx="60" cy="14" r="3" fill="#fde047" stroke={STROKE} strokeWidth="1.5" />
        </>
      )}
      {mode === 'winter' && (
        <>
          <rect x="44" y="45" width="32" height="8" rx="4" fill="#ef4444" stroke={STROKE} strokeWidth="2" />
          <rect x="50" y="19" width="20" height="9" rx="4" fill="#ef4444" stroke={STROKE} strokeWidth="2" />
          <circle cx="60" cy="18" r="3" fill="#f9fafb" stroke={STROKE} strokeWidth="1.5" />
        </>
      )}
    </>
  ),
  lion: mode => (
    <>
      <circle cx="60" cy="60" r="34" fill="#f59e0b" stroke={STROKE} strokeWidth="3" />
      <circle cx="42" cy="32" r="7" fill="#f59e0b" stroke={STROKE} strokeWidth="3" />
      <circle cx="78" cy="32" r="7" fill="#f59e0b" stroke={STROKE} strokeWidth="3" />
      <circle cx="60" cy="62" r="22" fill="#fde68a" stroke={STROKE} strokeWidth="3" />
      <ellipse cx="60" cy="74" rx="9" ry="6" fill="#fbbf24" stroke={STROKE} strokeWidth="2" />
      <circle cx="52" cy="58" r="3.3" fill="#111827" />
      <circle cx="68" cy="58" r="3.3" fill="#111827" />
      <path d="M52 82 Q60 88 68 82" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      {mode === 'classic' && <path d="M74 40 l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z" fill="#fde047" stroke={STROKE} strokeWidth="1.8" />}
      {mode === 'special' && (
        <>
          <path d="M60 12 L71 34 H49 Z" fill="#a855f7" stroke={STROKE} strokeWidth="2.5" />
          <circle cx="60" cy="11" r="3" fill="#fde047" stroke={STROKE} strokeWidth="1.5" />
        </>
      )}
      {mode === 'winter' && (
        <>
          <rect x="42" y="39" width="36" height="8" rx="4" fill="#ef4444" stroke={STROKE} strokeWidth="2" />
          <circle cx="44" cy="35" r="4" fill="#fde68a" stroke={STROKE} strokeWidth="1.5" />
          <circle cx="76" cy="35" r="4" fill="#fde68a" stroke={STROKE} strokeWidth="1.5" />
        </>
      )}
    </>
  ),
  bee: mode => (
    <>
      <ellipse cx="45" cy="54" rx="13" ry="16" fill="#f8fafc" stroke={STROKE} strokeWidth="2.5" opacity="0.8" />
      <ellipse cx="75" cy="54" rx="13" ry="16" fill="#f8fafc" stroke={STROKE} strokeWidth="2.5" opacity="0.8" />
      <ellipse cx="60" cy="64" rx="28" ry="24" fill="#facc15" stroke={STROKE} strokeWidth="3" />
      <rect x="36" y="54" width="48" height="7" rx="3.5" fill="#111827" opacity="0.95" />
      <rect x="36" y="67" width="48" height="7" rx="3.5" fill="#111827" opacity="0.95" />
      <circle cx="60" cy="35" r="13" fill="#fde047" stroke={STROKE} strokeWidth="3" />
      <line x1="53" y1="24" x2="49" y2="14" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
      <line x1="67" y1="24" x2="71" y2="14" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="49" cy="13" r="2.7" fill="#111827" />
      <circle cx="71" cy="13" r="2.7" fill="#111827" />
      <circle cx="55" cy="34" r="3" fill="#111827" />
      <circle cx="65" cy="34" r="3" fill="#111827" />
      <path d="M54 42 Q60 46 66 42" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
      {mode === 'classic' && (
        <>
          <circle cx="54" cy="33" r="4.8" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <circle cx="66" cy="33" r="4.8" fill="none" stroke="#0ea5e9" strokeWidth="2" />
        </>
      )}
      {mode === 'special' && (
        <>
          <path d="M60 15 L70 34 H50 Z" fill="#f97316" stroke={STROKE} strokeWidth="2.3" />
          <circle cx="60" cy="13" r="3" fill="#fde68a" stroke={STROKE} strokeWidth="1.5" />
          <circle cx="82" cy="47" r="2.2" fill="#f472b6" />
          <circle cx="36" cy="48" r="2.2" fill="#60a5fa" />
        </>
      )}
      {mode === 'winter' && <rect x="41" y="44" width="38" height="8" rx="4" fill="#0ea5e9" stroke={STROKE} strokeWidth="2" />}
    </>
  ),
  owl: mode => (
    <>
      <ellipse cx="60" cy="66" rx="29" ry="31" fill="#a78bfa" stroke={STROKE} strokeWidth="3" />
      <ellipse cx="60" cy="70" rx="18" ry="19" fill="#ddd6fe" stroke={STROKE} strokeWidth="2.5" />
      <circle cx="50" cy="52" r="9" fill="#f8fafc" stroke={STROKE} strokeWidth="2" />
      <circle cx="70" cy="52" r="9" fill="#f8fafc" stroke={STROKE} strokeWidth="2" />
      <circle cx="50" cy="52" r="3.2" fill="#111827" />
      <circle cx="70" cy="52" r="3.2" fill="#111827" />
      <path d="M56 60 L64 60 L60 66 Z" fill="#f59e0b" stroke={STROKE} strokeWidth="1.8" />
      <path d="M39 66 L28 74 L40 79" fill="#8b5cf6" stroke={STROKE} strokeWidth="2.5" />
      <path d="M81 66 L92 74 L80 79" fill="#8b5cf6" stroke={STROKE} strokeWidth="2.5" />
      <path d="M50 32 L45 41 L55 39 Z" fill="#7c3aed" stroke={STROKE} strokeWidth="2" />
      <path d="M70 32 L65 39 L75 41 Z" fill="#7c3aed" stroke={STROKE} strokeWidth="2" />
      {mode === 'classic' && <rect x="45" y="78" width="30" height="10" rx="3" fill="#7c3aed" stroke={STROKE} strokeWidth="2" />}
      {mode === 'special' && (
        <>
          <path d="M60 16 L70 34 H50 Z" fill="#ec4899" stroke={STROKE} strokeWidth="2.5" />
          <circle cx="60" cy="14" r="3" fill="#fde047" stroke={STROKE} strokeWidth="1.5" />
        </>
      )}
      {mode === 'winter' && <rect x="41" y="44" width="38" height="8" rx="4" fill="#6366f1" stroke={STROKE} strokeWidth="2" />}
    </>
  ),
};

function resolveFallbackSrc(characterId: string, mode: OutfitMode, explicit?: string): string {
  if (explicit) return explicit;
  return `/characters/${characterId}-${mode}.png`;
}

export function isSvgCharacterSupported(characterId: string): boolean {
  return characterId in CHARACTER_RENDERERS;
}

export function ZooCharacterAvatar({ characterId, mode, alt, className, fallbackSrc, title }: ZooCharacterAvatarProps) {
  const renderer = CHARACTER_RENDERERS[characterId];

  if (!renderer) {
    return <img src={resolveFallbackSrc(characterId, mode, fallbackSrc)} alt={alt} className={className} loading="lazy" />;
  }

  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={alt}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title ?? alt}</title>
      <rect x="2" y="2" width="116" height="116" rx="18" fill="#ffffff14" />
      {renderer(mode)}
    </svg>
  );
}
