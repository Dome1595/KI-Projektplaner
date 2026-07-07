'use client';

// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| KUNDEN ||============================== //

export default function KundenView() {
  return (
    <MainCard title="Kunden">
      <Typography variant="body2">
        Hier entsteht die Kundenliste mit Suche, Engagement-Status und Kontextprofil-Vollständigkeit (PRD 5.1, Screen S-03). Die
        Funktionalität folgt mit Meilenstein M1 nach Anbindung des Supabase-Schemas.
      </Typography>
    </MainCard>
  );
}
