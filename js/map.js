/**
 * Created by Jasmin on 15.05.2017.
 */
define('map', ['jquery', 'leaflet'], function ($) {
        var map = function () {

            this.map = L.map('map').setView([54.788012, 9.436240], 11);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            var that = this;
            $.ajax({
                dataType: "json",
                url: "http://192.168.56.101:80",
                success: function (data) {
                    $.each(data, function (key, value) {
                       that.bindMaker(value);
                    });
                }
            });

        };

        map.prototype.bindMaker = function(data) {
            var marker = L.marker([data.lat, data.lng]).addTo(this.map)
                .bindPopup(data.name + '<br />' + data.street)
                .openPopup();
            var that = this;

            marker.on('click', function () {
                that.loadPrices(data.id, {name: data.name});
            });
        };

        map.prototype.loadPrices = function (gasStationId, data) {
            require(['template-loader', 'graph-chart'], function (TemplateLoader, GraphChart) {
                var templateLoader = new TemplateLoader();
                templateLoader.setFilename('prices-crude-oil-new.hbs');
                templateLoader.setId('mainBlock');
                templateLoader.loadTemplate(function () {
                    var graphChart = new GraphChart('dieselFlensburg', "http://192.168.56.101:80/prices-filling-station.php?gasStationId=" + gasStationId);
                    graphChart.setAddPoints(true);
                    graphChart.createDiagram([1000, 1200], 'dateTime');
                }, data);
            });
        };

        return map;
    }
);