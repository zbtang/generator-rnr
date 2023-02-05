'use strict';
require('shelljs/global');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

module.exports = yeoman.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.Base.apply(this, arguments);

        if (this._currentDirectoryHasRNApp())
            this.env.error('Yo! Looks like you are trying to run the app generator in a directory that already has a RN app.');

        var react_cli = this._checkIfRNIsInstalled();

        if (!react_cli)
            this.env.error('No React Native found: start by installing it https://facebook.github.io/react-native/docs/getting-started.html#quick-start');

    },
    /**
     * 输出提示,获取参数
     * @returns {*}
     */
    prompting: function () {
        this.log(yosay('Welcome to the hunky-dory ' + chalk.red('generator-rnr') + ' generator!'));

        var prompts = [{
            type: 'input',
            name: 'appName',
            message: 'What should your app be called?',
            default: 'MyReactApp',
            validate: value => (/^[$A-Z_][0-9A-Z_$]*$/i).test(value)
        }];
        return this.prompt(prompts).then(function (props) {
            this.props = props;
        }.bind(this));
    },
    makeSureDestinationDirectoryIsNotOccupiedAlready: function () {
        // check to see if destination directory is empty or not
        // if it's empty -> go ahead and do the thing
        // if not empty -> create a folder and use it as cwd
        // except if this.options.baker is on
        const filesInDestinationDirectory = fs.readdirSync(this.destinationPath('.'));

        if (filesInDestinationDirectory.length !== 0 && !this.options.baker) {

            // fs.mkdirSync(this.destinationPath(this.props.appName));

            // this.destinationRoot(this.destinationPath(this.props.appName));
        }
    },
    writing: function () {

        if (exec('react-native init ' + this.props.appName).code !== 0) {
            this.env.error('react-native init project error');
        }
        // this.log(yosay('init ' + chalk.red(this.props.appName) + ' successful!'));

        this.destinationRoot(this.destinationPath(this.props.appName));

        this.template('.editorconfig', '.editorconfig');
        ['ios', 'android'].forEach(platform => {
            rm(this.destinationPath(`index.${platform}.js`));
            this.template('index.platform.js', `index.${platform}.js`, {
                appName: this.props.appName
            });
        });
        this.bulkDirectory('app', 'app');

        this.composeWith('component', {
            options: {
                componentName: 'HomeContainer',
                destinationRoot: this.destinationPath('.'),
                boilerplateName: 'Vanila',
                platformSpecific: false
            }
        }, {local: require.resolve('../component')});
        this.composeWith('reducer', {
            options: {
                componentName: 'HomeContainer',
                destinationRoot: this.destinationPath('.'),
                boilerplateName: 'Vanila',
                platformSpecific: false
            }
        }, {local: require.resolve('../component')});
    },

    install: function () {
        this.npmInstall(['redux', 'redux-thunk', 'reselect', 'react-redux'], {'save': true});
        this.npmInstall(['remote-redux-devtools', 'remotedev-server'], {'saveDev': true});
    },

    _currentDirectoryHasRNApp: function () {
        try {
            ['android', 'ios', 'index.ios.js', 'index.android.js'].forEach(function (f) {
                fs.statSync(this.destinationPath(f));
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    _checkIfRNIsInstalled: function () {
        return which('react-native');
    },
});
