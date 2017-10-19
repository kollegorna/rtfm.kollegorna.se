var gulp = require('gulp');
var gutil = require('gulp-util');
var rsync = require('rsyncwrapper').rsync;
var browserSync = require('browser-sync');
var cp = require('child_process');
var svgmin = require('gulp-svgmin');
var messages = {
  reload: 'Reloading...',
  build:  'Building Middleman...'
};

gulp.task('minify-svg', function (){
    return gulp.src('build/assets/images/*.svg', {base: './'})
        .pipe(svgmin())
        .pipe(gulp.dest('./'));
});

gulp.task('middleman-build', function(done) {
    browserSync.notify(messages.build);
    cp.spawn('bundle', ['exec', 'middleman', 'build'], { stdio: 'inherit' }).on('close', function()
    {
        cp.spawn('gulp', ['minify-svg'], { stdio: 'inherit' }).on('close', done);
    });
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
  rsync({
    ssh: true,
    src: './build/',
    dest: 'root@178.62.13.136:/var/www/rtfm.kollegorna.se',
    recursive: true,
    syncDest: true,
    args: ['--verbose'],
    exclude: ['.DS_Store']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('middleman', function(done) {
  cp.spawn('bundle', ['exec', 'middleman'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('build', ['middleman-build']);
gulp.task('deploy', ['rsync']);
gulp.task('install-bundle', function(done) {
  cp.spawn('bundle', ['install'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('install', ['install-bundle']);
