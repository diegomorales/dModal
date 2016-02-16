module.exports = function (config) {
    config.set({
        frameworks: ['jasmine-jquery', 'jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        files: [
            {
                pattern: 'test/**/*.html',
                included: false,
                served: true
            },
            'dist/miniModal.js',
            'test/**/*.js'
        ]
    });
};