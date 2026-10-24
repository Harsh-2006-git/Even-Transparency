import React from 'react';

const AVATAR_BG_GRADIENTS = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-indigo-600',
  'from-teal-500 to-emerald-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-fuchsia-600',
  'from-emerald-500 to-teal-700'
];

export default function CandidateAvatar({
  name = 'Candidate',
  photoUrl = null,
  size = 'w-9 h-9',
  textSize = 'text-xs',
  border = 'border border-slate-200'
}) {
  const [imgError, setImgError] = React.useState(false);
  const initials = (name || 'Candidate')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'C';

  // Deterministic gradient selection based on name char codes
  const charSum = (name || 'C')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const gradientClass = AVATAR_BG_GRADIENTS[charSum % AVATAR_BG_GRADIENTS.length];

  // Do not use repeated dummy stock photo URLs
  const isGenericDummy = photoUrl && (
    photoUrl.includes('photo-1573496359142-b8d87734a5a2') ||
    photoUrl.includes('photo-1534528741775-53994a69daeb')
  );

  if (photoUrl && !imgError && !isGenericDummy) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover shrink-0 shadow-sm ${border}`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${border}`}
    >
      <span className={textSize}>{initials}</span>
    </div>
  );
}
