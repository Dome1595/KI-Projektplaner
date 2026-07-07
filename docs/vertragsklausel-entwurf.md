# Entwurf: Vertragsklausel „KI-gestützte Verarbeitung von Projektunterlagen und Gesprächsaufzeichnungen"

> ⚠️ **Entwurf – keine Rechtsberatung.** Dieser Text ist eine inhaltliche Arbeitsgrundlage
> und muss vor Verwendung in Beratungsverträgen durch eine Rechtsanwältin / einen
> Rechtsanwalt (Schwerpunkt IT-/Datenschutzrecht) geprüft und an den konkreten
> Vertrag angepasst werden. Platzhalter sind mit [eckigen Klammern] markiert.

---

## § [X] Einsatz von KI-Systemen und Verarbeitung von Kontextinformationen

### (1) Gegenstand

Der Auftragnehmer (Perspektivgeber, [vollständige Firmierung, Anschrift]) setzt zur
Erbringung der vereinbarten Beratungs- und Umsetzungsleistungen KI-gestützte
Werkzeuge ein. Dies umfasst insbesondere:

1. die strukturierte Erfassung von Kontextinformationen des Auftraggebers
   (u. a. Rollen- und Firmenprofile, Team-Strukturen, Prioritäten und Ziele,
   Kommunikationsstile),
2. die Auswertung von Transkripten gemeinsamer Termine (z. B. Discovery-Workshops,
   Monats-Reviews), soweit deren Aufzeichnung zuvor vereinbart wurde,
3. die KI-gestützte Identifikation, Bewertung und Priorisierung von
   KI-Anwendungsfällen sowie die Erstellung von Umsetzungs-Roadmaps und
   Arbeitsanweisungen.

### (2) Art und Umfang der Verarbeitung

Die unter Abs. 1 genannten Informationen können personenbezogene Daten von
Mitarbeitenden des Auftraggebers enthalten (insbesondere Namen, Rollen,
Aufgabenbeschreibungen, Gesprächsbeiträge). Diese Daten werden ausschließlich
zum Zweck der Leistungserbringung verarbeitet.

### (3) Technische und organisatorische Maßnahmen

Der Auftragnehmer stellt sicher, dass:

1. sämtliche Daten ausschließlich in Rechenzentren innerhalb der Europäischen
   Union gespeichert werden,
2. mit allen eingesetzten Unterauftragsverarbeitern (insbesondere dem Anbieter
   des KI-Modells sowie dem Hosting-Anbieter) Auftragsverarbeitungsverträge
   gemäß Art. 28 DSGVO bestehen,
3. die übermittelten Daten von den KI-Anbietern **nicht zum Training von
   KI-Modellen** verwendet werden (vertraglich zugesichert),
4. Daten des Auftraggebers strikt von Daten anderer Kunden des Auftragnehmers
   getrennt verarbeitet werden,
5. alle Übertragungen verschlüsselt erfolgen und Daten verschlüsselt
   gespeichert werden,
6. KI-generierte Analyseergebnisse vor ihrer Verwendung durch eine fachkundige
   Person des Auftragnehmers geprüft werden (Human-in-the-Loop); automatisierte
   Entscheidungen im Sinne des Art. 22 DSGVO finden nicht statt.

### (4) Aufzeichnung von Terminen

Termine werden nur nach vorheriger Ankündigung und mit Zustimmung der
Teilnehmenden aufgezeichnet bzw. transkribiert. Der Auftraggeber stellt sicher,
dass die auf seiner Seite Teilnehmenden vorab informiert werden. Einzelne
Teilnehmende können der Aufzeichnung widersprechen; der Termin wird dann ohne
Aufzeichnung durchgeführt.

### (5) Speicherdauer und Löschung

1. Die im Rahmen der Leistungserbringung erhobenen Kontextinformationen und
   Transkripte werden für die Dauer des Vertragsverhältnisses gespeichert.
2. Nach Beendigung des Vertragsverhältnisses werden die Daten für einen
   Zeitraum von **180 Tagen** aufbewahrt (Rückfragen, Anschlussbeauftragung)
   und anschließend gelöscht, soweit keine gesetzlichen
   Aufbewahrungspflichten entgegenstehen.
3. Der Auftraggeber kann jederzeit die vorzeitige, vollständige Löschung
   seiner Daten verlangen. Die Löschung wird protokolliert und auf Wunsch
   bestätigt.

### (6) Auskunft

Der Auftragnehmer benennt auf Anfrage die aktuell eingesetzten KI-Anbieter und
Unterauftragsverarbeiter sowie den jeweiligen Verarbeitungsort.

---

## Hinweise zur Verwendung (intern, nicht Vertragsbestandteil)

- Abs. 3 Nr. 2–3 setzen voraus, dass mit Anthropic (Claude API) und dem
  Hosting-Anbieter (z. B. Supabase, Vercel) tatsächlich AVVs abgeschlossen
  wurden und die No-Training-Zusicherung dokumentiert ist – vor der ersten
  Verwendung prüfen und ablegen.
- Die 180-Tage-Frist in Abs. 5 entspricht der im PRD (Kapitel 7.3)
  festgelegten Aufbewahrungsfrist; bei Änderung beide Stellen anpassen.
- Ergänzend empfiehlt sich ein kurzes Informationsblatt für die Teilnehmenden
  von aufgezeichneten Terminen (Art. 13 DSGVO).
