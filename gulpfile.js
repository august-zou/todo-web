var gulp = require("gulp");
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var del = require('del');

var paths = {
  scripts:["./public/javascripts/**/*"],
  main_script:["./public/javascripts/app.js"],
  target_script:["./public/javascripts/bundle.js"]
};

gulp.task('clean_js',function(done){
  del([paths.target_script],done);
});

gulp.task('scripts',function() {
  browserify(paths.main_script)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/dist/script/'));
});

gulp.task('watch',function(){
  glup.watch(paths.scripts,['scripts']);
    
});
gulp.task('default',['scripts']);
