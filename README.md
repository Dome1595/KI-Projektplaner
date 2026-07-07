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

Hinweis Branding: Bis die finalen Perspektivgeber-Assets vorliegen, verwendet die App eine Platzhalter-Wortmarke (`src/components/logo/`) und das neutrale Mantis-Theme (`src/themes/`).

## Kern in einem Satz

Aus Kontextprofil + Transkript wird in Minuten eine belegte, priorisierte Use-Case-Pipeline – und daraus eine präsentierbare Monats-Roadmap über die Retainer-Laufzeit (1–3 Umsetzungen pro Monat, Start immer mit Langdock-Setup + Erstprojekt).
