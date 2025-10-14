// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.4/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      
    ],
    client: {
      captureConsole: true,
      clearContext: false,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      subdir: '.',
      reports: ['html', 'text-summary'],
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['spec', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatch: true,
    restartOnFileChange: true,
  });
};
