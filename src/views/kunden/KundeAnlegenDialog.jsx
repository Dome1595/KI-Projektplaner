'use client';

import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import { createKunde, ENGAGEMENT_STATUS, LANGDOCK_STATUS } from 'lib/kunden-store';

const validation = Yup.object().shape({
  name: Yup.string().max(120).required('Firmenname ist Pflicht'),
  engagement_status: Yup.string().required('Status ist Pflicht'),
  retainer_eur: Yup.number().min(0).nullable(),
  laufzeit_monate: Yup.number().oneOf([6, 12]).nullable(),
  slots_pro_monat: Yup.number().min(1).max(3).required(),
  mitarbeiterzahl: Yup.number().min(1).nullable(),
  ansprechpartner_email: Yup.string().email('Keine gültige E-Mail').nullable()
});

const initial = {
  name: '',
  branche: '',
  mitarbeiterzahl: '',
  ansprechpartner: '',
  ansprechpartner_rolle: '',
  ansprechpartner_email: '',
  engagement_status: 'discovery',
  retainer_eur: '',
  laufzeit_monate: '',
  slots_pro_monat: 2,
  langdock_status: 'nicht_gestartet',
  notizen: ''
};

// ==============================|| KUNDE ANLEGEN (PRD 5.1 / US-002) ||============================== //

export default function KundeAnlegenDialog({ open, onClose, onCreated }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Formik
        initialValues={initial}
        validationSchema={validation}
        onSubmit={(values, { resetForm }) => {
          const kunde = createKunde(values);
          resetForm();
          onCreated(kunde);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <DialogTitle>Kunde anlegen</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ pt: 0.5 }}>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    required
                    label="Firmenname"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Mitarbeiter" name="mitarbeiterzahl" type="number" value={values.mitarbeiterzahl} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Branche" name="branche" value={values.branche} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField select fullWidth label="Langdock-Status" name="langdock_status" value={values.langdock_status} onChange={handleChange}>
                    {Object.entries(LANGDOCK_STATUS).map(([wert, cfg]) => (
                      <MenuItem key={wert} value={wert}>
                        {cfg.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField fullWidth label="Ansprechpartner" name="ansprechpartner" value={values.ansprechpartner} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField fullWidth label="Rolle" name="ansprechpartner_rolle" value={values.ansprechpartner_rolle} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    name="ansprechpartner_email"
                    value={values.ansprechpartner_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.ansprechpartner_email && errors.ansprechpartner_email)}
                    helperText={touched.ansprechpartner_email && errors.ansprechpartner_email}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField select fullWidth label="Engagement-Status" name="engagement_status" value={values.engagement_status} onChange={handleChange}>
                    {Object.entries(ENGAGEMENT_STATUS).map(([wert, cfg]) => (
                      <MenuItem key={wert} value={wert}>
                        {cfg.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField fullWidth label="Retainer (€/Monat)" name="retainer_eur" type="number" value={values.retainer_eur} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <TextField select fullWidth label="Laufzeit" name="laufzeit_monate" value={values.laufzeit_monate} onChange={handleChange}>
                    <MenuItem value="">–</MenuItem>
                    <MenuItem value={6}>6 Monate</MenuItem>
                    <MenuItem value={12}>12 Monate</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 6, sm: 2.5 }}>
                  <TextField select fullWidth label="Slots/Monat" name="slots_pro_monat" value={values.slots_pro_monat} onChange={handleChange}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth multiline minRows={2} label="Notizen" name="notizen" value={values.notizen} onChange={handleChange} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit" variant="contained">
                Anlegen
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

KundeAnlegenDialog.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, onCreated: PropTypes.func };
