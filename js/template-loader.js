/**
 * Created by Jasmin on 27.04.2017.
 */
define('template-loader', ['jquery', 'handlebars'], function ($, Handlebars) {
    var templateLoader = function () {
        this.templatePath = 'templates/';
        this.filename = '';
        this.id = '';
    };

    templateLoader.prototype.setFilename = function (filename) {
        this.filename = filename;
    };

    templateLoader.prototype.setId = function (id) {
        this.id = id;
    };

    templateLoader.prototype.getFilePath = function () {
        return this.templatePath + this.filename;
    };

    templateLoader.prototype.loadTemplate = function (method, context) {
        var $this = this;
        $.get(this.getFilePath(), function (resp) {
            var template = Handlebars.compile(resp);
            var html;
            if (typeof context === "object") {
                html = template(context);
            } else {
                html = template;
            }
            $('#' + $this.id).html(html);
            method();
        });
    };

    templateLoader.prototype.addToTemplate = function (method, context) {
        var $this = this;
        $.get(this.getFilePath(), function (resp) {
            var template = Handlebars.compile(resp);
            var html;
            if (typeof context === "object") {
                html = template(context);
            } else {
                html = template;
            }
            $('#' + $this.id).prepend( html);
            method();
        });
    };

    return templateLoader;
});