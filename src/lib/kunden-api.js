'use client';

// project imports
import * as mock from './kunden-store';
import { listKundenAction, getKundeAction, createKundeAction } from 'app/actions/kunden';

// =============================================================================
// Datenschicht Kundenverwaltung – Provider-Weiche.
// Ist NEXT_PUBLIC_SUPABASE_URL gesetzt, laufen alle Zugriffe über die
// Server Actions gegen Supabase; andernfalls über den lokalen Mock-Provider
// (localStorage, Seed-Daten) – z. B. für Entwicklung ohne Datenbank.
// =============================================================================

export const SUPABASE_AKTIV = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

function entpacke(result) {
  if (result.error) throw new Error(result.error);
  return result.data;
}

export async function listKunden() {
  if (!SUPABASE_AKTIV) return mock.listKunden();
  return entpacke(await listKundenAction());
}

export async function getKunde(id) {
  if (!SUPABASE_AKTIV) return mock.getKunde(id);
  return entpacke(await getKundeAction(id));
}

export async function createKunde(input) {
  if (!SUPABASE_AKTIV) return mock.createKunde(input);
  return entpacke(await createKundeAction(input));
}
