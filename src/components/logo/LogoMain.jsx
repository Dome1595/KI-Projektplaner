'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

/**
 * Platzhalter-Wortmarke, bis die finalen Perspektivgeber-Branding-Assets
 * vorliegen (PRD Kapitel 12). Beim Austausch nur diese Komponente und
 * LogoIcon.jsx ersetzen.
 */

// ==============================|| LOGO ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: theme.vars.palette.primary.main, lineHeight: 1 }}>
      KI-Projektplaner
    </Typography>
  );
}
