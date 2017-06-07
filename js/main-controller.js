/**
 * Created by Jasmin on 27.04.2017.
 */
define('main-controller', ['jquery', 'template-loader'], function ($, TemplateLoader) {
    var mainController = function (id) {
        this.id = id;
        var $this = this;

        $this.createMapView();
        $('#priceGraphChart').click(function () {
            $this.createGraphChart();
        });
        $('#priceBarChart').click(function () {
            $("#firstChart").empty();
            $this.createBarChartTemplate();
        });
        $('#mapView').click(function () {
            $this.createMapView();
        });
    };

    mainController.prototype.createBarChartTemplate = function () {
        var templateLoader = new TemplateLoader();
        templateLoader.setFilename('bar-chart.hbs');
        templateLoader.setId(this.id);
        templateLoader.loadTemplate(function () {
            require(['bar-chart'], function (BarChart) {
                var barChart = new BarChart('firstChart');
                barChart.createDiagram(2014);
                $('#yearSelect').change(function () {
                    $("#firstChart").empty();
                    barChart.createDiagram(this.value);
                });
            });
        });
    };

    mainController.prototype.createGraphChart = function () {
        var templateLoader = new TemplateLoader();
        templateLoader.setFilename('prices-crude-oil.hbs');
        templateLoader.setId(this.id);
        templateLoader.loadTemplate(function () {
            require(['graph-chart'], function (GraphChart) {
                for (var year = 2014; year <= 2017; year++) {
                    var graphChart = new GraphChart("crudeOil" + year, "../data/created/crude-oil/crude-oil-" + year + ".csv");
                    graphChart.createDiagram([0, 0.8], 'date');
                }
            });
        });
    };

    mainController.prototype.createMapView = function () {
        var templateLoader = new TemplateLoader();
        templateLoader.setFilename('map-view.hbs');
        templateLoader.setId('mapViewBlock');
        templateLoader.loadTemplate(function () {
            require(['map'], function (Map) {
                new Map();
            });
        });
    };

    return mainController;
});