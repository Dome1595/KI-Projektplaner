# Product Requirements Document: KI-Projektplaner

**Produkt:** KI-Projektplaner (interne Anwendung)
**Organisation:** Perspektivgeber
**Version:** 2.0
**Datum:** 07. Juli 2026
**Verantwortlich:** Dominik Walter
**Status:** Entwurf zur Freigabe

---

## Inhalt

1. [Executive Summary](#1-executive-summary)
2. [Strategischer Kontext](#2-strategischer-kontext)
3. [Zielgruppen & Personas](#3-zielgruppen--personas)
4. [Fachliches Konzept & Begriffsmodell](#4-fachliches-konzept--begriffsmodell)
5. [Funktionale Anforderungen](#5-funktionale-anforderungen)
6. [Benutzeroberfläche & Design](#6-benutzeroberfläche--design)
7. [Nicht-funktionale Anforderungen](#7-nicht-funktionale-anforderungen)
8. [User Stories](#8-user-stories)
9. [Technische Architektur](#9-technische-architektur)
10. [Ausbaustufen & Abgrenzung](#10-ausbaustufen--abgrenzung)
11. [Meilensteine & Risiken](#11-meilensteine--risiken)
12. [Annahmen & offene Punkte](#12-annahmen--offene-punkte)

---

## 1. Executive Summary

Der KI-Projektplaner ist eine interne Web-Anwendung für Perspektivgeber, die aus Kunden-Kontextprofilen und Termin-Transkripten systematisch KI-Projekte und Anwendungsfälle (Skills, Agenten, Workflows, Anwendungen) **identifiziert, qualifiziert, priorisiert und als Umsetzungs-Roadmap darstellt**.

Die Anwendung operationalisiert die bewährte **Use-Case-Finder-Methodik** (Quick Wins identifizieren → Use Case qualifizieren → Use Case konzipieren) als durchgängige, persistente Analyse-Engine – statt wie bisher als einzelne, flüchtige Chat-Sessions pro Person.

**Geschäftlicher Zweck:** Der KI-Projektplaner ist das zentrale Delivery- und Vertriebswerkzeug für das Retainer-Modell von Perspektivgeber: Kunden buchen einen Retainer zwischen 2.000 und 5.000 € pro Monat über 6 oder 12 Monate, in dem jeden Monat 1–3 Projekte und Anwendungsfälle nach gemeinsam priorisierter Liste umgesetzt werden. Zum Start wird immer Langdock als KI-Betriebssystem eingeführt und ein erstes Projekt mit sofort sichtbarem Nutzen umgesetzt (Referenzbeispiel: E-Mail-Skill – Kundendaten aus dem ERP abrufen, E-Mail im eigenen Stil formulieren, Ablage in den Outlook-Entwürfen mit Signatur).

**Kernnutzen:**

- **Schnellere Discovery:** Von Kontextprofil und Termin-Transkript zu einer präsentierbaren, priorisierten Use-Case-Liste in unter einem Arbeitstag statt mehrerer manueller Chat-Sessions
- **Verkaufsfertige Roadmaps:** Die priorisierte Liste wird per Knopfdruck zu einer Monats-Roadmap über die Retainer-Laufzeit – die inhaltliche Grundlage jedes Retainer-Angebots und jedes Monats-Reviews
- **Nichts geht verloren:** Erkenntnisse aus Transkripten und Gesprächen werden systematisch erfasst, mit Belegen versehen und der Use-Case-Pipeline des Kunden zugeordnet
- **Konsistente Qualität:** Jeder Use Case durchläuft dieselbe Qualifizierung (Wochenhebel, Reichweite, Risiken, Umsetzungstyp) und endet in einer umsetzungsreifen Arbeitsanweisung
- **Übersicht über alle Kunden:** Pipeline-Status, Slot-Auslastung und anstehende Umsetzungen aller Retainer auf einen Blick

**Technische Leitentscheidungen (Kurzfassung):** Web-Anwendung auf Basis des **Mantis Admin-Templates (Next.js-Variante, Material UI)**, Datenhaltung in **PostgreSQL/Supabase (EU)**, KI-Analyse direkt über die **Claude API** (AVV, keine Trainingsnutzung), Anmeldung per **Microsoft 365 SSO**. Details in Kapitel 9.

---

## 2. Strategischer Kontext

### 2.1 Einordnung ins Geschäftsmodell

Perspektivgeber begleitet mittelständische Unternehmen bei der Einführung von KI im Arbeitsalltag. Das Zielmodell ist der **Umsetzungs-Retainer**:

| Eckdaten | Wert |
|---|---|
| Retainer-Volumen | 2.000 – 5.000 € pro Monat |
| Laufzeit | 6 oder 12 Monate |
| Leistung | 1–3 umgesetzte Projekte/Anwendungsfälle pro Monat nach Prioritätenliste |
| Onboarding (Monat 1, fix) | Langdock-Einführung als KI-Betriebssystem + Erstprojekt |

Das Erstprojekt ist bewusst ein schnell sichtbarer Nutzen-Beweis. Referenzbeispiel **E-Mail-Skill**: Kundendaten aus dem ERP abrufen → E-Mail im Kommunikationsstil des Nutzers formulieren → Ablage als Entwurf in Outlook inkl. Signatur.

Der KI-Projektplaner adressiert damit zwei Phasen des Geschäftsmodells:

1. **Vertrieb (Discovery → Angebot):** Die aus Discovery-Terminen generierte, priorisierte Roadmap ist das zentrale Argument für den Retainer-Abschluss – „Das setzen wir in den nächsten 6/12 Monaten für euch um."
2. **Delivery (Laufzeit):** Die Roadmap steuert die monatlichen Umsetzungs-Slots, dokumentiert Fortschritt und liefert die Grundlage für Monats-Reviews, Nutzen-Bilanzen und Verlängerungsgespräche.

### 2.2 Problemstellung

Aktuelle Herausforderungen im Discovery- und Delivery-Prozess:

- Die Use-Case-Findung läuft heute manuell über den Use-Case-Finder im Chat – pro Person, pro Session, ohne persistente Ablage über den Chat hinaus
- Erkenntnisse aus Termin-Transkripten (Pain Points, Aufgaben, Nebensätze wie „das macht bei uns jeder zweimal die Woche") werden nicht systematisch ausgewertet und gehen verloren
- Es gibt keine kundenübergreifende Übersicht: Welche Use Cases liegen bei welchem Kunden in welchem Status? Welche Umsetzungs-Slots sind im nächsten Monat frei?
- Roadmaps für Angebote und Monats-Reviews werden händisch in Folien und Dokumenten gebaut – zeitaufwändig und uneinheitlich
- Die Priorisierung folgt zwar der Wochenhebel-Logik, wird aber nicht standardisiert dokumentiert und ist später schwer nachvollziehbar
- Qualifizierte Use Cases und fertige Arbeitsanweisungen liegen verstreut (Chat-Verläufe, Markdown-Dateien, Ablagen) statt am Kunden

### 2.3 Erfolgskriterien

| Kriterium | Zielwert |
|---|---|
| Discovery-Geschwindigkeit | Kontextprofil + Transkript → präsentierbare, priorisierte Use-Case-Liste in **< 1 Arbeitstag** (Berateraufwand: Ziel < 2 Stunden) |
| Use-Case-Ausbeute | Ø **≥ 10 identifizierte** und **≥ 5 qualifizierte** Use Cases pro Kunde nach der Discovery-Phase |
| Retainer-Conversion | **+25 %** Abschlussquote von Discovery zu Retainer (Baseline im ersten Quartal nach Einführung erheben) |
| Slot-Auslastung | **≥ 90 %** der monatlichen Umsetzungs-Slots über alle aktiven Retainer sind zu Monatsbeginn mit konzipierten Use Cases belegt |
| Vollständige Nutzung | **100 %** der neuen Kundenprojekte laufen nach 3 Monaten über den KI-Projektplaner (kein paralleles Schatten-System) |
| Wiederverwendung | **100 %** der fertigen Arbeitsanweisungen (skill.md / agent.md / workflow.md) im System abgelegt und pro Kunde exportierbar |

---

## 3. Zielgruppen & Personas

### 3.1 Primäre Nutzer

**Persona 1: Berater / Inhaber („Dominik")**

- Führt Discovery-Termine, verantwortet Kundenbeziehung und Retainer-Abschluss
- Legt Kunden und Engagements an, lädt Kontextprofile und Transkripte hoch, startet Analysen
- Sichtet, korrigiert und qualifiziert die vorgeschlagenen Use Cases – teilweise live im Kundentermin
- Pflegt Priorisierung und Roadmap, erstellt Exporte für Angebote und Monats-Reviews
- Erwartung an das Tool: schnell, präsentierbar, keine Doppelpflege, verlässliche KI-Vorschläge mit Beleg

Im MVP ist dies ein kleines internes Team (1–5 Personen) ohne differenziertes Rollen- und Rechtemodell.

### 3.2 Sekundäre Nutzer

**Persona 2: Umsetzer (intern oder Freelancer)**

- Baut Skills, Agenten und Workflows beim Kunden (primär in Langdock)
- Arbeitet auf Basis der fertigen Arbeitsanweisungen aus dem System
- Aktualisiert den Umsetzungsstatus der Roadmap-Slots (In Umsetzung → Live)
- Erwartung: vollständige, widerspruchsfreie Arbeitsanweisungen ohne Rückfragen

**Persona 3: Kunde (Empfänger, kein Login im MVP)**

- Ansprechpartner beim Kunden (Geschäftsführung, Abteilungsleitung, Key-User)
- Erhält Ergebnisse als Exporte: priorisierte Roadmap (PDF/Markdown) für Angebot und Monats-Review, Quick-Win-Übersicht, fertige Arbeitsanweisungen
- Sieht Prioritäten- und Roadmap-Ansichten am Beamer im gemeinsamen Termin (Präsentationsmodus)
- Ein Read-only-Kundenportal ist als Ausbaustufe 2 vorgesehen (Kapitel 10)

---

## 4. Fachliches Konzept & Begriffsmodell

Dieses Kapitel definiert die fachlichen Kernbegriffe verbindlich. Sie stammen aus der etablierten Use-Case-Finder-Methodik und werden in UI, Datenmodell und KI-Prompts einheitlich verwendet.

### 4.1 Kontextprofil

Das Kontextprofil eines Kunden besteht aus fünf Dokumenttypen (je Kunde, teils je Person):

1. **Rollenprofil** – Rolle, Aufgaben, Pain Points einer Person
2. **Firmenprofil** – Unternehmen, Branche, Produkte, Organisation
3. **Team-Kontext** – Wer macht welche Aufgaben, Team-Größen, Vertretungen
4. **Prioritäten & Ziele** – Unternehmens- und Bereichsziele, Jahresprioritäten
5. **Kommunikationsstil** – Tonalität, Formulierungsmuster, Signaturen (Grundlage z. B. für den E-Mail-Skill)

Ergänzt um **Termin-Transkripte** (Discovery-Termine, Monats-Reviews) als fortlaufende Erkenntnisquelle.

### 4.2 Use Case & Quick-Win-Karte

Ein **Use Case** ist ein konkreter KI-Anwendungsfall eines Kunden. Er entsteht als **Quick-Win-Hypothese** (KI-Vorschlag oder manuell) und reift über Qualifizierung und Konzeption zur Umsetzung. Die Quick-Win-Karte ist das standardisierte Erfassungsformat:

| Feld | Inhalt |
|---|---|
| 📌 Aufgabe | Referenz auf konkrete Aufgabe aus Kontextprofil/Transkript |
| 🔖 Einordnung | Skill / Agent / Workflow / Anwendung (mit Kurzerklärung) |
| 🌍 Reichweite | 👤 Person / 👥 Team (X Personen) / 🏢 Abteilung |
| 😩 Problem | Pain Point / Zeitfresser |
| 🤖 KI-Lösung | Was macht die KI konkret? |
| 🛠 Tools/Daten | Plattform, Datenquellen (abgeglichen mit der Tool-Landschaft des Kunden) |
| 📊 Frequenz | ~X×/Tag bzw. ~X×/Woche |
| ⏱ Nutzen | Zeitersparnis × Frequenz = Wochenhebel + Gesamtnutzen bei Reichweite |

### 4.3 Einordnungs-Definitionen (verbindlich)

- 🟢 **Skill** = Schrittfolge steht beim Bauen fest. KI folgt einer vorgegebenen Arbeitsanweisung. Wird manuell, durch Agent oder Workflow gerufen.
- 🔵 **Agent** = KI entscheidet zur Laufzeit, welchen Schritt sie als nächstes macht. Ablauf nicht vollständig vorhersagbar. Wird immer von außen gerufen.
- 🟣 **Workflow** = Einzige Ebene mit eigenem Startmoment – externer Trigger. Feste Schrittfolge aus KI- und Nicht-KI-Schritten. Kein/minimaler manueller Eingriff.
- 🟠 **Anwendung** = Eigenständige Applikation mit eigener Oberfläche und Datenhaltung, die über einzelne Skills/Agenten/Workflows hinausgeht.

> **Daumenregel:** Steht beim Bauen fest, was in welcher Reihenfolge passiert? → Skill. Entscheidet die KI situativ? → Agent. Startet ein Trigger automatisch? → Workflow. Braucht es eigene Oberfläche und Datenhaltung? → Anwendung. Im Zweifel: Skill.

### 4.4 Priorisierungs-Logik

- **Wochenhebel** = Frequenz × Zeitersparnis pro Durchlauf × Reichweite. Label hoch/mittel/gering, hinterlegt mit Minuten pro Woche.
- **Hürde** = Umsetzungsaufwand und -komplexität (hoch/mittel/gering). Berücksichtigt Tool-Verfügbarkeit, Datenzugang, Genehmigungen (IT/Datenschutz), Standardisierungsgrad.
- **Empfehlung (⭐)** = genau ein Use Case pro Kunde mit dem besten Verhältnis aus Hebel und Hürde – der Kandidat, mit dem der Start sich am meisten lohnt.
- Der Score liefert den **Vorschlag**; die finale Reihenfolge legt der Berater (mit dem Kunden) manuell fest. Beides bleibt sichtbar.

### 4.5 Statusmodell

**Use-Case-Status (Pipeline):**

```
Idee → Qualifiziert → Konzipiert → In Umsetzung → Live
                 ↘ Verworfen (mit Begründung, jederzeit möglich)
```

| Status | Bedeutung | Eintrittsbedingung |
|---|---|---|
| Idee | Erfasste Quick-Win-Hypothese (KI oder manuell) | Karte angelegt, Beleg vorhanden (bei KI-Vorschlag) |
| Qualifiziert | Tiefen-Qualifizierung abgeschlossen | Alle Qualifizierungs-Abschnitte ausgefüllt, Umsetzungstyp mit Begründung |
| Konzipiert | Arbeitsanweisung fertig | Alle typspezifischen Felder vollständig, keine Platzhalter |
| In Umsetzung | Einem Roadmap-Slot zugeordnet und begonnen | Slot-Status „In Umsetzung" |
| Live | Beim Kunden produktiv | Slot-Status „Umgesetzt" |
| Verworfen | Bewusst aussortiert | Begründung erfasst |

**Slot-Status (Roadmap):** Geplant → In Umsetzung → Umgesetzt; alternativ Verschoben (mit Zielmonat, Historie bleibt erhalten).

**Engagement-Status:** Discovery → Angebot → Aktiv → Pausiert / Beendet.

### 4.6 Domänenmodell (Überblick)

```
Kunde (Customer)
 ├── Engagement (Retainer: Höhe, Laufzeit, Slots/Monat, Status)
 │     └── RoadmapSlot (Monat × Slot-Nr. → Use Case, Status)
 ├── Dokument (5 Kontextprofil-Typen, Transkripte, Sonstiges; versioniert)
 ├── AnalysisRun (Analyse-Lauf: Dokumente, Prompt-/Modellversion, Ergebnis)
 ├── UseCase (Karte, Belege, Qualifizierung, Arbeitsanweisung, Scoring, Status)
 └── Export (Roadmap-PDF/MD, Quick-Win-Übersicht, Arbeitsanweisungen)
```

---

## 5. Funktionale Anforderungen

Gliederung je Modul in **Must-have** (MVP-verbindlich), **Should-have** (MVP wenn Aufwand vertretbar), **Nice-to-have** (Ausbaustufen-Kandidat).

### 5.1 Kunden- & Engagement-Verwaltung

**Must-have:**

- Kunde anlegen/bearbeiten mit: Firmenname, Branche, Größe (Mitarbeiterzahl), Logo (optional), Notizen
- Ansprechpartner pro Kunde: Name, Rolle, E-Mail (mind. einer, mehrere möglich, mit Kennzeichnung Entscheider/Key-User/IT)
- Tool-Landschaft des Kunden erfassen: KI-Plattform (Standard: Langdock), Integrationen (Outlook/M365, ERP-System mit Name, CRM, Ablagen, Sonstige als Freitext) – Grundlage für die Umsetzbarkeitsprüfung der Analyse-Engine
- Engagement pro Kunde: Status (Discovery/Angebot/Aktiv/Pausiert/Beendet), Retainer-Höhe (€/Monat), Laufzeit (6/12 Monate), Start-/Enddatum, Umsetzungs-Slots pro Monat (1–3)
- Langdock-Setup-Status: Nicht gestartet / In Einrichtung / Live, mit Notizfeld (Workspace, Integrationen, Besonderheiten)
- Kundenliste mit Suche, Filter nach Engagement-Status, Sortierung
- Kunden-Übersichtsseite („Kundenakte") als Einstiegspunkt zu Dokumenten, Pipeline, Roadmap, Exporten

**Should-have:**

- Aktivitäten-Log pro Kunde (Uploads, Analysen, Statuswechsel, Exporte – wer, wann, was)
- Archivieren statt Löschen von Kunden (Löschen nur über DSGVO-Löschfunktion, siehe 7.3)

**Nice-to-have:**

- Wiedervorlagen/Erinnerungen (z. B. „Monats-Review vorbereiten", „Verlängerungsgespräch Monat 10")

### 5.2 Kontext- & Dokumenten-Management

**Must-have:**

- Upload von Dokumenten pro Kunde: Markdown, PDF, TXT, DOCX (max. 20 MB pro Datei); alternativ Text per Copy-Paste als Dokument anlegen
- Dokumenttyp-Zuordnung: Rollenprofil, Firmenprofil, Team-Kontext, Prioritäten & Ziele, Kommunikationsstil, Termin-Transkript, Sonstiges
- Bei Transkripten: Pflicht-Metadaten Termindatum und Teilnehmer; optional Terminart (Discovery/Review/Workshop)
- Bei Rollenprofilen und Kommunikationsstil: optionale Zuordnung zu einer Person (Ansprechpartner) – mehrere Personen pro Kunde möglich
- Automatischer Typ-Vorschlag durch die KI beim Upload, vom Berater bestätig- oder korrigierbar
- Dokumentliste pro Kunde mit Typ, Person, Datum, Version, Quelle; Volltext in der App einsehbar
- Versionierung: neue Version eines Dokuments ersetzt die alte in künftigen Analysen; alte Versionen bleiben einsehbar
- Vollständigkeits-Anzeige: Welche der fünf Kontextprofil-Typen liegen vor? (sichtbar in Kundenakte und Dashboard-Handlungsbedarf)
- Text-Extraktion aus PDF/DOCX serverseitig; bei fehlgeschlagener Extraktion klare Fehlermeldung und Copy-Paste als Ausweichweg

**Should-have:**

- Transkript-Vorverarbeitung: Sprecher-Erkennung und Abschnitts-Gliederung für präzisere Belege
- Vorschau der extrahierten Textfassung vor dem Speichern (Korrekturmöglichkeit)

**Nice-to-have:**

- Audio-Upload mit automatischer Transkription

### 5.3 KI-Analyse-Engine (Core Functionality)

Die Analyse-Engine ist die produktisierte Form des Use-Case-Finders. Sie arbeitet in drei Stufen, die den Methodik-Schritten entsprechen. Grundprinzip überall: **Die KI schlägt vor, der Berater entscheidet.**

#### A) Use-Case-Extraktion (Methodik-Schritt 1: Quick Wins identifizieren)

**Must-have:**

- Analyse-Lauf pro Kunde: Berater wählt die einzubeziehenden Dokumente (Standard: alle aktuellen Kontextprofile + neueste Transkripte) und startet die Analyse
- Ergebnis in ≤ 120 Sekunden: bis zu 10 Quick-Win-Hypothesen im Karten-Format (4.2), mit vorläufiger Einordnung (4.3), Frequenz- und Reichweiten-Schätzung sowie Wochenhebel-Label
- **Beleg-Pflicht:** Jeder Vorschlag referenziert seine Quelle (Transkript-Zitat mit Fundstelle oder Kontextprofil-Abschnitt). Vorschläge ohne Beleg werden systemseitig verworfen (Halluzinations-Schutz)
- Abgleich mit der Tool-Landschaft: Vorschläge nutzen nur beim Kunden verfügbare/anbindbare Tools; fehlende Voraussetzungen werden als solche ausgewiesen
- **Duplikat-Erkennung:** Abgleich neuer Vorschläge gegen die bestehende Pipeline des Kunden; erkannte Dubletten werden als „Ergänzung zu Use Case #X" markiert statt neu angelegt – der Berater entscheidet über Zusammenführung
- Ergebnisse landen als **Entwürfe im Review-Modus**: Berater übernimmt (→ Status „Idee"), bearbeitet oder verwirft jeden Vorschlag einzeln; nichts erreicht die Pipeline ohne Sichtung
- **Inkrementelle Analyse:** Nach jedem neuen Transkript kann eine Folge-Analyse gestartet werden, die nur Neues oder Verändertes vorschlägt (bestehende Pipeline als Kontext)
- Analyse-Läufe werden protokolliert: Zeitpunkt, einbezogene Dokumente, Prompt- und Modell-Version, Roh-Ergebnis, Übernahme-Quote

**Should-have:**

- Pro Karte 1–2 Reflexionsfragen (wie im Use-Case-Finder) als Gesprächsimpulse für den nächsten Kundentermin

**Nice-to-have:**

- Kundenübergreifende Muster-Hinweise („Bei 3 ähnlichen Kunden wurde ein Angebots-Skill umgesetzt") auf Basis anonymisierter Vorlagen (Ausbaustufe 3)

#### B) Qualifizierungs-Assistenz (Methodik-Schritt 2)

**Must-have:**

- Geführte Tiefen-Qualifizierung eines Use Cases, abschnittsweise mit KI-Entwurf und Berater-Bestätigung (auch live im Kundentermin nutzbar):
  1. **Teilschritte** der Aufgabe mit KI-Anteil pro Schritt (🤖 Vollständig / 🤝 Teilweise / 👤 Mensch)
  2. **Reichweite** konkretisieren: Wer macht dieselbe Aufgabe? Wer nutzt den Output weiter? Multiplikator-Effekt (aus Team-Kontext gespeist)
  3. **Input**: Was, Format, Ablageort, Zugriff über die KI-Plattform des Kunden möglich?
  4. **Output**: Was, Format, Definition von „gut"
  5. **Standards & Rahmenbedingungen**: Vorlagen, Tonalität (aus Kommunikationsstil-Profil), Regeln, No-Gos, Qualitätskriterien
  6. **Nutzen**: Frequenz, Zeitersparnis pro Durchlauf, Wochenhebel pro Person, Gesamtnutzen bei Reichweite
  7. **Umsetzbarkeit**: Tools vorhanden, Daten zugänglich, Genehmigungen (IT/Datenschutz), selbstständig umsetzbar?
  8. **Risiken**: Standardisierungsgrad („in 7 von 10 Fällen?"), Fehlerfälle, menschlicher Prüfschritt nötig?
  9. **Umsetzungstyp** mit Begründung (2–3 Sätze)
- Statuswechsel auf „Qualifiziert" nur bei vollständigen Abschnitten (Pflichtfeld-Validierung)
- Ergebnis wird strukturiert am Use Case gespeichert – kein separates Chat-Artefakt nötig

**Should-have:**

- Kontext-Chat am Use Case: Rückfragen an die Engine im Use-Case-Kontext („Formuliere die KI-Lösung spitzer", „Was wäre die Agent-Variante?"); Ergebnis per Klick in die Felder übernehmbar

#### C) Konzeptions-Assistenz (Methodik-Schritt 3)

**Must-have:**

- Generierung der Arbeitsanweisung aus dem qualifizierten Use Case, feldweise editierbar (KI-Entwurf pro Feld, Berater bestätigt/passt an), je nach Typ:
  - **Skill (skill.md):** 1. Beschreibung, 2. Eingabe, 3. Ausgabe, 4. Kontext, 5. Arbeitsanweisung, 6. Definition of Done
  - **Agent (agent.md):** 1. Name & Ziel, 2. Tools & Zugriffe, 3. Entscheidungslogik, 4. Grenzen & Eskalation, 5. Arbeitsanweisung, 6. Definition of Done
  - **Workflow (workflow.md):** 1. Auslöser (Trigger), 2. Schritte & Tools, 3. Mensch/KI-Übergaben, 4. Fehlerbehandlung, 5. Arbeitsanweisung, 6. Definition of Done
  - **Anwendung:** Kurz-PRD (Problem, Nutzer, Kernfunktionen, Datenmodell-Skizze, Umsetzungsempfehlung)
- Qualitätsregeln der Methodik gelten systemseitig: Arbeitsanweisungen konkret („Lies den Text, identifiziere die 3 Kernaussagen und formuliere sie als Bullet Points" statt „Analysiere"), No-Gos explizit benannt, keine Platzhalter
- Statuswechsel auf „Konzipiert" nur bei vollständigen Feldern

**Should-have:**

- Beispiel-Input/-Output als optionale Anlage am Use Case (verbessert die Entwurfsqualität)

### 5.4 Use-Case-Verwaltung & Pipeline

**Must-have:**

- Pipeline pro Kunde gemäß Statusmodell (4.5) als **Kanban-Board** (Spalten = Status, Karten = Use Cases) und als **Tabelle** (sortier-/filterbar nach Typ, Status, Wochenhebel, Hürde)
- Use-Case-Detailansicht mit Tabs: Karte (Quick-Win-Felder), Belege (Quellen mit Zitat und Link zum Dokument), Qualifizierung, Arbeitsanweisung, Historie (Statuswechsel, Änderungen)
- Manuelles Anlegen und vollständiges Bearbeiten von Use Cases (explizite Kundenwünsche, eigene Ideen)
- Statuswechsel mit Validierung gemäß 4.5; Verwerfen erfordert Begründung
- Zusammenführen zweier Use Cases (Dubletten) mit Übernahme der Belege

**Should-have:**

- Verknüpfung zusammengehöriger Use Cases (z. B. Skill, der später Teil eines Workflows wird)
- Kommentare/Notizen pro Use Case (z. B. O-Töne aus dem Kundentermin)

**Nice-to-have:**

- Kundenübergreifende Use-Case-Bibliothek mit anonymisierten Vorlagen (Ausbaustufe 3)

### 5.5 Priorisierung

**Must-have:**

- Automatischer Priorisierungs-Vorschlag aller nicht verworfenen Use Cases eines Kunden als sortierte Tabelle:

| Rang | Use Case | Typ | Frequenz | Wochenhebel | Hürde | Reichweite | Empfehlung |
|---|---|---|---|---|---|---|---|
| 1 | Angebote schneller erstellen | 🟢 | 5×/Woche | hoch | gering | 👥 | ⭐ |

- Genau eine ⭐-Empfehlung pro Kunde (bestes Verhältnis Hebel/Hürde)
- **Manuelle Übersteuerung per Drag & Drop:** Die manuelle Reihenfolge überschreibt den Score; der ursprüngliche Vorschlag bleibt einsehbar (Vorschlags-Rang als Zusatzspalte)
- Priorisierung ist die Grundlage der Roadmap-Befüllung (5.6)
- Präsentationsmodus-tauglich (siehe 6.4): im Kundentermin gemeinsam sortierbar

**Should-have:**

- Begründungsfeld bei manueller Umpriorisierung (Nachvollziehbarkeit im Monats-Review)
- Strategie-Tag pro Use Case (z. B. „zahlt auf Jahresziel X ein"), gespeist aus Prioritäten-&-Ziele-Profil

### 5.6 Roadmap & Monatsplanung

**Must-have:**

- Roadmap pro Engagement: Monats-Slots über die Retainer-Laufzeit (6 oder 12 Monate × 1–3 Slots/Monat gemäß Engagement-Konfiguration)
- **Monat 1 fix vorbelegt:** Slot 1 = „Langdock-Setup", Slot 2 = Erstprojekt (Standard-Vorschlag: E-Mail-Skill; austauschbar)
- Befüllung der Slots aus der priorisierten Pipeline per Drag & Drop; Vorschlags-Automatik: top-priorisierte, konzipierte Use Cases zuerst
- Slot-Status gemäß 4.5; Verschieben in einen anderen Monat per Drag & Drop, Historie bleibt erhalten
- **Zeitstrahl-Ansicht:** Monate als Spalten, Slots als Karten – beamerfähig für den Kundentermin
- Warnhinweise: unbelegte Slots im Folgemonat; geplante Use Cases ohne Status „Konzipiert"
- Kopplung Slot ↔ Use-Case-Status: Slot „In Umsetzung" setzt Use Case auf „In Umsetzung", Slot „Umgesetzt" auf „Live"

**Should-have:**

- Meilenstein-Markierungen (z. B. „Quartals-Review", „Verlängerungsgespräch")
- Szenario-Modus für Angebote („Roadmap bei 2 vs. 3 Slots/Monat")

**Nice-to-have:**

- Kapazitätsplanung über Kunden hinweg (wer setzt was um)

### 5.7 Reports & Exporte

**Must-have:**

- **Kunden-Roadmap-Export** (PDF und Markdown): Deckblatt (Kundenname, Zeitraum, optional Kundenlogo), priorisierte Use-Case-Übersicht, Monats-Roadmap, pro Use Case Kurzbeschreibung und Nutzen – geeignet als Angebots-Anlage und Monats-Review-Unterlage
- **Quick-Win-Übersicht** (Markdown): alle Karten + Priorisierungs-Tabelle, format-kompatibel zum bisherigen Use-Case-Finder-Artefakt (Schritt 1)
- **Arbeitsanweisungs-Export:** einzelne Use Cases als `skill.md` / `agent.md` / `workflow.md` (Dateiname: `qualifizierter-use-case-[name]-[kunde].md` bzw. typspezifisch), einzeln oder als ZIP pro Kunde
- Alle Exporte ohne interne Felder (Scoring-Interna, interne Notizen, Daten anderer Kunden); Export-Protokoll (wer, wann, was)

**Should-have:**

- Monats-Review-Report: umgesetzte Slots des Monats, Nutzen-Bilanz (Summe Wochenhebel der Live-Use-Cases), Ausblick Folgemonat
- Perspektivgeber-Branding (Logo, Farben) in PDF-Exporten konfigurierbar

**Nice-to-have:**

- Direkt-Versand per E-Mail an Ansprechpartner

### 5.8 Dashboard & Übersicht

**Must-have:**

- Startseite mit kundenübergreifender Übersicht:
  - Kennzahlen-Kacheln: aktive Engagements, Use Cases nach Status (gesamt), Slot-Belegung laufender Monat, Slot-Belegung Folgemonat
  - **Handlungsbedarf-Liste:** unbelegte Slots im Folgemonat; geplante, aber nicht konzipierte Use Cases; Kunden mit unvollständigem Kontextprofil; Engagements kurz vor Laufzeitende (Verlängerung)
  - Kundenliste mit Status-Ampel (Pipeline-Füllstand, Slot-Belegung)
- Jede Kachel/Zeile verlinkt in die jeweilige Detailansicht

**Should-have:**

- Verlaufs-Charts: umgesetzte Use Cases pro Monat (gesamt und je Kunde), kumulierter Wochenhebel aller Live-Use-Cases pro Kunde („gestiftete Zeitersparnis")

**Nice-to-have:**

- Auswertung Retainer-Verlängerungen, Verteilung der Use-Case-Typen

### 5.9 Einstellungen & Administration

**Must-have:**

- Nutzerverwaltung: interne Nutzer einladen/deaktivieren (alle gleichberechtigt im MVP)
- KI-Konfiguration: Modell-ID, Prompt-Versionen einsehen (aktive Version pro Pipeline-Stufe)
- Stammdaten: eigene Firmendaten und Branding für Exporte (Logo, Farben, Fußzeile)

**Should-have:**

- Prompt-Editor mit Versionierung und Test-Lauf gegen Beispieldaten (Methodik-Anpassungen ohne Deployment)

---

## 6. Benutzeroberfläche & Design

### 6.1 Designsystem: Mantis (Next.js-Variante)

Die UI baut auf dem **Mantis Free React Admin Template v2.2 (Next.js-Variante)** von CodedThemes auf (MIT-Lizenz):

- **Komponentenbibliothek:** Material UI (MUI) mit Ant-Design-Gestaltungsprinzipien, Ant Design Icons
- **Layout:** Dashboard-Layout mit einklappbarer Seitenleiste (Drawer), Kopfzeile mit Suche/Profil, Breadcrumbs, Content-Bereich mit Karten (`MainCard`)
- **Charts:** ApexCharts (`react-apexcharts`) bzw. MUI X-Charts für Dashboard-Auswertungen
- **Formulare:** Formik + Yup (Validierung), MUI-Formularkomponenten
- **Theming:** zentrales Theme (Farben, Typografie Public Sans/Inter, Schatten, Komponenten-Overrides) – wird auf Perspektivgeber-Branding angepasst (Primärfarbe, Logo); Struktur der Mantis-Theme-Konfiguration bleibt erhalten
- **Struktur-Konventionen des Templates werden übernommen:** `src/app` (App Router, Route-Gruppen `(auth)`/`(dashboard)`), `src/layout/Dashboard`, `src/components` (u. a. `MainCard`, Karten-Bausteine), `src/menu-items` (Navigationskonfiguration), `src/themes`

Zusätzlich benötigte Bausteine, die das freie Template nicht mitbringt (werden auf MUI-Basis ergänzt): Kanban-Board und Drag-&-Drop-Listen (z. B. `dnd-kit`), Datei-Upload mit Fortschritt, Diff-/Versionsansicht für Dokumente.

### 6.2 Navigationsstruktur (Seitenleiste)

```
◾ Dashboard                    (Startseite, kundenübergreifend)
◾ Kunden                       (Liste → Kundenakte)
── je Kunde (Kontext-Navigation in der Kundenakte als Tabs) ──
   • Übersicht
   • Dokumente
   • Use Cases (Pipeline)
   • Priorisierung
   • Roadmap
   • Exporte
◾ Einstellungen               (Nutzer, KI-Konfiguration, Branding)
```

### 6.3 Seiteninventar (Screen-für-Screen)

**S-01 Login**
- Zweck: Zugang für interne Nutzer
- Inhalt: Microsoft-365-SSO-Button („Mit Microsoft anmelden"), Perspektivgeber-Logo
- Mantis-Basis: Auth-Layout (`(auth)`-Route-Gruppe, Auth-Karten aus `sections/auth`); Passwort-/Registrierungsformulare des Templates entfallen

**S-02 Dashboard (Startseite)**
- Zweck: kundenübergreifender Überblick und Handlungsbedarf (5.8)
- Inhalt: 4 Kennzahlen-Kacheln (aktive Engagements, Use Cases nach Status, Slot-Belegung laufender/nächster Monat), Handlungsbedarf-Liste, Kundenliste mit Status-Ampel, Verlaufs-Chart (Should-have)
- Mantis-Basis: Dashboard-View mit Statistik-Karten (`AnalyticEcommerce`-Muster), `MainCard`, ApexCharts-Balken/Linien, MUI-Tabelle

**S-03 Kundenliste**
- Zweck: alle Kunden finden und anlegen
- Inhalt: Tabelle (Firma, Engagement-Status, Retainer, Laufzeit, Pipeline-Füllstand, Kontextprofil-Vollständigkeit), Suche, Filter, Button „Kunde anlegen" (Dialog)
- Mantis-Basis: `MainCard` + MUI-DataTable, Formik-Dialog

**S-04 Kundenakte – Übersicht**
- Zweck: Einstiegspunkt pro Kunde
- Inhalt: Stammdaten & Ansprechpartner, Engagement-Karte (Status, Retainer, Laufzeit, Slots), Langdock-Status, Tool-Landschaft, Kontextprofil-Vollständigkeit (5 Typen als Checkliste), letzte Aktivitäten, Schnellaktionen (Dokument hochladen, Analyse starten, Roadmap öffnen)
- Mantis-Basis: Karten-Raster aus `MainCard`s, Tab-Navigation (MUI Tabs) für die Unterbereiche

**S-05 Kundenakte – Dokumente**
- Zweck: Kontextprofile und Transkripte verwalten (5.2)
- Inhalt: Dokumentliste (Typ, Person, Datum, Version), Upload-Bereich (Drag & Drop + Copy-Paste-Dialog), Typ-Bestätigung nach KI-Vorschlag, Volltext-Ansicht mit Versionshistorie
- Mantis-Basis: MUI-Tabelle, Dialoge; Upload-Komponente wird ergänzt

**S-06 Analyse-Lauf**
- Zweck: Extraktion starten und Ergebnis reviewen (5.3 A)
- Inhalt: Dokumentauswahl (Checkboxen mit Aktualitäts-Hinweis), Start-Button, Fortschrittsanzeige (≤ 120 s), danach Review-Modus: Vorschlagskarten (Quick-Win-Karte + Beleg-Zitate + Dublettenhinweis) mit Aktionen Übernehmen / Bearbeiten / Verwerfen (einzeln und „alle übernehmen")
- Mantis-Basis: Stepper (MUI), Karten-Liste aus `MainCard`s, Chips für Einordnung/Wochenhebel

**S-07 Kundenakte – Use Cases (Pipeline)**
- Zweck: Pipeline steuern (5.4)
- Inhalt: Umschaltbar Kanban-Board (Statusspalten) / Tabelle; Filter nach Typ/Status; Button „Use Case manuell anlegen"
- Mantis-Basis: MUI-Karten als Board-Cards (Titel, Typ-Chip, Wochenhebel, Reichweite); Board-Interaktion via dnd-kit

**S-08 Use-Case-Detail**
- Zweck: ein Use Case vollständig (5.3 B/C, 5.4)
- Inhalt: Kopf (Name, Typ, Status, Wochenhebel/Hürde/Reichweite als Chips), Tabs: Karte / Belege / Qualifizierung (9 Abschnitte, je KI-Entwurf + Bestätigen) / Arbeitsanweisung (typspezifische Felder, je KI-Entwurf + Bestätigen) / Historie; Aktionen: Status ändern, Exportieren, Verwerfen, Zusammenführen
- Mantis-Basis: Tabs, Formik-Formulare, `MainCard`-Abschnitte; Entwurf-Kennzeichnung via MUI Alert/Chip („KI-Entwurf – nicht bestätigt")

**S-09 Kundenakte – Priorisierung**
- Zweck: Reihenfolge festlegen (5.5)
- Inhalt: Priorisierungs-Tabelle (Rang, Name, Typ, Frequenz, Wochenhebel, Hürde, Reichweite, ⭐), Drag & Drop der Zeilen, Spalte „Vorschlags-Rang", Begründungsfeld bei Abweichung (Should-have)
- Mantis-Basis: MUI-Tabelle + dnd-kit; Präsentationsmodus-Schalter

**S-10 Kundenakte – Roadmap**
- Zweck: Monatsplanung (5.6)
- Inhalt: Zeitstrahl (Monate als Spalten über die Laufzeit, Slots als Karten), seitliche Ablage „priorisierte, noch nicht eingeplante Use Cases", Drag & Drop in Slots und zwischen Monaten, Slot-Statusfarben, Warnbanner (unbelegte Slots, nicht Konzipiertes), Monat-1-Vorbelegung sichtbar
- Mantis-Basis: horizontales Karten-Raster auf MUI-Grid; Statusfarben aus dem Theme

**S-11 Kundenakte – Exporte**
- Zweck: Übergaben erzeugen (5.7)
- Inhalt: Export-Auswahl (Roadmap PDF/MD, Quick-Win-Übersicht, Arbeitsanweisungen einzeln/ZIP), Vorschau, Export-Protokoll
- Mantis-Basis: `MainCard`-Liste, Download-Aktionen

**S-12 Einstellungen**
- Zweck: Administration (5.9)
- Inhalt: Tabs Nutzer / KI-Konfiguration (Modell, Prompt-Versionen) / Branding (Logo, Farben, Fußzeile)
- Mantis-Basis: Tabs + Formik-Formulare

### 6.4 Präsentationsmodus

Priorisierung (S-09) und Roadmap (S-10) besitzen einen umschaltbaren **Präsentationsmodus** für den Kundentermin am Beamer:

- Blendet aus: interne Notizen, Score-Interna (Vorschlags-Rang, Begründungsfelder), Navigation zu anderen Kunden, Handlungsbedarf-Hinweise
- Vergrößerte Darstellung, Kundenname und Logo im Kopf
- Interaktion bleibt möglich (gemeinsames Umsortieren, Slot-Verschieben) – Änderungen werden normal gespeichert

### 6.5 UI-Grundregeln

- Deutschsprachige Oberfläche; Fachbegriffe exakt gemäß Kapitel 4 (Quick Win, Wochenhebel, Hürde, Skill/Agent/Workflow/Anwendung)
- Einheitliche Farbcodierung: Typen (🟢🔵🟣🟠) und Status konsistent über Board, Tabellen, Roadmap und Exporte
- KI-generierte, unbestätigte Inhalte sind immer als „Entwurf" gekennzeichnet
- Kernfluss (Kunde → Dokumente → Analyse → Pipeline → Priorisierung → Roadmap → Export) in max. 3 Klicks je Schritt erreichbar, ohne Schulung bedienbar
- Optimiert für Desktop/Laptop (Beratungsalltag); mobile Nutzung lesend möglich (responsives Mantis-Layout)

---

## 7. Nicht-funktionale Anforderungen

### 7.1 Usability

- Siehe UI-Grundregeln 6.5; zusätzlich: leere Zustände mit Handlungsanleitung (z. B. „Noch keine Dokumente – lade das Kontextprofil hoch"), Undo für Verwerfen/Zusammenführen innerhalb der Session
- Ladezustände mit Skeletons (Mantis-Standard), Fortschrittsanzeige bei Analyse und Export

### 7.2 Performance

| Vorgang | Ziel |
|---|---|
| Analyse-Lauf (Extraktion, Kontextprofil + 1–2 Transkripte) | ≤ 120 s, mit Fortschrittsanzeige |
| KI-Entwurf pro Qualifizierungs-/Konzeptions-Feld | ≤ 20 s |
| Seitenaufbau Listen-/Board-Ansichten | ≤ 2 s bei 50 Kunden / 1.000 Use Cases |
| PDF-Export | ≤ 30 s |
| Dokument-Upload inkl. Text-Extraktion (20 MB) | ≤ 60 s |

### 7.3 Sicherheit & Compliance (DSGVO kritisch)

Die Anwendung verarbeitet personenbezogene Daten von Kundenmitarbeitern (Rollenprofile, Transkripte mit Namen und O-Tönen):

- **Datenhaltung ausschließlich in der EU** (Supabase EU-Region, EU-Hosting der App)
- **KI-Verarbeitung** über die Claude API mit Auftragsverarbeitungsvertrag (AVV) und vertraglich zugesicherter Nicht-Nutzung der Daten für Modell-Training; Datenregion EU soweit verfügbar
- **Löschkonzept:** vollständige Löschung aller Daten eines Kunden auf Anfrage bzw. bei Engagement-Ende (Dokumente inkl. Storage, Analysen, Use Cases, Exporte, Logs); Löschung protokolliert
- **Mandantentrennung:** strikte Trennung auf Datenebene (Row-Level-Security); Prompts enthalten ausschließlich Daten des betreffenden Kunden; Exporte enthalten nie Daten anderer Kunden
- **Authentifizierung:** Microsoft 365 SSO (Entra ID, OIDC); nur eingeladene Konten der eigenen Organisation; Session-Timeout
- **Transport & Speicherung:** TLS für alle Verbindungen, Verschlüsselung at rest (Datenbank und Datei-Storage)
- **Backups:** täglich automatisch, Aufbewahrung 30 Tage, Restore-Prozess dokumentiert
- **Einwilligung:** transparente KI-Verarbeitungs-Klausel im Beratungsvertrag der Kunden (organisatorische Maßnahme, außerhalb der App)

### 7.4 KI-Governance

- **Human-in-the-Loop verbindlich:** Kein Use Case erreicht ohne menschliche Bestätigung die Status „Idee" (Übernahme aus Review), „Qualifiziert" oder „Konzipiert"; kein Export wird automatisch versendet
- **Belegbarkeit:** KI-Vorschläge müssen ihre Quelle ausweisen (Transkript-Zitat mit Fundstelle, Kontextprofil-Abschnitt); Vorschläge ohne Beleg werden verworfen und nicht angezeigt
- **Kennzeichnung:** unbestätigte KI-Inhalte sind in UI und Datenmodell als Entwurf markiert
- **Nachvollziehbarkeit:** jeder Analyse-Lauf protokolliert Prompt-Version, Modell-Version, Eingabe-Dokumente und Roh-Ergebnis
- Keine automatisierten Entscheidungen mit Rechtswirkung; das System ist Entscheidungsunterstützung

### 7.5 Wartbarkeit & Betrieb

- Analyse-Prompts als versionierte Konfiguration (nicht im Code verstreut); Änderungen ohne Deployment möglich (5.9)
- Strukturierte, schema-validierte JSON-Ausgaben der KI; fehlerhafte Antworten → automatischer Retry (max. 2), nie ungeprüfte Speicherung
- KI-Modell austauschbar (Modell-ID als Konfiguration)
- Automatisierte Tests: Kernlogik (Scoring, Statusübergänge, Slot-Kopplung, Exportinhalte), Schema-Validierung der KI-Stufen mit Fixture-Antworten; Seed-Daten für lokale Entwicklung
- Fehler-Monitoring (z. B. Sentry) und strukturierte Server-Logs ohne personenbezogene Inhalte

---

## 8. User Stories

**US-001: Anmelden**
Als Berater möchte ich mich mit meinem Microsoft-365-Konto anmelden, damit ich ohne zusätzliches Passwort sicheren Zugang habe.
*Akzeptanzkriterien:* SSO via Entra ID; nur eingeladene Konten; nach Login Weiterleitung aufs Dashboard.

**US-002: Kunde und Engagement anlegen**
Als Berater möchte ich einen Kunden mit Ansprechpartnern, Tool-Landschaft und Retainer-Eckdaten (Höhe, Laufzeit, Slots/Monat) anlegen, damit alle weiteren Artefakte diesem Kunden zugeordnet sind.
*Akzeptanzkriterien:* Pflichtfelder Firmenname, Engagement-Status; Slots/Monat 1–3; Laufzeit 6/12 Monate; Kunde erscheint in Liste und Dashboard.

**US-003: Kontextprofil und Transkript hochladen**
Als Berater möchte ich Dokumente hochladen oder einfügen und typisieren, damit die Analyse auf vollständiger Grundlage läuft.
*Akzeptanzkriterien:* MD/PDF/TXT/DOCX bis 20 MB und Copy-Paste; KI schlägt Typ vor, Berater bestätigt/ändert; Transkripte mit Pflicht-Metadaten (Datum, Teilnehmer); Vollständigkeits-Anzeige der 5 Profil-Typen; neue Version ersetzt alte in Analysen, bleibt einsehbar.

**US-004: Use-Case-Analyse starten**
Als Berater möchte ich per Klick eine Analyse über ausgewählte Dokumente starten, damit ich in Minuten belegte Use-Case-Vorschläge erhalte.
*Akzeptanzkriterien:* Dokumentauswahl; Ergebnis ≤ 120 s; max. 10 Vorschläge im Karten-Format; jeder mit Quellen-Beleg; Dubletten als „Ergänzung zu #X" markiert; Lauf protokolliert (Dokumente, Prompt-/Modellversion).

**US-005: Vorschläge reviewen**
Als Berater möchte ich jeden KI-Vorschlag übernehmen, bearbeiten oder verwerfen, damit nur geprüfte Use Cases in die Pipeline gelangen.
*Akzeptanzkriterien:* Review-Modus mit Einzel- und Sammelaktionen; Übernahme → Status „Idee"; Verwerfen ohne Begründung im Review möglich (noch kein Pipeline-Element); nichts erreicht die Pipeline ungesehen.

**US-006: Use Case manuell anlegen**
Als Berater möchte ich Use Cases manuell erfassen (z. B. explizite Kundenwünsche), damit die Pipeline vollständig ist.
*Akzeptanzkriterien:* Karten-Formular mit Pflichtfeldern; manuelle Use Cases gleichwertig in Pipeline, Priorisierung und Roadmap.

**US-007: Use Case qualifizieren**
Als Berater möchte ich einen Use Case geführt qualifizieren (9 Abschnitte inkl. Umsetzungstyp), damit er entscheidungs- und umsetzungsreif dokumentiert ist.
*Akzeptanzkriterien:* KI-Entwurf pro Abschnitt, Bestätigung pro Abschnitt; „Qualifiziert" nur bei Vollständigkeit inkl. Typ-Begründung; Ergebnis am Use Case gespeichert.

**US-008: Arbeitsanweisung konzipieren**
Als Berater möchte ich aus einem qualifizierten Use Case die typgerechte Arbeitsanweisung generieren und feldweise finalisieren, damit die Umsetzung ohne Rückfragen starten kann.
*Akzeptanzkriterien:* Felder gemäß Typ (je 6); keine Platzhalter; „Konzipiert" nur bei Vollständigkeit; Export als .md möglich.

**US-009: Priorisieren**
Als Berater möchte ich einen automatischen Prioritäts-Vorschlag nach Wochenhebel und Hürde erhalten und per Drag & Drop übersteuern, damit Kunde und ich gemeinsam die Reihenfolge festlegen.
*Akzeptanzkriterien:* Tabelle mit genau einer ⭐-Empfehlung; manuelle Reihenfolge überschreibt Score; Vorschlags-Rang bleibt sichtbar; im Präsentationsmodus nutzbar.

**US-010: Roadmap erstellen und pflegen**
Als Berater möchte ich priorisierte Use Cases auf Monats-Slots der Retainer-Laufzeit verteilen, damit eine präsentierbare Umsetzungs-Roadmap entsteht.
*Akzeptanzkriterien:* Slots gemäß Engagement; Monat 1 vorbelegt (Langdock-Setup + Erstprojekt); Drag & Drop zwischen Monaten mit Historie; Warnungen bei unbelegten Slots und nicht konzipierten geplanten Use Cases.

**US-011: Roadmap exportieren**
Als Berater möchte ich Roadmap und Use-Case-Übersicht als PDF/Markdown exportieren, damit ich Angebot und Monats-Review ohne manuelle Folienarbeit bestücke.
*Akzeptanzkriterien:* PDF + Markdown; keine internen Felder/fremden Kunden; ≤ 30 s; Export protokolliert.

**US-012: Umsetzungsfortschritt pflegen**
Als Umsetzer möchte ich Slot-Status aktualisieren (In Umsetzung/Umgesetzt/Verschoben), damit Dashboard und Monats-Review den echten Stand zeigen.
*Akzeptanzkriterien:* Statuswechsel mit Zeitstempel und Historie; Kopplung an Use-Case-Status (In Umsetzung/Live); Verschieben erfordert Zielmonat.

**US-013: Überblick behalten**
Als Inhaber möchte ich auf dem Dashboard alle aktiven Retainer, Pipeline-Stände und die Slot-Belegung der nächsten Monate sehen, damit ich Engpässe früh erkenne.
*Akzeptanzkriterien:* Kennzahlen-Kacheln, Handlungsbedarf-Liste (unbelegte Slots, nicht Konzipiertes, unvollständige Profile, auslaufende Engagements); alles verlinkt in Detailansichten.

**US-014: Kundendaten löschen (DSGVO)**
Als Inhaber möchte ich alle Daten eines Kunden vollständig und protokolliert löschen können, damit wir Löschpflichten nachkommen.
*Akzeptanzkriterien:* Löschung umfasst Dokumente (inkl. Dateien), Analysen, Use Cases, Slots, Exporte; Bestätigungs-Dialog mit Umfangsanzeige; Lösch-Protokoll ohne Personenbezug.

---

## 9. Technische Architektur

### 9.1 Technologie-Stack

| Ebene | Technologie | Anmerkung |
|---|---|---|
| UI-Framework | **Next.js (App Router), React, Material UI** – Basis: Mantis Free v2.2, Next.js-Variante | Template-Konventionen (Layout, Theme, Menü-Konfiguration) werden übernommen; Branding via Theme |
| Ergänzende UI-Bibliotheken | dnd-kit (Drag & Drop), ApexCharts (im Template enthalten) | Kanban, Priorisierung, Roadmap |
| Backend | Next.js Server Actions / Route Handlers | Kein separater Backend-Dienst im MVP |
| Datenbank & Storage | **PostgreSQL + Datei-Storage (Supabase, EU-Region)** | Row-Level-Security für Mandantentrennung |
| Authentifizierung | **Microsoft 365 SSO (Entra ID, OIDC)** – z. B. via Auth.js | Nur eingeladene Konten; kein Passwort-Flow |
| KI | **Claude API (Anthropic)**, aktuelles Sonnet-Modell als Default, konfigurierbar | Strukturierte JSON-Ausgaben mit Schema-Validierung; AVV/No-Training |
| Dateiverarbeitung | Serverseitige Text-Extraktion PDF/DOCX | Originaldatei bleibt im Storage |
| PDF-Export | Serverseitiges HTML→PDF-Rendering | gleiche Templates wie Bildschirm-Ansicht |
| Hosting | EU-Region (z. B. Vercel EU oder vergleichbar) | DSGVO-Anforderung 7.3 |
| Monitoring | Fehler-Tracking (z. B. Sentry), strukturierte Logs | ohne personenbezogene Inhalte |

### 9.2 Datenmodell (Kernentitäten mit Schlüsselfeldern)

**Customer** – id, name, branche, mitarbeiterzahl, logo, notizen, tool_landschaft (JSON: plattform, integrationen[]), langdock_status, archiviert_am

**Contact** – id, customer_id, name, rolle, email, typ (Entscheider/Key-User/IT)

**Engagement** – id, customer_id, status, retainer_eur, laufzeit_monate (6/12), start, ende, slots_pro_monat (1–3)

**Document** – id, customer_id, typ (rollenprofil/firmenprofil/team_kontext/prioritaeten_ziele/kommunikationsstil/transkript/sonstiges), contact_id (optional), version, dateiname, storage_ref, text_extrahiert, metadaten (JSON: termindatum, teilnehmer[], terminart), erstellt_von/_am

**AnalysisRun** – id, customer_id, dokument_ids[], prompt_version, modell_version, gestartet_von/_am, dauer, roh_ergebnis (JSON), uebernommen/verworfen (Zähler)

**UseCase** – id, customer_id, quelle (ki/manuell), karte (JSON: aufgabe, problem, ki_loesung, tools_daten, frequenz, reichweite, nutzen), einordnung (skill/agent/workflow/anwendung), belege (JSON[]: dokument_id, zitat, fundstelle), status, verworfen_begruendung, qualifizierung (JSON: 9 Abschnitte, je Feld: inhalt, bestaetigt), arbeitsanweisung (JSON: typspezifische Felder, je: inhalt, bestaetigt), scoring (JSON: wochenhebel_label, wochenhebel_min_pro_woche, huerde, reichweite), vorschlags_rang, manueller_rang, empfehlung (bool), verknuepfte_usecase_ids[]

**RoadmapSlot** – id, engagement_id, monat (1–12), slot_nr (1–3), usecase_id (nullable; Sondertyp „Langdock-Setup"), status, historie (JSON[]), aktualisiert_von/_am

**Export** – id, customer_id, typ (roadmap_pdf/roadmap_md/quickwin_md/arbeitsanweisung/zip), datei_ref, erstellt_von/_am

**User** – id, email, name, entra_id, aktiv

**PromptVersion** – id, stufe (klassifikation/extraktion/qualifizierung/konzeption), version, inhalt, aktiv, erstellt_am

Alle kundenbezogenen Tabellen tragen `customer_id` mit Row-Level-Security; Löschkaskade für die DSGVO-Löschfunktion.

### 9.3 KI-Pipeline

Die Prompts werden aus dem bestehenden Use-Case-Finder-Systemprompt abgeleitet und in vier versionierte Stufen zerlegt. Jede Stufe liefert schema-validiertes JSON; fehlerhafte Antworten werden max. 2× wiederholt und nie ungeprüft gespeichert.

| Stufe | Eingabe | Ausgabe (JSON) |
|---|---|---|
| 1 Dokument-Klassifikation | Dokumenttext (Auszug) | typ, konfidenz, metadaten-Vorschlag |
| 2 Extraktion | Kontextprofile + Transkripte + Tool-Landschaft + bestehende Pipeline (Titel/Kurzbeschreibung) | bis zu 10 Karten: alle Kartenfelder, einordnung, belege[] (dokument_id, zitat), wochenhebel_label, dublette_von (optional), reflexionsfragen[] |
| 3 Qualifizierung | Karte + Belege + relevante Kontextprofile + ggf. Berater-Korrekturen | Entwurf je Abschnitt (teilschritte[], reichweite, input, output, standards, nutzen, umsetzbarkeit, risiken[], typ_empfehlung + begruendung) |
| 4 Konzeption | Qualifizierter Use Case + Typ + ggf. Beispiel-Input/-Output | Entwurf je typspezifischem Feld |

**Grundsätze:**

- Jede Stufe erhält ausschließlich Daten des betreffenden Kunden (Mandantentrennung im Prompt)
- Berater-Korrekturen an bestätigten Feldern fließen als Kontext in Folge-Stufen desselben Use Cases ein
- Belege werden gegen die Quelldokumente validiert (Zitat muss im Dokumenttext auffindbar sein); nicht validierbare Vorschläge werden verworfen
- Prompt- und Modell-Version werden am AnalysisRun bzw. am erzeugten Entwurf gespeichert

### 9.4 Schnittstellen (MVP)

- **Claude API** (ausgehend): einzige externe KI-Schnittstelle
- **Microsoft Entra ID** (OIDC): Login
- Keine weiteren Integrationen im MVP (siehe 10.1); Import ausschließlich per Upload/Paste, Export per Datei-Download

---

## 10. Ausbaustufen & Abgrenzung

### 10.1 MVP – Out of Scope

- Kein Kunden-Login, kein Kundenportal (Kunden erhalten Exporte und sehen den Präsentationsmodus im Termin)
- Kein differenziertes Rollen-/Rechtemodell (alle internen Nutzer gleichberechtigt)
- Keine automatischen Integrationen (Meeting-Tools, Langdock, CRM, SharePoint/Drive)
- Keine Zeiterfassung/Abrechnung des Retainers (nur Slot-Logik)
- Keine Mehrsprachigkeit (nur Deutsch)
- Keine Audio-Transkription in der App

### 10.2 Ausbaustufe 2

- **Kundenportal (read-only):** Kunde sieht seine Roadmap, Pipeline-Status und fertige Use Cases; optionale Kommentarfunktion
- **Transkript-Import:** automatischer Import aus Meeting-Tools (z. B. Teams, Zoom, Fireflies, tl;dv)
- **Monats-Review-Automatik:** Report-Entwurf per Klick zum Monatsende (umgesetzte Slots, Nutzen-Bilanz, Ausblick)

### 10.3 Ausbaustufe 3

- **Langdock-Integration:** Status-Abgleich umgesetzter Skills/Agenten/Workflows, Deep-Links vom Roadmap-Slot in den Kunden-Workspace
- **CRM-/Ablage-Anbindung** für Kontextdaten (SharePoint, Google Drive)
- **Kundenübergreifende Use-Case-Bibliothek:** anonymisierte Vorlagen erfolgreicher Use Cases als Beschleuniger für neue Kunden (inkl. Muster-Hinweisen in der Extraktion)

---

## 11. Meilensteine & Risiken

### 11.1 Meilensteine (Release-Phasen MVP)

| Phase | Inhalt | Ergebnis |
|---|---|---|
| M1 – Fundament | Projekt-Setup auf Mantis-Basis (Next.js), Theming/Branding, M365-SSO, Kunden-/Engagement-Verwaltung, Dokumenten-Upload mit Typisierung | Kundenakte mit Dokumenten nutzbar |
| M2 – Analyse | KI-Stufen 1+2 (Klassifikation, Extraktion mit Beleg-Validierung), Review-Modus, Pipeline (Board + Tabelle) | Belegte Quick-Win-Vorschläge aus echten Kundendaten |
| M3 – Tiefe | Qualifizierung + Konzeption (Stufen 3+4), Statuslogik mit Validierung, Use-Case-Detail | Umsetzungsreife Arbeitsanweisungen im System |
| M4 – Steuerung | Priorisierung (Drag & Drop), Roadmap mit Monats-Slots, Präsentationsmodus, Exporte (PDF/MD), Dashboard | Vollständiger Kernfluss bis zum Kundentermin-Export |
| M5 – Härtung | DSGVO-Abnahme (AVV, Löschfunktion US-014), Backups, Monitoring, Tests, Pilotierung mit 2–3 echten Kunden | Produktivbetrieb |

### 11.2 Risiken & Gegenmaßnahmen

| Risiko | Eintritt | Impact | Gegenmaßnahme |
|---|---|---|---|
| KI-Vorschläge zu generisch oder faktisch falsch → Vertrauensverlust im Kundentermin | Mittel | Hoch | Beleg-Pflicht mit validierten Zitaten, Human-in-the-Loop vor jedem Statuswechsel, Prompt-Iteration mit echten Pilotdaten ab M2 |
| Datenschutz-Bedenken der Kunden gegen KI-Verarbeitung ihrer Transkripte | Mittel | Hoch | EU-Hosting, AVV mit No-Training-Zusicherung, Löschfunktion, transparente Vertragsklausel |
| Doppelpflege: Team arbeitet weiter im Chat-Use-Case-Finder statt in der App | Mittel | Mittel | Format-kompatible Exporte, Kernfluss schneller als der Chat-Weg, Erfolgskriterium „100 % Nutzung nach 3 Monaten" aktiv nachhalten |
| Scope-Creep Richtung Projektmanagement-Tool (Aufgaben, Zeiterfassung, Abrechnung) | Hoch | Mittel | Klare Out-of-Scope-Liste (10.1); neue Wünsche als Ausbaustufen-Kandidaten, nicht ins MVP |
| Freies Mantis-Template deckt Spezial-UI nicht ab (Kanban, Roadmap-Zeitstrahl, Upload) | Mittel | Niedrig | Früh in M1/M2 auf MUI-Basis ergänzen (dnd-kit); kein Wechsel des Designsystems nötig |
| PDF/DOCX-Extraktion unzuverlässig | Mittel | Niedrig | Copy-Paste als gleichwertiger Weg ab Tag 1; Extraktions-Vorschau; iterativ verbessern |
| Abhängigkeit von einem KI-Anbieter/Modell | Niedrig | Mittel | Modell-ID als Konfiguration, versionierte Prompts, Schema-Validierung als Abstraktionsschicht |
| M365-SSO-Einrichtung (App-Registrierung, Admin-Consent) verzögert M1 | Niedrig | Niedrig | Früh in M1 einplanen; Magic-Link als temporärer Fallback in der Entwicklungsumgebung |

---

## 12. Annahmen & offene Punkte

**Annahmen (bei Abweichung bitte korrigieren):**

1. Internes Team im MVP: 1–5 gleichberechtigte Nutzer, alle mit Microsoft-365-Konten der eigenen Organisation
2. Referenz-Erstprojekt „E-Mail-Skill" ist der Standard-Vorschlag für Monat 1, Slot 2 – pro Kunde austauschbar
3. Die fünf Kontextprofil-Typen entsprechen dem bestehenden Format aus der Use-Case-Finder-Arbeit und ändern sich strukturell nicht kurzfristig
4. Der bestehende Use-Case-Finder (Chat) bleibt während der Einführung parallel nutzbar; seine Markdown-Artefakte können per Copy-Paste als Dokumente importiert werden
5. Kundenlogos und -namen dürfen in internen Ansichten und Exporten verwendet werden

**Offene Punkte (nicht blockierend für den Start, Klärung bis M4/M5):**

1. Genaues Perspektivgeber-Branding (Logo-Dateien, Farbwerte) für Theme und PDF-Exporte
2. Wortlaut der KI-/Datenschutz-Klausel im Beratungsvertrag (organisatorisch, außerhalb der App)
3. Aufbewahrungsfristen: Wie lange bleiben Daten beendeter Engagements standardmäßig gespeichert, bevor die Löschung angestoßen wird?
4. Ob der Monats-Review-Report (Should-have 5.7) bereits ins MVP rutscht oder in Ausbaustufe 2 wandert
