// =============================================================================
// Beispieldaten für die Kundenverwaltung (Mock-Betrieb ohne Supabase).
// Feldnamen entsprechen dem Datenbankschema (supabase/migrations/0001).
// =============================================================================

export const KUNDEN_SEED = [
  {
    id: 'demo-heizungsbau-krause',
    name: 'Heizungsbau Krause GmbH',
    branche: 'SHK / Handwerk',
    mitarbeiterzahl: 42,
    notizen: 'Discovery-Termin am 24.06. gelaufen, Transkript liegt vor.',
    tool_landschaft: { plattform: 'Langdock', integrationen: ['Outlook/M365', 'ERP: pds', 'SharePoint'] },
    langdock_status: 'in_einrichtung',
    engagement: {
      status: 'aktiv',
      retainer_eur: 3500,
      laufzeit_monate: 12,
      slots_pro_monat: 2,
      start_datum: '2026-07-01'
    },
    contacts: [{ name: 'Martin Krause', rolle: 'Geschäftsführer', email: 'krause@example.de', typ: 'entscheider' }],
    kontextprofil: { rollenprofil: true, firmenprofil: true, team_kontext: true, prioritaeten_ziele: false, kommunikationsstil: true }
  },
  {
    id: 'demo-elektro-siedler',
    name: 'Elektro Siedler & Söhne',
    branche: 'Elektro / Handwerk',
    mitarbeiterzahl: 18,
    notizen: 'Angebot für 6-Monats-Retainer versendet.',
    tool_landschaft: { plattform: 'Langdock', integrationen: ['Outlook/M365'] },
    langdock_status: 'nicht_gestartet',
    engagement: {
      status: 'angebot',
      retainer_eur: 2000,
      laufzeit_monate: 6,
      slots_pro_monat: 1,
      start_datum: null
    },
    contacts: [{ name: 'Jana Siedler', rolle: 'Prokuristin', email: 'siedler@example.de', typ: 'entscheider' }],
    kontextprofil: { rollenprofil: true, firmenprofil: true, team_kontext: false, prioritaeten_ziele: false, kommunikationsstil: false }
  },
  {
    id: 'demo-tischlerei-brandt',
    name: 'Tischlerei Brandt',
    branche: 'Holz / Handwerk',
    mitarbeiterzahl: 9,
    notizen: 'Erstgespräch vereinbart.',
    tool_landschaft: { plattform: null, integrationen: [] },
    langdock_status: 'nicht_gestartet',
    engagement: {
      status: 'discovery',
      retainer_eur: null,
      laufzeit_monate: null,
      slots_pro_monat: 2,
      start_datum: null
    },
    contacts: [{ name: 'Ole Brandt', rolle: 'Inhaber', email: 'brandt@example.de', typ: 'entscheider' }],
    kontextprofil: { rollenprofil: false, firmenprofil: false, team_kontext: false, prioritaeten_ziele: false, kommunikationsstil: false }
  }
];
