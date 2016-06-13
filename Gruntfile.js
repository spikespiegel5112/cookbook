
module.exports = function(grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var YBConfig = {
        staticPort : 9000, //静态资源查看地址

        //移动端的压缩css文件
        css : {
            pc : [
                '<%= meta.srcPath %>css/reset.css',
                '<%= meta.srcPath %>css/common.css',
                '<%= meta.srcPath %>css/index.css',
                '<%= meta.srcPath %>css/access.css',
                '<%= meta.srcPath %>css/booklist.css',
                '<%= meta.srcPath %>css/bookpreview.css',
                '<%= meta.srcPath %>css/ia.css',
                '<%= meta.srcPath %>css/makebook.css',
                '<%= meta.srcPath %>css/staticize.css',
                '<%= meta.srcPath %>css/tplshowcase.css',
                '<%= meta.srcPath %>css/pc.css',
                '<%= meta.srcPath %>css/sem.css'
            ],
            wap : [
                '<%= meta.srcPath %>css/m_reset.css',
                '<%= meta.srcPath %>css/m_common.css',
                '<%= meta.srcPath %>css/m_index.css',
                '<%= meta.srcPath %>css/m_access.css',
                '<%= meta.srcPath %>css/m_booklist.css',
                '<%= meta.srcPath %>css/m_bookpreview.css',
                '<%= meta.srcPath %>css/m_ia.css',
                '<%= meta.srcPath %>css/m_makebook.css',
                '<%= meta.srcPath %>css/m_staticize.css',
                '<%= meta.srcPath %>css/m_pc.css',
                '<%= meta.srcPath %>css/m_shop.css'
            ]
        },
        js : {
            pc : [],
            wap : []
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            assetPath: 'src/assets/',
            distPath: 'dist/',
            jsPath: 'src/js/',
            cssPath: 'src/css/',
            srcPath: "src/"
        },

        banner: '/*!\n' +
        ' * =====================================================\n' +
        ' * SOUL v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * =====================================================\n' +
        ' */\n',

        clean: {
            all: ['<%= meta.distPath %>'],
            sourceMap: ['<%= meta.distPath %>css/*.map']
        },

        /**
         * 启动静态文件的服务器
         */
        connect: {
            distServer : {
                options: {
                    open: true,
                    protocol : "http",
                    port: YBConfig.staticPort + 1,
                    hostname: '127.0.0.1',
                    livereload: 35730,
                    base: ['dist']
                }
            },
            srcServer : {
                options: {
                    open: true,
                    protocol : "http",
                    port: YBConfig.staticPort,
                    hostname: '127.0.0.1',
                    livereload: 35729,
                    base: ['src']
                }
            }
        },

        useminPrepare: {
            html: ['src/**/*.html','src/m/*.html'],
            options: {
                dest: '<%= meta.distPath %>',
                flow : {
                    html : {
                        steps : {
                            css :[''],
                            js : ['']
                        },
                        post : {

                        }
                    }
                }
            }
        },

        /**
         * 合并文件
         */
        concat: {
            js: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= meta.srcPath %>js/*.js'
                ],
                dest: '<%= meta.distPath %>js/all.js'
            },
            css: {
                options: {
                    banner: '<%= banner %>'
                },
                src: YBConfig.css.pc,
                dest: '<%= meta.distPath %>css/all.css'
            },
            mcss: {
                options: {
                    banner: '<%= banner %>'
                },
                src: YBConfig.css.wap,
                dest: '<%= meta.distPath %>css/m.all.css'
            }
        },

        /**
         * 复制文件
         */
        copy: {
            main : {
                files : [{
                    //复制字体
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: 'fonts/**/*',
                    dest: '<%= meta.distPath %>/'
                },{
                    //复制第三方插件
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: 'assets/**/*',
                    dest: '<%= meta.distPath %>/'
                }, {
                    //复制PChtml文件
                    expand: true,
                    cwd: '<%= meta.srcPath %>',
                    src: '*.html',
                    dest: '<%= meta.distPath %>/'
                },
                    {
                        //复制WAPhtml文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: 'm/*.html',
                        dest: '<%= meta.distPath %>/'
                    },{
                        //复制图像文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: 'img/**/*',
                        dest: '<%= meta.distPath %>/'
                    },{
                        //复制css文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: ['css/m_jquery.sureInput.css','css/m_welcome.css','css/activity/*.css'],
                        dest: '<%= meta.distPath %>/'
                    }, {
                        //复制js文件
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: ['js/**/*.js', '!**/base.js'],
                        dest: '<%= meta.distPath %>/'
                    }]
            }
        },

        /**
         * 压缩css
         */
        cssmin: {
            options: {
                banner: '',
                keepSpecialComments: '*',
                sourceMap: false
            },
            css: {
                files: [
                    {
                        src: '<%= meta.distPath %>css/all.css',
                        dest: '<%= meta.distPath %>css/all.min.css'
                    },{
                        src: '<%= meta.distPath %>css/m.all.css',
                        dest: '<%= meta.distPath %>css/m.all.min.css'
                    }
                ]
            }
        },

        /**
         * 压缩js
         */
        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: true,
                mangle: true,
                preserveComments: false
            },
            sure: {
                src: '<%= concat.js.dest %>',
                dest: '<%= meta.distPath %>js/all.min.js'
            }
        },
        /**
         * 压缩图片大小
         */
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.srcPath %>img/',
                        src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                        dest: '<%= meta.distPath %>img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                    }
                ]
            }
        },

        /**
         * px单位转换为 rem
         */
        px2rem: {
            options: {
                ignore0: true,      // ignore 0px default true
                ignore1: true,      // ignore 1px default true
                root: 32,           // set root fontsize, default 32
                designWidth : 640,  //设计稿宽度
                baseFont    : 100,  //基础字体，在设计稿宽度下你要使用的root字体大小（随便填填）
                border      : 1,    //1不处理border，0处理
                ie8         : 0,    //1生成ie8代码，0不生成
                //dest        : '<%= meta.distPath %>css',         //rem css输出目录
                mode        : 0,    //0:px转rem，1rem转px
                media       : 0     //是否自动生成meadia query代码
            },
            css: {
                files: [{
                    expand: true,                       // Enable dynamic expansion
                    cwd: '<%= meta.distPath %>/css',    // Src matches are relative to this path
                    src: ['m.all*.css'],                // Actual patterns to match
                    dest: '<%= meta.distPath %>/css'    // Destination path prefix
                }]
            }
        },

        /**
         * 监听文件
         */
        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                livereload: true
            },
            scripts: {
                files: [
                    '<%= meta.cssPath %>/**/*.css',
                    '<%= meta.jsPath %>/**/*.js',
                    '<%= meta.srcPath %>*.html',
                ],
                tasks: 'dist'
            },
            livereload: {
                options: {
                    livereload: '<%=connect.options.srcServer.livereload%>'
                },

                files: [
                    'dist/*.html',
                    'dist/css/{,*/}*.css',
                    'dist/js/{,*/}*.js',
                    'dist/img/{,*/}*.{png,jpg}'
                ]
            }
        },

        /**
         * 替换压缩之后的文件
         */
        usemin: {
            html: ['<%= meta.distPath %>/*.html','<%= meta.distPath %>/m/*.html'],
            options: {
                assetsDirs: ['<%= meta.distPath %>/css']
            }
        },

        /**
         *  格式化和清理html文件
         */
        htmlmin: {
            html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true //压缩html:根据情况开启与否
                },

                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*.html'],
                    dest: 'dist/'
                },{
                    expand: true,
                    cwd: 'dist/m/',
                    src: ['*.html'],
                    dest: 'dist/m/'
                }]
            }
        },
        /**
         * 发布到FTP服务器 : 请注意密码安全，ftp的帐号密码保存在主目录 .ftppass 文件
         */
        'ftp-deploy': {
            build: {
                auth: {
                    host: '192.168.2.184',
                    port: 21,
                    authKey: 'test184'
                },
                src: './',
                dest: '/home/static/FE/yearbook3-static-page',
                exclusions: ['./**/.DS_Store', './**/Thumbs.db', './node_modules/**']
            }
        },

        'sftp-deploy': {
            build: {
                auth: {
                    host: '192.168.2.184',
                    port: 22,
                    authKey: 'test184'
                },
                cache: 'sftpCache.json',
                src: './',
                dest: '/home/static/FE/yearbook3-static-page',
                exclusions: ['./**/.DS_Store', './**/Thumbs.db', './node_modules/**'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            css: {
                    expand: true,
                    cwd: '<%= meta.cssPath %>/',
                    src: ['**/*.css'],
                    dest: '<%= meta.cssPath %>/'
                }
        },
        csslint:{
            options:{
                csslintrc:"./.csslintrc"
            },
            build:["<%= meta.cssPath %>/*.css"]
        },
        csscomb: {
            options: {
            },
            css: {
                expand: true,
                cwd: '<%= meta.cssPath %>/',
                src: ['**/*.css'],
                dest: '<%= meta.cssPath %>/'
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);

    grunt.registerTask('css', ['autoprefixer', 'csscomb', 'csslint']);

    grunt.registerTask('cleanAll', ['clean']);
    grunt.registerTask('compile-css', ['cssmin', 'clean:sourceMap']);
    grunt.registerTask('compile-js', ['concat', 'uglify']);
    grunt.registerTask('compile', ['clean:all', 'useminPrepare', 'compile-js', 'compile-css', 'copy', 'usemin'/*,'px2rem'*/]);
    grunt.registerTask('build2',['clean', /*'useminPrepare',*/ /*'clean:sourceMap', */'concat','copy',/* 'uglify',*/ 'cssmin', 'usemin']);
    // grunt.registerTask('default', ['build']);
    grunt.registerTask('default', ['build2']);
    grunt.registerTask('publish', ['build2', 'sftp-deploy']);
    grunt.registerTask('server', ['build',  'connect:srcServer', 'connect:distServer', 'watch']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};
