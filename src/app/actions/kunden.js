'use server';

// project imports
import { getServerClient } from 'lib/supabase-server';

// =============================================================================
// Server Actions Kundenverwaltung – Supabase-Provider.
// Liefert Daten in derselben Struktur wie der Mock-Provider
// (lib/kunden-store.js), damit die Views providerunabhängig bleiben.
// Hinweis: Läuft mit service_role, bis das M365-SSO (PRD 7.3) angebunden ist;
// danach werden die Aufrufe an die Nutzer-Session gekoppelt.
// =============================================================================

const MITARBEITER_PROFIL_TYPEN = ['rollenprofil', 'team_kontext', 'prioritaeten_ziele', 'kommunikationsstil'];

function mapKunde(row) {
  const engagements = [...(row.engagements || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const eng = engagements[0] || {};
  const aktuelleDokumente = (row.documents || []).filter((d) => d.ist_aktuell);
  const firmenprofilVorhanden = aktuelleDokumente.some((d) => d.typ === 'firmenprofil');
  const profilJeKontakt = (contactId) =>
    Object.fromEntries(
      MITARBEITER_PROFIL_TYPEN.map((t) => [t, aktuelleDokumente.some((d) => d.typ === t && d.contact_id === contactId)])
    );
  return {
    id: row.id,
    name: row.name,
    branche: row.branche,
    mitarbeiterzahl: row.mitarbeiterzahl,
    notizen: row.notizen,
    tool_landschaft: row.tool_landschaft || { plattform: null, integrationen: [] },
    langdock_status: row.langdock_status,
    engagement: {
      status: eng.status || 'discovery',
      retainer_eur: eng.retainer_eur != null ? Number(eng.retainer_eur) : null,
      laufzeit_monate: eng.laufzeit_monate || null,
      slots_pro_monat: eng.slots_pro_monat ?? null,
      start_datum: eng.start_datum || null
    },
    firmenprofil_vorhanden: firmenprofilVorhanden,
    contacts: (row.contacts || []).map((c) => ({
      id: c.id,
      name: c.name,
      rolle: c.rolle,
      abteilung: c.abteilung,
      position: c.position,
      email: c.email,
      typ: c.typ,
      kontextprofil: profilJeKontakt(c.id)
    }))
  };
}

const SELECT = '*, engagements(*), contacts(*), documents(typ, ist_aktuell, contact_id)';

export async function listKundenAction() {
  const sb = getServerClient();
  if (!sb) return { error: 'supabase_nicht_konfiguriert' };
  const { data, error } = await sb.from('customers').select(SELECT).is('archiviert_am', null).order('created_at', { ascending: false });
  if (error) return { error: error.message };
  return { data: data.map(mapKunde) };
}

export async function getKundeAction(id) {
  const sb = getServerClient();
  if (!sb) return { error: 'supabase_nicht_konfiguriert' };
  const { data, error } = await sb.from('customers').select(SELECT).eq('id', id).maybeSingle();
  if (error) return { error: error.message };
  return { data: data ? mapKunde(data) : null };
}

export async function createKundeAction(input) {
  const sb = getServerClient();
  if (!sb) return { error: 'supabase_nicht_konfiguriert' };

  const { data: kunde, error: fehlerKunde } = await sb
    .from('customers')
    .insert({
      name: input.name,
      branche: input.branche || null,
      mitarbeiterzahl: input.mitarbeiterzahl ? Number(input.mitarbeiterzahl) : null,
      notizen: input.notizen || null,
      tool_landschaft: { plattform: input.plattform || 'Langdock', integrationen: input.integrationen || [] },
      langdock_status: input.langdock_status || 'nicht_gestartet'
    })
    .select('id')
    .single();
  if (fehlerKunde) return { error: fehlerKunde.message };

  const { error: fehlerEngagement } = await sb.from('engagements').insert({
    customer_id: kunde.id,
    status: input.engagement_status || 'discovery',
    retainer_eur: input.retainer_eur ? Number(input.retainer_eur) : null,
    laufzeit_monate: input.laufzeit_monate ? Number(input.laufzeit_monate) : null,
    slots_pro_monat: input.slots_pro_monat ? Number(input.slots_pro_monat) : 2,
    start_datum: input.start_datum || null
  });
  if (fehlerEngagement) return { error: fehlerEngagement.message };

  if (input.ansprechpartner) {
    const { error: fehlerKontakt } = await sb.from('contacts').insert({
      customer_id: kunde.id,
      name: input.ansprechpartner,
      rolle: input.ansprechpartner_rolle || null,
      abteilung: input.ansprechpartner_abteilung || null,
      position: input.ansprechpartner_position || null,
      email: input.ansprechpartner_email || null,
      typ: 'entscheider'
    });
    if (fehlerKontakt) return { error: fehlerKontakt.message };
  }

  return await getKundeAction(kunde.id);
}
