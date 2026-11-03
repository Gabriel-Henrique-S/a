import { useId } from 'react';

/** Temporary, original SVG mascot: flame, expressive eyes, no arms or legs. */
export default function Mascot({ className = '', decorative = false, title = 'Foguinho, o mascote do Impulso' }) {
  const id = useId().replaceAll(':', '');
  return <svg className={className} viewBox="0 0 260 300" fill="none" role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-labelledby={decorative ? undefined : `${id}-title`}>
    {!decorative && <title id={`${id}-title`}>{title}</title>}
    <defs>
      <linearGradient id={`${id}-body`} x1="92" y1="22" x2="164" y2="284" gradientUnits="userSpaceOnUse"><stop stopColor="#ff8c00"/><stop offset=".55" stopColor="#ff4d00"/><stop offset="1" stopColor="#ed3900"/></linearGradient>
      <linearGradient id={`${id}-core`} x1="126" y1="135" x2="126" y2="286" gradientUnits="userSpaceOnUse"><stop stopColor="#ffe45b"/><stop offset="1" stopColor="#ffae00"/></linearGradient>
    </defs>
    <path d="M144 14c9 51 75 70 88 123 17 65-18 136-88 145C71 293 19 244 24 184c3-43 30-74 60-101-5 31 3 52 13 47 19-10 39-66 47-116Z" fill={`url(#${id}-body)`}/>
    <path d="M135 159c0 28 43 37 39 76-3 30-30 48-58 45-28-3-48-25-44-52 3-24 21-38 30-61 0 19 6 26 13 24 7-3 14-13 20-32Z" fill={`url(#${id}-core)`}/>
    <path d="M137 46c6 17 16 30 27 42" stroke="#ffba60" strokeWidth="9" strokeLinecap="round" opacity=".65"/>
    <ellipse cx="91" cy="150" rx="18" ry="24" fill="#fff5dc" transform="rotate(-4 91 150)"/>
    <ellipse cx="154" cy="149" rx="18" ry="24" fill="#fff5dc" transform="rotate(4 154 149)"/>
    <ellipse cx="97" cy="153" rx="9" ry="14" fill="#171311"/>
    <ellipse cx="159" cy="152" rx="9" ry="14" fill="#171311"/>
    <circle cx="100" cy="148" r="3" fill="white"/><circle cx="162" cy="147" r="3" fill="white"/>
    <path d="M111 185q12 11 24-1" stroke="#642109" strokeWidth="5" strokeLinecap="round"/>
    <ellipse cx="67" cy="176" rx="9" ry="5" fill="#d83700" opacity=".5"/><ellipse cx="181" cy="175" rx="9" ry="5" fill="#d83700" opacity=".5"/>
  </svg>;
}
