module.exports = function(grunt) {
    // ≈‰÷√
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build : {
                src : 'src/ActiveFlow.js',
                dest : 'dest/ActiveFlow.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // ◊¢≤·»ŒŒÒ
    grunt.registerTask('default', ['uglify']);
}; 
