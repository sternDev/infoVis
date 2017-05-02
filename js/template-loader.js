/**
 * Created by Jasmin on 27.04.2017.
 */
define('template-loader',['jquery','handlebars'], function($, Handlebars) {
    var templateLoader = function () {
        this.templatePath = 'templates/';
        this.filename = '';
        this.id = '';
        this.isLoaded = false;
    };

    templateLoader.prototype.setFilename = function(filename) {
        this.filename = filename;
    };

    templateLoader.prototype.setId = function(id) {
        this.id = id;
    };

    templateLoader.prototype.getFilePath = function() {
      return this.templatePath+this.filename;
    };

    templateLoader.prototype.isTemplateLoaded = function () {
        return this.isLoaded;
    };

    templateLoader.prototype.loadTemplate = function () {
        var $this = this;
        $.get(this.getFilePath(), function(resp) {
            var template =  Handlebars.compile(resp);
            $('#'+$this.id).html(template);
            $this.isLoaded = true;
        });
    };

    return templateLoader;
});