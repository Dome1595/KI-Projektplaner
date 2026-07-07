# Supabase-Schema

Datenbankschema des KI-Projektplaners gemäß PRD Kapitel 9.2 (Datenmodell), 4.5 (Statusmodell) und 7.3 (RLS/DSGVO).

## Anwenden

**Variante A – Supabase CLI (empfohlen):**

```bash
supabase link --project-ref <projekt-ref>   # einmalig, EU-Region wählen
supabase db push                            # wendet supabase/migrations/ an
```

**Variante B – SQL-Editor:** Inhalt von `migrations/0001_initial_schema.sql` im Supabase-Dashboard (SQL Editor) ausführen.

## Aufbau

| Tabelle | Zweck (PRD-Referenz) |
|---|---|
| `app_users` | Interne Nutzer, verknüpft mit Supabase Auth / Entra ID (5.9) |
| `customers`, `contacts` | Kunden, Ansprechpartner, Tool-Landschaft, Langdock-Status (5.1) |
| `engagements` | Retainer: Status, Höhe, Laufzeit 6/12, Slots 1–3 (5.1) |
| `documents` | Kontextprofile & Transkripte, versioniert über `vorgaenger_id`/`ist_aktuell` (5.2) |
| `analysis_runs` | Protokoll der Analyse-Läufe inkl. Prompt-/Modell-Version (5.3 A, 7.4) |
| `use_cases` | Karte, Belege, Qualifizierung, Arbeitsanweisung, Scoring, Status (5.3–5.5) |
| `roadmap_slots` | Monats-Slots je Engagement inkl. Historie, `sondertyp` für Langdock-Setup (5.6) |
| `exports` | Export-Protokoll (5.7) |
| `prompt_versions` | Versionierte Analyse-Prompts, genau eine aktive je Stufe (5.9, 7.5) |
| `deletion_log` | DSGVO-Löschprotokoll ohne Personenbezug (7.3, US-014) |

## Wichtige Invarianten (per Constraint abgesichert)

- Genau **eine ⭐-Empfehlung** pro Kunde (`uq_use_cases_empfehlung`)
- Genau **eine aktive Prompt-Version** je Pipeline-Stufe (`uq_prompt_versions_aktiv`)
- **Verworfene Use Cases** brauchen eine Begründung (`chk_verworfen_begruendung`)
- Slot ist **frei, Use Case oder Sonderbelegung** – nie beides (`chk_slot_belegung`)
- Ein Slot je `(engagement, monat, slot_nr)`; Monat 1–12, Slot-Nr. 1–3, Laufzeit 6/12
- **DSGVO-Löschung:** `delete from customers where id = ...` kaskadiert über alle Fachtabellen (Storage-Objekte separat löschen, Eintrag in `deletion_log` schreiben)

## Status & Advisor-Hinweise

- Migrationen `0001` + `0002` sind am **07.07.2026** in das Projekt `naallvmyawfmkqzrlxie` eingespielt (11 Tabellen, RLS überall aktiv, Roundtrip-Test bestanden).
- Akzeptierter Advisor-Hinweis (Lint 0029): `is_active_internal_user()` ist für `authenticated` ausführbar. Das ist beabsichtigt – die RLS-Policies werten die Funktion im Kontext des anfragenden Nutzers aus; sie verrät nur, ob der Aufrufer selbst ein aktiver interner Nutzer ist.

## RLS-Modell (MVP)

Interne Anwendung ohne Kundenzugang: Alle Tabellen haben RLS aktiv; Vollzugriff nur für **aktive interne Nutzer** (`is_active_internal_user()`, Eintrag in `app_users` mit `aktiv = true`). Die Nutzerverwaltung (Einladen/Deaktivieren) läuft über die Service-Role. Bei Ausbaustufe 2 (Kundenportal) kommen kundenbezogene Policies hinzu.
