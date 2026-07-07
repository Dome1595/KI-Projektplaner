'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

/**
 * Platzhalter-Icon (Kurzmarke), bis die finalen Perspektivgeber-Branding-Assets
 * vorliegen (PRD Kapitel 12).
 */

// ==============================|| LOGO ICON ||============================== //

export default function LogoIcon() {
  const theme = useTheme();
  return (
    <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: theme.vars.palette.primary.main, lineHeight: 1 }}>
      KP
    </Typography>
  );
}
