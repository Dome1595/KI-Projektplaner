'use client';

import { useEffect, useState } from 'react';
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
import { ENGAGEMENT_STATUS, LANGDOCK_STATUS, MITARBEITER_PROFIL_TYPEN } from 'lib/kunden-store';
import { getKunde } from 'lib/kunden-api';

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
  const [kunde, setKunde] = useState(null);
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    setLaedt(true);
    getKunde(id)
      .then((k) => setKunde(k))
      .finally(() => setLaedt(false));
  }, [id]);

  if (laedt) return null;

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
              <Zeile
                key={i}
                label={[c.abteilung, c.position].filter(Boolean).join(' / ') || c.rolle || 'Ansprechpartner'}
                value={`${c.name}${c.email ? ` · ${c.email}` : ''}`}
              />
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
        <MainCard title="Kontextprofile (pro Mitarbeiter)">
          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {kunde.firmenprofil_vorhanden ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ClockCircleTwoTone twoToneColor="#faad14" />}
              </ListItemIcon>
              <ListItemText primary="Firmenprofil" secondary={kunde.firmenprofil_vorhanden ? 'vorhanden' : 'fehlt'} />
            </ListItem>
          </List>
          {(kunde.contacts || []).map((c, idx) => {
            const offen = MITARBEITER_PROFIL_TYPEN.filter((t) => !c.kontextprofil?.[t.key]);
            return (
              <div key={idx}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">
                  {c.name}
                  {c.abteilung || c.position ? ` · ${[c.abteilung, c.position].filter(Boolean).join(' / ')}` : ''}
                </Typography>
                <List dense disablePadding>
                  {MITARBEITER_PROFIL_TYPEN.map((t) => {
                    const da = Boolean(c.kontextprofil?.[t.key]);
                    return (
                      <ListItem key={t.key} disableGutters sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {da ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ClockCircleTwoTone twoToneColor="#faad14" />}
                        </ListItemIcon>
                        <ListItemText primary={t.label} secondary={da ? 'vorhanden' : 'fehlt'} />
                      </ListItem>
                    );
                  })}
                </List>
                {offen.length === 0 && (
                  <Typography variant="caption" color="success.main">
                    Profil vollständig – bereit für die Analyse
                  </Typography>
                )}
              </div>
            );
          })}
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
