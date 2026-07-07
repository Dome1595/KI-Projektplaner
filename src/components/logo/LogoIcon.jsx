// project imports
import { LOGO_BAR_COLORS } from '../../../themes/brand';

/**
 * Logo-Symbol Institut Perspektive Handwerk: fünf diagonale Balken
 * (Nachtblau → Tiefblau → Türkis → Limette → helle Limette).
 * SVG-Nachbau der gelieferten Bilddatei (PRD Kapitel 12); bei Bedarf durch
 * die Original-Vektordatei ersetzen.
 */

// ==============================|| LOGO ICON ||============================== //

export default function LogoIcon({ size = 32 }) {
  const [navy, blue, teal, lime, limeLight] = LOGO_BAR_COLORS;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="rotate(20 24 24)">
        <rect x="5" y="20.5" width="4.6" height="10" rx="2.2" fill={navy} />
        <rect x="12" y="15.5" width="4.6" height="19" rx="2.2" fill={blue} />
        <rect x="19" y="10.5" width="4.6" height="27" rx="2.2" fill={teal} />
        <rect x="26" y="5" width="4.6" height="38" rx="2.2" fill={lime} />
        <rect x="33" y="13" width="4.6" height="25" rx="2.2" fill={limeLight} />
      </g>
    </svg>
  );
}
