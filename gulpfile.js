var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('webpack', function () {
  webpack({
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      path: 'dist'
    },
    module: {
      loaders: [
        { test: /\.json$/, loader: 'json' }
      ]
    }
  }, function (err, status) {
    if (err) {
      throw new Error('webpack error', err);
    }

    console.log('[webpack]', status.toString());
  });
});

gulp.task('copy', function () {
  gulp.src(['./src/index.html', './src/js/index.js', './libs/**/*.js'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['copy', 'webpack'], function () {
  gulp.watch(['./src/**/*.js', './src/index.html', './config/**/*.json', './index.js', './libs/**/*.js'], ['copy', 'webpack']);
});
