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
                var graphChart14 = new GraphChart(2014);
                graphChart14.createDiagram();
                var graphChart15 = new GraphChart(2015);
                graphChart15.createDiagram();
                var graphChart16 = new GraphChart(2016);
                graphChart16.createDiagram();
                var graphChart17 = new GraphChart(2017);
                graphChart17.createDiagram();
            });
        });
    };

    mainController.prototype.createGraphChartDiesel = function () {
        var templateLoader = new TemplateLoader();
        templateLoader.setFilename('prices-crude-oil-diesel.hbs');
        templateLoader.setId(this.id);
        templateLoader.loadTemplate(function () {
            require(['graph-chart-diesel'], function (GraphChartDiesel) {
                var graphChart = new GraphChartDiesel(2014);
                graphChart.createDiagram();
            });
        });

    };

    return mainController;
});