'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { getKunde, ENGAGEMENT_STATUS, LANGDOCK_STATUS, KONTEXTPROFIL_TYPEN } from 'lib/kunden-store';

// assets
import { ArrowLeftOutlined, CheckCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';

function Zeile({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" align="right">
        {value ?? '–'}
      </Typography>
    </Stack>
  );
}

// ==============================|| KUNDENAKTE - ÜBERSICHT (PRD S-04) ||============================== //

export default function KundeDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const kunde = useMemo(() => getKunde(id), [id]);

  if (!kunde) {
    return (
      <MainCard title="Kunde nicht gefunden">
        <Button startIcon={<ArrowLeftOutlined />} onClick={() => router.push('/kunden')}>
          Zur Kundenliste
        </Button>
      </MainCard>
    );
  }

  const eng = ENGAGEMENT_STATUS[kunde.engagement?.status] || ENGAGEMENT_STATUS.discovery;
  const ld = LANGDOCK_STATUS[kunde.langdock_status] || LANGDOCK_STATUS.nicht_gestartet;

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button size="small" startIcon={<ArrowLeftOutlined />} color="secondary" onClick={() => router.push('/kunden')}>
              Kunden
            </Button>
            <Typography variant="h3">{kunde.name}</Typography>
            <Chip size="small" label={eng.label} color={eng.color} variant="light" />
          </Stack>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Stammdaten">
          <Stack spacing={1}>
            <Zeile label="Branche" value={kunde.branche} />
            <Zeile label="Mitarbeiter" value={kunde.mitarbeiterzahl} />
            <Divider sx={{ my: 0.5 }} />
            {(kunde.contacts || []).map((c, i) => (
              <Zeile key={i} label={c.rolle || 'Ansprechpartner'} value={`${c.name}${c.email ? ` · ${c.email}` : ''}`} />
            ))}
            {kunde.notizen && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {kunde.notizen}
                </Typography>
              </>
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Engagement (Retainer)">
          <Stack spacing={1}>
            <Zeile label="Status" value={eng.label} />
            <Zeile label="Retainer" value={kunde.engagement?.retainer_eur ? `${kunde.engagement.retainer_eur.toLocaleString('de-DE')} €/Monat` : null} />
            <Zeile label="Laufzeit" value={kunde.engagement?.laufzeit_monate ? `${kunde.engagement.laufzeit_monate} Monate` : null} />
            <Zeile label="Slots pro Monat" value={kunde.engagement?.slots_pro_monat} />
            <Zeile label="Start" value={kunde.engagement?.start_datum} />
            <Divider sx={{ my: 0.5 }} />
            <Zeile label="Langdock" value={ld.label} />
            <Zeile label="KI-Plattform" value={kunde.tool_landschaft?.plattform} />
            <Zeile label="Integrationen" value={(kunde.tool_landschaft?.integrationen || []).join(', ') || null} />
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Kontextprofil-Vollständigkeit">
          <List dense disablePadding>
            {KONTEXTPROFIL_TYPEN.map((t) => {
              const da = Boolean(kunde.kontextprofil?.[t.key]);
              return (
                <ListItem key={t.key} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {da ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ClockCircleTwoTone twoToneColor="#faad14" />}
                  </ListItemIcon>
                  <ListItemText primary={t.label} secondary={da ? 'vorhanden' : 'fehlt'} />
                </ListItem>
              );
            })}
          </List>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard>
          <Typography variant="body2" color="text.secondary">
            Dokumente, Use-Case-Pipeline, Priorisierung und Roadmap erscheinen hier als Tabs, sobald die Module aus Meilenstein M1/M2
            angebunden sind (PRD 5.2–5.6).
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
