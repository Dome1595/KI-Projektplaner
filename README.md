# KI-Projektplaner

Interne Anwendung für Perspektivgeber: identifiziert, qualifiziert und priorisiert KI-Use-Cases (Skills, Agenten, Workflows, Anwendungen) aus Kunden-Kontextprofilen und Termin-Transkripten und stellt sie als Umsetzungs-Roadmap für das Retainer-Modell dar.

## Status

Meilenstein **M1 (Fundament)** in Arbeit – App-Grundgerüst steht, Datenmodell folgt.

➡️ **[PRD.md](./PRD.md)** – Product Requirements Document (Version 2.0, inkl. Review-Entscheidungen)
➡️ **[docs/vertragsklausel-entwurf.md](./docs/vertragsklausel-entwurf.md)** – Entwurf KI-/Datenschutz-Vertragsklausel (anwaltlich prüfen lassen)

## Tech-Stack

- **Frontend/App:** Next.js (App Router) + Material UI – auf Basis des [Mantis Free React Admin Templates](https://mantisdashboard.com/free) (MIT-Lizenz), Details in PRD Kapitel 6
- **Datenbank:** PostgreSQL/Supabase (EU) – Schema unter `supabase/`
- **KI:** Claude API (4-stufige Analyse-Pipeline, PRD Kapitel 9.3)
- **Login:** Microsoft 365 SSO (Entra ID) – folgt in M1

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungs-Server auf http://localhost:3000
npm run build    # Produktions-Build
npm run lint     # ESLint
```

Branding: Markenfarben Institut Perspektive Handwerk (`themes/brand.js` – Tiefblau `#004c71`, Nachtblau `#042344`, Limette `#bad31e`), Logo-Komponenten unter `src/components/logo/`.

### Datenbetrieb (Mock vs. Supabase)

Ohne Konfiguration läuft die App im **Mock-Betrieb** (localStorage mit Beispieldaten). Für den **Supabase-Betrieb**:

1. Schema einspielen: `supabase/migrations/0001_initial_schema.sql` (per Supabase-MCP, `supabase db push` oder SQL-Editor)
2. `.env.example` als `.env.local` kopieren und `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` befüllen
3. Neu bauen/starten – die Provider-Weiche (`src/lib/kunden-api.js`) schaltet automatisch auf Supabase (Server Actions, service_role nur serverseitig)

## Kern in einem Satz

Aus Kontextprofil + Transkript wird in Minuten eine belegte, priorisierte Use-Case-Pipeline – und daraus eine präsentierbare Monats-Roadmap über die Retainer-Laufzeit (1–3 Umsetzungen pro Monat, Start immer mit Langdock-Setup + Erstprojekt).
