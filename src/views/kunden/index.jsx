'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import KundeAnlegenDialog from './KundeAnlegenDialog';
import { listKunden, ENGAGEMENT_STATUS, LANGDOCK_STATUS, kontextprofilStand } from 'lib/kunden-store';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| KUNDEN - LISTE (PRD S-03) ||============================== //

export default function KundenView() {
  const router = useRouter();
  const [kunden, setKunden] = useState(() => listKunden());
  const [suche, setSuche] = useState('');
  const [statusFilter, setStatusFilter] = useState('alle');
  const [dialogOffen, setDialogOffen] = useState(false);

  const gefiltert = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return kunden.filter((k) => {
      const trifftSuche = !s || k.name.toLowerCase().includes(s) || (k.branche || '').toLowerCase().includes(s);
      const trifftStatus = statusFilter === 'alle' || k.engagement?.status === statusFilter;
      return trifftSuche && trifftStatus;
    });
  }, [kunden, suche, statusFilter]);

  return (
    <MainCard
      title="Kunden"
      secondary={
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setDialogOffen(true)}>
          Kunde anlegen
        </Button>
      }
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          placeholder="Suchen (Name, Branche)…"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }
          }}
        />
        <TextField
          select
          size="small"
          label="Engagement-Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="alle">Alle</MenuItem>
          {Object.entries(ENGAGEMENT_STATUS).map(([wert, cfg]) => (
            <MenuItem key={wert} value={wert}>
              {cfg.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kunde</TableCell>
              <TableCell>Engagement</TableCell>
              <TableCell align="right">Retainer</TableCell>
              <TableCell align="center">Laufzeit</TableCell>
              <TableCell align="center">Slots/Monat</TableCell>
              <TableCell>Langdock</TableCell>
              <TableCell align="center">Kontextprofil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gefiltert.map((k) => {
              const eng = ENGAGEMENT_STATUS[k.engagement?.status] || ENGAGEMENT_STATUS.discovery;
              const ld = LANGDOCK_STATUS[k.langdock_status] || LANGDOCK_STATUS.nicht_gestartet;
              const profil = kontextprofilStand(k);
              const vollstaendig = profil.vorhanden === profil.gesamt;
              return (
                <TableRow key={k.id} hover sx={{ cursor: 'pointer' }} onClick={() => router.push(`/kunden/${k.id}`)}>
                  <TableCell>
                    <Typography variant="subtitle1">{k.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {k.branche || '–'}
                      {k.mitarbeiterzahl ? ` · ${k.mitarbeiterzahl} MA` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={eng.label} color={eng.color} variant="light" />
                  </TableCell>
                  <TableCell align="right">
                    {k.engagement?.retainer_eur ? `${k.engagement.retainer_eur.toLocaleString('de-DE')} €/M` : '–'}
                  </TableCell>
                  <TableCell align="center">{k.engagement?.laufzeit_monate ? `${k.engagement.laufzeit_monate} M` : '–'}</TableCell>
                  <TableCell align="center">{k.engagement?.slots_pro_monat ?? '–'}</TableCell>
                  <TableCell>
                    <Chip size="small" label={ld.label} color={ld.color} variant="light" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      variant="outlined"
                      color={vollstaendig ? 'success' : 'warning'}
                      label={`${profil.vorhanden}/${profil.gesamt}`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {gefiltert.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Keine Kunden gefunden – lege den ersten Kunden über „Kunde anlegen" an.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <KundeAnlegenDialog
        open={dialogOffen}
        onClose={() => setDialogOffen(false)}
        onCreated={(kunde) => {
          setKunden(listKunden());
          setDialogOffen(false);
          router.push(`/kunden/${kunde.id}`);
        }}
      />
    </MainCard>
  );
}
