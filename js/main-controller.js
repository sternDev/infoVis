/**
 * Created by Jasmin on 27.04.2017.
 */
define('main-controller', ['jquery', 'template-loader'], function ($, TemplateLoader) {
    var mainController = function (id) {
        this.id = id;
        this.createBarChartTemplate();
        var $this = this;
        $('#priceGraphChart').click(function () {
            $this.createGraphChart();
        });
        $('#priceBarChart').click(function () {
            $("#firstChart").empty();
            $this.createBarChartTemplate();
        });
        $('#priceBarChartNEW').click(function () {
            $("#dieselFlensburg").empty();
            $this.createGraphChartDiesel();
        });
        $('#mapView').click(function () {
            $("#dieselFlensburg").empty();
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
        templateLoader.setId(this.id);
        templateLoader.loadTemplate(function () {
            require(['map'], function (Map) {
                new Map();
            });
        });
    };

    mainController.prototype.createGraphChartDiesel = function () {
        var templateLoader = new TemplateLoader();
        templateLoader.setFilename('prices-crude-oil-diesel.hbs');
        templateLoader.setId(this.id);
        templateLoader.loadTemplate(function () {
            require(['graph-chart'], function (GraphChart) {
                var graphChart = new GraphChart('dieselFlensburg', "/data/created/diesel/diesel.csv");
                graphChart.setAddPoints(true);
                graphChart.createDiagram([1000, 1200], 'time');
            });
        });

    };

    return mainController;
});