module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    lint:{
      files: ['blade.js']
    },
    jshint: {
      options: {
        forin:true,
        noarg:true,
        noempty:true,
        eqeqeq:true,
        evil:true,
        bitwise:true,
        undef:true,
        unused:true,
        curly:true,
        browser:true,
        devel:true,
        jquery:true,
        maxerr:50
      }
    },
    qunit: {
      files: ['test/index.html']
    }
  });

  // Task to run tests
  grunt.registerTask('default', 'lint qunit');
};