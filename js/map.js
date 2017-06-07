/**
 * Created by Jasmin on 15.05.2017.
 */
define('map', ['jquery', 'leaflet'], function ($) {
        var map = function () {
            this.map = null;
            this.initMap();
            this.loadMarker("http://192.168.56.101:80");
        };

        map.prototype.initMap = function () {
            this.map = L.map('map').setView([54.788012, 9.436240], 11);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        };

        map.prototype.loadMarker = function (url) {
            var that = this;
            $.ajax({
                dataType: "json",
                url: url,
                success: function (data) {
                    var markers = [];
                    $.each(data, function (key, value) {
                        var marker = that.bindMaker(value);
                        markers.push(marker);
                    });
                    centerMapToMarker(that, markers);
                }
            });
        };

        function centerMapToMarker(context, markers) {
            // center map to markers:
            var group = new L.featureGroup(markers);
            context.map.fitBounds(group.getBounds());
        }

        map.prototype.bindMaker = function (data) {
            var marker = L.marker([data.lat, data.lng]).addTo(this.map)
                .bindPopup(data.name + '<br />' + data.street)
                .openPopup();
            var that = this;

            marker.on('click', function () {
                that.loadPrices(data.id, {name: data.name});
            });
            return marker;
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