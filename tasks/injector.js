'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

    grunt.registerMultiTask('injector', 'Inject dependencies into html files.', function() {

        var self = this,
            options,
            filesList = '',
            expression;

        options = self.options({
            aims: [],
            type: 'js'
        });
        expression = new RegExp(
            '<!-- ' + options.type + ':' + self.target + ' -->' +
            '[\\w\\W]*(?=<!-- ' + options.type + ' -->)' +
            '<!-- ' + options.type + ' -->',
            'g'
        );

        this.files.forEach(function (file) {
            filesList += getTemplate(options.type, file.dest);
        });

        _.each(options.aims, function (aim) {
            var content;

            content = grunt.file.read(aim);
            content = content.replace(
                expression,
                '<!-- ' + options.type + ':' + self.target + ' -->\n' +
                filesList +
                '<!-- ' + options.type + ' -->'
            );
            grunt.file.write(aim, content);
        });

        function getTemplate(type, src) {
            switch (type) {
                case 'css':
                    return '<link rel="stylesheet" href="' + src + '">\n';
                default:
                    return '<script type="text/javascript" src="' + src + '"></script>\n';
            }
        }

    });

};
