# Benzinpreise - Informationsvisualisierung
Dieses Projekt visualisiert Tankstellenpreise mittles der JavaScript-Bibliothek
D3.js. Es Werden auf einer Karte Tankstellen aus Flensburg angezeigt. Wird auf
ein Marker geglickt, erscheint ein Diagramm mit dem Vergleich von Rohölpreis 
zu Benzinpreis. Dabei kann zwischen Diesel, Benzin und E10 gewählt werden. Auch 
der Zeitraum kann ausgewählt werden. Zusätzlich kann der Preisbereich umgestellt 
werden, sodass die Preise genauer betrachtet werden können. Des weiteren kann jede
ausgewählte Tankstelle zu einer Vergeleichsfrafik hinzugefügt werden.

## TODO / Bugs
- Vergleichsgrafik anpassen
   - Bubble anpassen (Bug) 
        - oben links entfernen
        - richtige Farben nutzen
        - Nur dir Preise annzeigen, die aus der DB kommen
   - Vergleich von Benzin zu Diesel zu e10
- Ortsauwahl / PLZ-Auswahl
- Datumsauswahl per Grafik
- Min/ Max Punkte anpassen
- Auswahl zwischen Punkten zu Linien
    - Öffnungszeiten 
- Wenn Tankstelle aus Übersicht gelöscht wird, muss das auch aus der Vergleichsgrafik gelöscht werden.
- neue Rohölpreise reinladen
- Popup richtig anzeigen lassen
- bei mehreren Jahren Ansicht optimieren ?