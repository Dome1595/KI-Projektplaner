'use client';

// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| EINSTELLUNGEN ||============================== //

export default function EinstellungenView() {
  return (
    <MainCard title="Einstellungen">
      <Typography variant="body2">
        Hier entstehen Nutzerverwaltung, KI-Konfiguration (Modell, Prompt-Versionen) und Branding für Exporte (PRD 5.9, Screen S-12).
      </Typography>
    </MainCard>
  );
}
