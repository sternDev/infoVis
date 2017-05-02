/**
 * Created by Jasmin on 01.05.2017.
 */
define('prices', ['jquery'], function($) {

    var prices = function () {

    };

    prices.prototype.test = function () {
        /**
         * Created by Jasmin on 17.04.2017.
         */


        /*  [
         {
         "id": "005056ba-7cb6-1ed2-bceb-763b4a24cd25",
         "name": "star Tankstelle",
         "brand": "STAR",
         "street": "Marienallee",
         "place": "Flensburg",
         "lat": 54.77871,
         "lng": 9.41456,
         "isOpen": true,
         "houseNumber": "60",
         "postCode": 24937
         }
         ]*/


        var station_ids = ["005056ba-7cb6-1ed2-bceb-763b4a24cd25", "5cde342b-85bd-42a0-946c-bd21fa70b055"];                               // Liste
        /*$.each(stations, function(){
         station_ids.push(this.id); // nur die IDs       // Füllen der Liste mit IDs der Tankstellen aus list.php Aufruf
         });
         */
        station_ids_string = station_ids.join(',');         // IDs ohne Hochkommas mit Kommas getrennt verbunden

        $.ajax({                                            // jQuery für Server-Request - kann natürlich auch mit eigenem Code,
            // oder anderen Libs gemacht werden.
            url: "https://creativecommons.tankerkoenig.de/json/prices.php",
            data: {
                ids: station_ids_string,                    // stringifiziertes Array mit Tankstellen-Ids
                apikey: 'bb9a0be3-f23a-7bfd-0549-91e3b5a535d3'
            },
            success: function( response ) {                 // Antwort vom Server wird hier verarbeitet
                if (response.ok) {

                    // Daten in Ordnung?
                    var test = response.prices;
                    $.ajax
                    ({
                        type: "POST",
                        dataType : 'json',
                        async: false,
                        url: 'http://localhost:1234/comm/save-file.php',
                        data: { data: JSON.stringify(test) },
                        success: function () {alert("Thanks!"); },
                        failure: function() {alert("Error!");}
                    });

                    console.log(test);        // TODO: eigene Funktion um Preise anzuzeigen und/oder zu speichern
                } else {
                    console.log(response.message);         // TODO: Fehlermeldung anzeigen
                }
            },
            error: function(p){                             // Behandlung technischer Probleme
                errorHandler('AJAX-Problem, status: ' + p.status + ' statusText: ' + p.statusText);
            }
        });
    };

    return prices;

});