module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'jshint': {
            all: {
                src: 'src/*.js',
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    quotmark: 'single',
                    regexp: true,
                    undef: true,
                    unused: true,
                    trailing: true,
                    maxlen: 120
                }
            }
        },
        'uglify': {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
            build: {
                src: 'src/ActiveFlow.js',
                dest: 'dest/ActiveFlow.min.js'
            }
        },
        'jsdoc': {
            src: ['src/*.js'],
            options: {
                destination: 'doc'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    // 注册任务
    grunt.registerTask('default', ['jshint', 'uglify', 'jsdoc']);
}

