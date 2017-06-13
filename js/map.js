/**
 * Created by Jasmin on 15.05.2017.
 */
define('map', ['jquery', 'leaflet','jqueryUI'], function ($) {
        var map = function () {
            this.map = null;
            this.initMap();
            this.gasStationData = null;
            this.loadMarker("//infovis.ladyscript.ninja/comm/get-gas-station.php");
            this.currentGasArt = $("#gasArt option:selected").val();
            this.currentGasArtOutput = $("#gasArt option:selected").text();
            this.startDate = '2017-03-12';
            this.endDate = '2017-03-22';
            this.startDateOutput = null;
            this.endDateOutput = null;
            this.markers = [];
            this.graphChart= [];
            this.dataComparision= [];
            this.dataComparisionName= [];
            this.range = [ 0, 1300 ];
            this.normalIcon = L.icon({
                iconUrl: '/images/marker-icon.png'
            });
            this.selectedIcon = L.icon({
                iconUrl: '/images/marker-icon-selected.png'
            });
            var that = this;

            $('#gasArt').change(function () {
                that.currentGasArt = $(this).val();
                that.currentGasArtOutput = $("#gasArt option:selected").text();
                that.updateAllDiagrams();

            });

            $('#startDate').val(this.startDate);
            $('#endDate').val(this.endDate);
            this.startDateOutput = formatDateForOutput(this.startDate);
            this.endDateOutput = formatDateForOutput(this.endDate);

            $('#updateDates').click(function () {
                that.startDate = $('#startDate').val();
                that.startDateOutput = formatDateForOutput(that.startDate);

                that.endDate = $('#endDate').val();
                that.endDateOutput = formatDateForOutput(that.endDate);
                that.updateAllDiagrams();
            });

            $( "#priceRangeSlider" ).slider({
                range: true,
                min: 0,
                max: 1900,
                step:100,
                values: that.range,
                slide: function( event, ui ) {
                    $( "#priceRange" ).val(  formatPrice(ui.values[ 0 ])+" - " + formatPrice(ui.values[ 1 ]) );
                    that.range = ui.values;
                },
                stop: function() {


                    that.updateAllDiagrams();
                }
            });
            $( "#priceRange" ).val( formatPrice($( "#priceRangeSlider" ).slider( "values", 0 )) +
                " - " + formatPrice($( "#priceRangeSlider" ).slider( "values", 1 )) );

            function formatPrice(price) {
                return ((price/1000).toFixed(2)).replace('.',',')+" €";
            }
        };

        map.prototype.updateAllDiagrams = function () {
            var that = this;
            $('#mainBlock .hoverBox').each(function (key, value) {
                var id = $(this).find('.diagramPrices').attr('id');
                id = id.split('diagramPrices')['1'];
                $(this).remove();
                createDataSetToLoadPrices(that, that.gasStationData[id], id);
            });



            that.loadPricesComparision();
        };

        function formatDateForOutput(dateValue) {
            var values = dateValue.split('-');
            var date = new Date();
            date.setDate(values[2]);
            date.setMonth(values[1]);
            date.setFullYear(values[0]);
            return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        }

        function getDiffBetweenDays(startDateValue, endDateValue) {
            var values = startDateValue.split('-');
            var startDate = new Date();
            startDate.setDate(values[2]);
            startDate.setMonth(values[1]);
            startDate.setFullYear(values[0]);

            values = endDateValue.split('-');
            var endDate = new Date();
            endDate.setDate(values[2]);
            endDate.setMonth(values[1]);
            endDate.setFullYear(values[0]);
            return (endDate.getTime() - startDate.getTime()) / 60 / 60 / 24/1000;
        }

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
                    that.gasStationData = data;
                    that.markers = [];
                    $.each(data, function (key, value) {
                        var marker = that.bindMaker(value, key === 3, key);
                        that.markers.push(marker);
                    });
                    centerMapToMarker(that, that.markers);
                }
            });
        };

        function centerMapToMarker(context, markers) {
            // center map to markers:
            var group = new L.featureGroup(markers);
            context.map.fitBounds(group.getBounds());
        }

        map.prototype.bindMaker = function (data, showDiagramm, key) {
            var marker = L.marker([data.lat, data.lng], {icon: this.normalIcon}).addTo(this.map)
                .bindPopup(data.name + '<br />' + data.street);

            var that = this;

            marker.on('click', function () {
                this.setIcon(that.selectedIcon);
                createDataSetToLoadPrices(that, data, key);
            });

            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            if (showDiagramm) {
                createDataSetToLoadPrices(that, data, key);
                marker.setIcon(that.selectedIcon);
                marker.openPopup();
            }
            return marker;
        };

        function createDataSetToLoadPrices(context, data, key) {
            context.loadPrices(data.id, {
                name: data.name,
                postCode: data.post_code,
                place: data.place,
                houseNumber: data.house_number,
                street: data.street,
                key: key,
                selectedGasArt: context.currentGasArtOutput,
                selectedStartDate: context.startDateOutput,
                selectedEndDate: context.endDateOutput
            });
        }

        map.prototype.loadPrices = function (gasStationId, data) {
            var that = this;
            require(['template-loader', 'graph-chart'], function (TemplateLoader, GraphChart) {
                var templateLoader = new TemplateLoader();
                templateLoader.setFilename('prices-crude-oil-new.hbs');
                templateLoader.setId('mainBlock');
                templateLoader.addToTemplate(function () {
                    that.graphChart[data.key] = new GraphChart('diagramPrices' + data.key, "//infovis.ladyscript.ninja/comm/prices-gas-station.php?gasStationId=" + gasStationId + "&type=" + that.currentGasArt + "&startDate=" + that.startDate + "&endDate=" + that.endDate);

                    that.graphChart[data.key].setAddPoints(getDiffBetweenDays(that.startDate, that.endDate) <= 3);
                    that.graphChart[data.key].createDiagram(that.range,'dateTime', data.key, function() {
                        $('#addToComparision'+data.key).click(function () {
                            var id = $(this).closest('div.hoverBox').find('.diagramPrices').attr('id');
                            id = id.split('diagramPrices')['1'];
                            if(typeof that.dataComparision[id] === 'undefined' || that.dataComparision[id] === null) {
                                that.dataComparision[id] = that.graphChart[id].getCurrentData();
                                console.log(that.dataComparision[id]);

                                $(this).html('Vom Vergleich entfernen');
                            } else {
                                that.dataComparision.splice(id, 1);

                                $(this).html('Zum Vergleich hinzufügen');
                            }

                            that.loadPricesComparision();
                        });
                    });


                    that.dataComparisionName[data.key] = data.name;

                    $('.deleteDiagramm').click(function () {
                        var id = $(this).closest('div.hoverBox').find('.diagramPrices').attr('id');
                        id = id.split('diagramPrices')['1'];
                        that.markers[id].setIcon(that.normalIcon);
                        $(this).closest('div.hoverBox').remove();
                    });

                }, data);
            });
        };

    map.prototype.loadPricesComparision = function () {
        var that = this;
        var data = that.dataComparision;
        var dataNames = that.dataComparisionName;
        console.log(data);
        var loadTemplate = false;
        data.forEach(function (value) {
            if(value !== null) {
                loadTemplate = true;
                return false;
            }
        });
        if(loadTemplate === false) {
            $('#pricesComparisionBlock').empty();
        } else {
            require(['template-loader', 'graph-chart'], function (TemplateLoader, GraphChart) {
                var templateLoader = new TemplateLoader();
                templateLoader.setFilename('prices-comparision.hbs');
                templateLoader.setId('pricesComparisionBlock');
                templateLoader.loadTemplate(function () {
                    that.graphChart[data.key] = new GraphChart('diagramPricesComparision');
                    that.graphChart[data.key].createMultipleLineDiagram(data, dataNames, that.range, 'dateTime', 'loaderComparision');
                }, data);
            });
        }
    };

        return map;
    }
);