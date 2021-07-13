const { src, dest, watch, task, series, parallel } = require("gulp");
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minifyCSS = require('gulp-csso')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const tsify = require('tsify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify')
const del = require('del')

sass.compiler = require('sass')


const siteDirectory = '';

const paths = {
  src      : './dev_src/',
  srcSass  : './dev_src/scss/',
  srcPug   : './dev_src/pug/',
  srcTs    : './dev_src/ts/',
  srcFileDir: './dev_src/files/',
  srcFile  : './dev_src/files/**/*.+(gif|svg|jpg|png|json|csv|pdf|ics|zip|eot|ttf|otf|woff|doc|woff2|mp4|json|js)',
  dist     : './dist/' + siteDirectory,
  distCss  : './dist/assets/' + siteDirectory + 'css/',
  distJs  : './dist/assets/' + siteDirectory + 'js/'
};

task('pug', function () {
  return src(paths.srcPug + '**/[^_]*.pug')
    .pipe(plumber({errorHandler: notify.onError({
        message: "<%= error.message %>",
        title: "Template compilation"
      })}))
    .pipe(pug({
      basedir: paths.srcPug,
      pretty: true
    }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream({match: '**/*.html'}))
}) 

task('scss', function(){
  return src(paths.srcSass + '**/*.scss')
    .pipe(plumber({errorHandler: notify.onError({
        message: "<%= error.message %>",
        title: "CSS preprocessing"
      })}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer({grid: true})]))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.distCss))
    .pipe(browserSync.stream({match: '**/*.css'}))
})

task('ts', () => {
  return browserify({
      basedir: '.',
      debug: true,
      entries: [paths.srcTs + 'common.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "TypeScript"
    }))
    .bundle()
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "TypeScript"
    }))
    .pipe(source('common.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.distJs))
    .pipe(browserSync.stream({match: '**/*.js'}))
})

task('file:copy', function() {
  return src(paths.srcFile)
    .pipe(dest(paths.dist))
})

task('clean', (done) => {
  del(paths.dist + '**/*')
  done()
});

task('serve', function(done) {

    browserSync.init({
      server: {
        baseDir: paths.dist
      },
      open: false,
      port: 3000,
      reloadOnRestart: true
    })

    watch(paths.srcSass + '**/*.scss').on('change', series('scss', 'reload'))
    watch(paths.srcTs + '**/*.ts').on('change', series('ts', 'reload'))
    watch(paths.srcPug + '**/*.pug').on('change', series('pug', 'reload'))
    watch(paths.srcFile).on('change', series('file:copy', 'reload'))

    done()
})

task('reload', (done) => {
  browserSync.reload()
  done()
});

task('build', series(
  'clean',
  'ts', 
  'scss',
  'pug',
  'file:copy'
))

task('default', series('build', 'serve'))