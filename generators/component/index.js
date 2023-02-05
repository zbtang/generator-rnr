'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
    prompting: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the first-rate ' + chalk.red('generator-rnr') + ' generator!'
        ));

        var prompts = [{
            type: 'input',
            name: 'componentName',
            message: 'What should your component be called?',
            default: 'MyNewComponent',
            validate: value => {
                return (/^[A-Z][0-9A-Z]*$/i).test(value);
            }
        }, {
            type: 'input',
            name: ''
        }];

        return this.prompt(prompts).then(function (props) {
            // To access props later use this.props.someAnswer;
            this.props = props;
        }.bind(this));
    },

    writing: function () {
        this.fs.copy(
            this.templatePath('dummyfile.txt'),
            this.destinationPath('dummyfile.txt')
        );
    },

    install: function () {
        this.installDependencies();
    }
});
