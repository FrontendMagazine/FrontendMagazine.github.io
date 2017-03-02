var gulp = require('gulp')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')
var less = require('gulp-less')
var clean = require('gulp-clean')
var RevAll = require('gulp-rev-all')
var imagemin = require('gulp-imagemin')
var qiniu = require('gulp-qiniu')
var qiniuConfig = require('../../../.qiniu.json')
var digitaloceanConfig = require('../../../.digitalocean.json')
var scp = require('gulp-scp2')

gulp.task('less', function () {
  return gulp.src('src/less/Frontend-Magazine.less')
    .pipe(less())
    .pipe(gulp.dest('src/css/'))
})

gulp.task('min-script', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(uglify().on('error', function(e) { console.log('\x07',e.message);}))
    .pipe(gulp.dest('dist/js/'))
})

gulp.task('min-style', ['less'], function () {
  return gulp.src('src/css/**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'))
})

gulp.task('min-images', function () {
  return gulp.src('src/images/**/*.{jpg,gif,png,JPG,jpeg}')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/images/'))
})

gulp.task('copy', function () {
    return gulp.src([
        'src/**',
        '!src/css/**',
        '!src/images/**',
        '!src/js/**',
        '!src/less/**',
        '!src/_posts/archive/**',
        '!src/_posts/doing/**',
        '!src/_posts/todo/**'
      ])
    .pipe(gulp.dest('dist/'))
})

gulp.task('clean', function () {
  return gulp.src([
    'dist',
    'rev',
    '_site'
  ], {read: false})
    .pipe(clean());
})

gulp.task('dist', ['min-script', 'min-style', 'min-images', 'copy'])

gulp.task('build', ['dist'], function () {
  var revAll = new RevAll({
    prefix: 'http://7xrvqo.com1.z0.glb.clouddn.com',
    dontRenameFile: ['.html', '.xml', '.md', '.yml', '.ico'],
    dontUpdateReference: ['.html', '.xml', '.md', '.yml', '.ico']
  })
  return gulp.src('dist/**')
    .pipe(revAll.revision())
    .pipe(gulp.dest('rev'))
})

gulp.task('digitalocean', function () {
  return gulp.src([
    '_site/**',
    '!_site/css/**',
    '!_site/fonts/**',
    '!_site/images/**',
    '!_site/js/**'
  ], {base: '_site'})
    .pipe(scp(digitaloceanConfig))
    .on('error', function(err) {
      console.log(err)
    })
})

gulp.task('watch', function () {
  return gulp.watch('src/less/**/*.less', ['less'])
});

gulp.task('qiniu', function () {
  return gulp.src([
    'rev/css/**',
    'rev/fonts/**',
    'rev/js/**',
    'rev/images/**'
  ], {base: 'rev'})
  .pipe(qiniu({
    accessKey: qiniuConfig.accessKey,
    secretKey: qiniuConfig.secretKey,
    bucket: "qianduan",
    private: false
  }, {
    dir: '/',
    concurrent: 10
  }))
})
