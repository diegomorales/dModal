module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery', 'jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'dist/minimodal.js',
      'test/**/*.js'
    ]
  });
};