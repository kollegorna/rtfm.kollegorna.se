var gulp = require('gulp');
var rsync = require('gulp-rsync');
var browserSync = require('browser-sync');
var cp = require('child_process');
var messages = {
  reload: 'Reloading...',
  build:  'Building Middleman...'
};

gulp.task('middleman-build', function(done) {
  browserSync.notify(messages.build);
  cp.spawn('bundle', ['exec', 'middleman', 'build'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('browser-reload', ['middleman-build'], function() {
  browserSync.notify(messages.reload);
  browserSync.reload();
});

gulp.task('browser-sync', ['middleman-build'], function() {
  browserSync({
    server: {
      baseDir: 'build'
    },
    port: 4060
  });
});

gulp.task('watch', function() {
  gulp.watch('source/**/*.*', ['browser-reload']);
});

gulp.task('rsync', ['middleman-build'], function() {
  gulp.src('build/**')
    .pipe(rsync({
      root: 'build',
      hostname: '178.62.13.136',
      username: 'root',
      destination: '/var/www/middleman-boilerplate',
      incremental: true,
      progress: true,
      relative: true,
      emptyDirectories: true,
      recursive: true,
      clean: true,
      exclude: ['.DS_Store'],
      include: []
    }));
});

gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('build', ['middleman-build']);
gulp.task('deploy', ['rsync']);
gulp.task('install-bower', function(done) {
  cp.spawn('bower', ['install'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('install-bundle', function(done) {
  cp.spawn('bundle', ['install'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('install', ['install-bundle', 'install-bower']);
