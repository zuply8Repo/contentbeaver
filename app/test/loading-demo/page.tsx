import React from 'react';

/**
 * Disney-style beaver: very round, big shiny eyes, blush cheeks. Animates rotating in circles above loading text.
 */
const DisneyBeaver = () => (
  <div className="relative w-48 h-48 flex items-center justify-center select-none">
    <svg
      id="disneyBeaver"
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      className="mx-auto"
      style={{ display: 'block' }}
    >
      {/* Shadow */}
      <ellipse cx="80" cy="140" rx="34" ry="12" fill="#121014" fillOpacity="0.15" />
      {/* Tail: heart/oval, with crisscross simple lines */}
      <g id="tail">
        <ellipse cx="132" cy="114" rx="24" ry="13" fill="#7A6657" />
        <g stroke="#998478" strokeWidth="2" opacity=".18">
          <line x1="118" y1="110" x2="146" y2="118" />
          <line x1="140" y1="101" x2="125" y2="126" />
          <line x1="132" y1="104" x2="132" y2="123" />
        </g>
      </g>
      {/* Body: soft rounded oval, thick light brown */}
      <ellipse cx="80" cy="90" rx="43" ry="36" fill="#F0C094" stroke="#BC8857" strokeWidth="2.7" />
      {/* Chubby belly highlight */}
      <ellipse cx="80" cy="110" rx="20" ry="13" fill="#fff" opacity=".22" />
      {/* Feet: big ovals under body */}
      <ellipse cx="48" cy="132" rx="12" ry="7" fill="#BC8857" />
      <ellipse cx="112" cy="132" rx="12" ry="7" fill="#BC8857" />
      {/* Arms, tucked and small */}
      <ellipse cx="53" cy="110" rx="9" ry="5" fill="#D6A97B" />
      <ellipse cx="107" cy="110" rx="9" ry="5" fill="#D6A97B" />
      {/* Face: head circle */}
      <ellipse cx="80" cy="62" rx="33" ry="30" fill="#F0C094" stroke="#BC8857" strokeWidth="2.5" />
      {/* Ears */}
      <ellipse cx="49" cy="48" rx="7.7" ry="8.5" fill="#BC8857" />
      <ellipse cx="111" cy="48" rx="7.7" ry="8.5" fill="#BC8857" />
      {/* Blush */}
      <ellipse cx="58" cy="77" rx="6.1" ry="3.2" fill="#F8B4A0" opacity=".66" />
      <ellipse cx="102" cy="77" rx="6.1" ry="3.2" fill="#F8B4A0" opacity=".66" />
      {/* Eyes: very large, oval, with highlights */}
      <ellipse cx="66" cy="63" rx="7.5" ry="11" fill="#383029" />
      <ellipse cx="94" cy="63" rx="7.5" ry="11" fill="#383029" />
      {/* Eye twinkle highlights */}
      <ellipse cx="70.5" cy="59" rx="2" ry="3.2" fill="#fff" fillOpacity=".83" />
      <ellipse cx="90.5" cy="59" rx="2" ry="3.2" fill="#fff" fillOpacity=".83" />
      {/* Mouth: tiny arc smile */}
      <path d="M73 78 Q80 84 87 78" stroke="#B25E2F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {/* Toony Teeth: big and rounded, split by central line */}
      <rect x="74.5" y="79.7" width="11" height="7.2" rx="1.4" fill="#fff" stroke="#E9E9E9" strokeWidth="1" />
      <line x1="80" y1="79.7" x2="80" y2="86.9" stroke="#E9E9E9" strokeWidth="1" />
      {/* Nose: tiny round, dark */}
      <ellipse cx="80" cy="71.2" rx="2.4" ry="1.6" fill="#864C24" />
      {/* Eyebrows: wide, friendly, emphasize emotion on pause (optional animate) */}
      <path d="M59 60 Q64 55 69 59" stroke="#92643F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M91 59 Q96 55 101 60" stroke="#92643F" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
    <style>{`
      @keyframes spin-bounce {
        0% { transform: rotate(0deg) scale(1); }
        25% {
          transform: rotate(90deg) scale(1.08);
        }
        33% {
          transform: rotate(133deg) scale(1.11);
        }
        37% {
          transform: rotate(180deg) scale(1.10);
        }
        41% {
          transform: rotate(202deg) scale(1.09);
        }
        50% {
          transform: rotate(224deg) scale(1.11);
        }
        58% {
          transform: rotate(270deg) scale(1.09);
        }
        62% {
          transform: rotate(315deg) scale(1.08);
        }
        70% {
          transform: rotate(350deg) scale(1.01);
        }
        74% {
          transform: rotate(360deg) scale(1);
        }
        100% { transform: rotate(360deg) scale(1); }
      }
      #disneyBeaver {
        transform-origin: 80px 90px;
        animation: spin-bounce 3.6s cubic-bezier(.82,-0.1,.51,1.1) infinite;
        will-change: transform;
      }
    `}</style>
  </div>
);

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 w-full">
      <div className="rounded-2xl shadow-xl border border-zinc-800 bg-zinc-900 p-8 flex flex-col items-center">
        <DisneyBeaver />
        <div className="mt-1 text-zinc-200 font-bold text-lg text-center tracking-wider">
          page is loading
        </div>
      </div>
    </div>
  );
}
