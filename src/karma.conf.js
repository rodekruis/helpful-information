// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.3/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      captureConsole: true,
      clearContext: false,
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'text-summary'],
      fixWebpackSourcePaths: true,
      combineBrowserReports: true,
      skipFilesWithNoCoverage: true,
    },
    reporters: ['dots', 'progress', 'kjhtml', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatch: true,
    restartOnFileChange: true,
  });
};
