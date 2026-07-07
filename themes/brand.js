// =============================================================================
// Markenfarben Institut Perspektive Handwerk (PRD Kapitel 12, geliefert 07/2026)
// Verbindliche Werte: #bad31e (Limette), #042344 (Nachtblau), #004c71 (Tiefblau),
// Schwarz, Weiß. Zwischentöne (Türkis, helle Limette) stammen aus dem Logo.
// =============================================================================

export const BRAND = {
  navy: '#042344',
  blue: '#004c71',
  lime: '#bad31e',
  black: '#000000',
  white: '#ffffff',
  // Logo-Zwischentöne (nur für Logo/Illustrationen, nicht Teil der Kernpalette)
  teal: '#3fb59b',
  limeLight: '#c9dd52'
};

// 10-stufige Primärskala um das Tiefblau (#004c71); dunkle Stufe 7 = Nachtblau.
// Index-Konvention wie @ant-design/colors: [0]=lighter … [5]=main … [9]=900
export const brandBlueScale = [
  '#e8f3f8', // 0 lighter
  '#c2dfeb', // 1
  '#97c9dc', // 2
  '#6db2cc', // 3 light
  '#3d94b5', // 4
  '#004c71', // 5 main
  '#003a58', // 6 dark
  '#042344', // 7 (Nachtblau)
  '#021830', // 8 darker
  '#010e1d' // 9
];

// 10-stufige Akzentskala um die Limette (#bad31e) – für Hervorhebungen,
// Charts und Exporte (nicht als semantisches success/warning verwenden).
export const brandLimeScale = [
  '#fdfeed', // 0
  '#f8fbcf', // 1
  '#eff3a4', // 2
  '#e2e878', // 3
  '#d0de4a', // 4
  '#bad31e', // 5 main
  '#93ad10', // 6
  '#6d8705', // 7
  '#4a6100', // 8
  '#2b3b00' // 9
];

export const LOGO_BAR_COLORS = [BRAND.navy, BRAND.blue, BRAND.teal, BRAND.lime, BRAND.limeLight];
