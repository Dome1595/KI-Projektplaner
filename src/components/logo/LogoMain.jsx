'use client';

// material-ui
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import LogoIcon from './LogoIcon';
import { BRAND } from '../../../themes/brand';

/**
 * Wortmarke der Anwendung: Logo-Symbol + App-Name, darunter der Institutsname.
 * Farben gemäß Markenvorgabe (PRD Kapitel 12).
 */

// ==============================|| LOGO ||============================== //

export default function LogoMain() {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <LogoIcon size={34} />
      <Box>
        <Typography variant="h5" component="span" sx={{ display: 'block', fontWeight: 700, color: BRAND.navy, lineHeight: 1.1 }}>
          KI-Projektplaner
        </Typography>
        <Typography variant="caption" component="span" sx={{ display: 'block', color: 'text.secondary', lineHeight: 1.2 }}>
          Institut Perspektive Handwerk
        </Typography>
      </Box>
    </Stack>
  );
}
