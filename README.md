# HIRN.EXE

Ein interaktiver, absurder Kurzurlaub von der Realität. HTML, CSS und JavaScript, ohne Build-Schritt oder Paketinstallation.

## Starten

`index.html` im Browser öffnen. Alternativ `npm start` ausführen und http://localhost:3000 öffnen (Node.js erforderlich).

Unter Windows PowerShell gegebenenfalls `npm.cmd start` verwenden, falls die Skriptausführung gesperrt ist.

## Musik

Deine selbst bereitgestellte MP3 unter `music/track.mp3` ablegen. Die Seite startet mit gelbem Hintergrund und ohne Musik. „GEHIRN AUS. TRIP AN.“ aktiviert den Eskalationsmodus und startet den Song. Alternativ die Musik über den Play-Button starten oder eine lokale Audiodatei über „MP3 wählen“ öffnen. Es wird keine Audiodatei mitgeliefert oder heruntergeladen.

## Song vorzeitig wiederholen

Oben in `app.js` legt `SONG_RESTART_AT_SECONDS` fest, bei welcher Songposition die Wiedergabe wieder bei Sekunde 0 beginnt. Beispiel: `const SONG_RESTART_AT_SECONDS = 90;` startet nach ungefähr 1:30 Minuten erneut. Mit `null` (Standard) wird der gesamte Song wiederholt. Die Einstellung gilt auch für über den Player ausgewählte Dateien; liegt sie hinter dem Songende, greift die normale Wiederholung am Ende. Pausieren startet die Musik nicht automatisch neu.

## Spielen

- Maus bewegen: Augen folgen dir, Konfetti folgt der Maus.
- Smiley anklicken: Konfetti und fragwürdige Lebensweisheiten.
- Ente anklicken: Entenexplosion.
- Realitätsregler: Partikelmenge, Fluggeschwindigkeit und Sternrotation beeinflussen.
- „Bitte nicht drücken“ / Leertaste: Chaos auslösen.
- Schwerkraft-Button / G: Schwerelosigkeit umschalten.
- Ruhemodus / Escape: Bewegung stoppen. Die Betriebssystem-Einstellung für reduzierte Bewegung wird beim Start berücksichtigt.
- Touch: Alle Schaltflächen und Regler funktionieren ohne Maus.

Die Oberfläche funktioniert ohne externe Skripte. Google Fonts lädt zwei optionale Schriften; ohne Netzwerk werden Systemschriften verwendet.
