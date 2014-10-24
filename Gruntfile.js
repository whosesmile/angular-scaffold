/* global module:false, require:true, __dirname:true */

module.exports = function (grunt) {
  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    config: {
      folder: 'temp',
      port: 8888,
      livereload: 35740
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    // '<%= grunt.template.today("yyyy-mm-dd HH:MM:dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dev: {
        src: ['temp/**/*.js']
      }
    },

    html2js: {
      options: {
        module: 'templates',
        htmlmin: {
          removeComments: true,
          collapseWhitespace: true
        },
        rename: function (name) {
          return name.replace('../app/', '');
        }
      },
      dev: {
        src: ['app/**/templates/**/*.html'],
        dest: 'app/templates.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.folder %>',
          src: '**/*.js',
          dest: '<%= config.folder %>'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        enclose: {}
      }
    },
    cssmin: {
      dev: {
        options: {
          banner: '<%= banner %>'
        },
        files: [{
          expand: true,
          cwd: '<%= config.folder %>/css/',
          src: '*.css',
          dest: '<%= config.folder %>/css/'
        }]
      }
    },
    rename: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.folder %>/css/',
          src: '*.css',
          dest: '<%= config.folder %>/css/',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      options: {
        livereload: '<%= config.livereload%>'
      },
      gruntfile: {
        options: {
          reload: true
        },
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['app/**/*.js'],
        tasks: ['modular']
      },
      css: {
        files: ['app/**/*.css'],
        tasks: ['copy:css']
      },
      img: {
        files: ['app/img/**/*'],
        tasks: ['copy:img']
      },
      fonts: {
        files: ['app/fonts/**/*'],
        tasks: ['copy:fonts']
      },
      html2js: {
        files: ['app/**/*.html', '!app/*.html', '!app/works/**/*.html'],
        tasks: ['html2js:dev', 'modular']
      },
      html: {
        files: ['app/works/**/*.html'],
        tasks: ['copy:html']
      }
    },
    connect: {
      dev: {
        options: {
          // 经过测试 connect插件会依照base的定义顺序检索文件
          // 这意味着如果存在相同文件，定义在前面的会优先返回
          base: ['<%= config.folder %>', '.'],
          port: '<%= config.port %>',
          open: 'http://127.0.0.1:<%= config.port %>/works/account.html',
          livereload: '<%= config.livereload%>',
          hostname: '*',
          middleware: function (connect, options, middlewares) {
            var support = ['POST', 'PUT', 'DELETE'];
            middlewares.unshift(function (req, res, next) {
              // 开发期间访问图片资源去掉模块名称
              req.url = req.url.replace(/\w+?\/img/, '/img/');
              // weixin重写添加interface
              req.url = req.url.replace(/^\/account/, '/interface/account/');
              // 处理POST请求，以及rewrite, 请求的地址必须是文件
              if (support.indexOf(req.method.toUpperCase()) !== -1) {
                for (var i = 0; i < options.base.length; i++) {
                  var filepath = path.join(options.base[i], req.url);
                  if (filepath.indexOf('?') >= 0) {
                    filepath = filepath.substring(0, filepath.indexOf('?'));
                  }
                  if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                    return res.end(fs.readFileSync(filepath));
                  }
                }
              }

              return next();
            });

            return middlewares;
          }
        }
      }
    },
    copy: {
      dev: {
        files: [{
          src: 'app/base.css',
          dest: '<%= config.folder %>/css/base.css'
        }, {
          expand: true,
          cwd: 'app/modules',
          flatten: true,
          src: '**/*.css',
          dest: '<%= config.folder %>/css/'
        }, {
          expand: true,
          cwd: 'app',
          src: ['*.html', 'works/**/*.html', '**/*.{ico,png,txt,gif,jpg,jpeg,svg,eot,ttf,woff,json}'],
          dest: '<%= config.folder %>'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'app',
          src: 'works/**/*.html',
          dest: '<%= config.folder %>'
        }]
      },
      css: {
        files: [{
          src: 'app/base.css',
          dest: '<%= config.folder %>/css/base.min.css'
        }, {
          expand: true,
          cwd: 'app/modules',
          flatten: true,
          src: '**/*.css',
          dest: '<%= config.folder %>/css/',
          ext: '.min.css'
        }]
      },
      img: {
        files: [{
          expand: true,
          cwd: 'app/img',
          src: '**/*',
          dest: '<%= config.folder %>/img'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'app/fonts',
          src: '**/*',
          dest: '<%= config.folder %>/fonts'
        }]
      }
    },
    clean: {
      dev: ['<%= config.folder %>']
    },
    imagemin: { // Task
      dynamic: { // Another target
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'app/img', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,ico,bmp}'], // Actual patterns to match
          dest: 'app/img' // Destination path prefix
        }]
      }
    }
  });

  // 模块化工程 (工程太大 拆分成多个单页面App，而不是打包成一个大的App)
  grunt.registerTask('modular', function (target) {
    var base = path.join(__dirname, 'app/modules');
    var paths = fs.readdirSync(base);
    paths.forEach(function (name) {
      var stats = fs.statSync(path.join(base, name));
      if (/^[^.]/.test(name) && stats.isDirectory()) {

        var singleModule = util.format('%s/js/%s.js', grunt.config('config.folder'), name);

        // 将模板合并在一起
        grunt.config(util.format('html2js.%s', name), {
          src: ['app/config/templates/**/*.html', util.format('app/modules/%s/templates/**/*.html', name)],
          dest: singleModule
        });

        // 合并模块内部脚本以及相关模板 
        // 1.经过html2js,现在singleModule是模板内容,再次合并它并保存会产生期望内容
        grunt.config(util.format('concat.%s', name), {
          src: ['app/app.js', 'app/config/support.js', 'app/config/config.js', 'app/config/**/*.js', 'app/modules/' + name + '/module.js', 'app/modules/' + name + '/*.js', singleModule],
          dest: singleModule
        });

        grunt.task.run([util.format('html2js:%s', name), util.format('concat:%s', name)]);

        // 是否是构建工程
        if (target === 'dist') {
          // 先做注入设定
          grunt.config(util.format('ngAnnotate.%s', name), {
            src: singleModule,
            dest: singleModule
          });
          grunt.task.run(util.format('ngAnnotate:%s', name));

          // 压缩代码
          grunt.config(util.format('uglify.%s', name), {
            src: singleModule,
            dest: singleModule
          });
          grunt.task.run(util.format('uglify:%s', name));
        }

        // 重命名
        grunt.config(util.format('rename.%s', name), {
          src: singleModule,
          dest: singleModule.replace(/js$/, 'min.js')
        });
        grunt.task.run(util.format('rename:%s', name));
      }
    });
  });

  // 开发
  grunt.registerTask('default', function () {
    grunt.config('config.folder', 'temp');
    grunt.task.run(['clean:dev', 'copy:dev', 'rename:dev', 'html2js:dev', 'modular', 'connect:dev', 'watch']);
  });

  // 打包
  grunt.registerTask('dist', function () {
    grunt.config('config.folder', 'dist');
    grunt.task.run(['clean:dev', 'copy:dev', 'cssmin:dev', 'rename:dev', 'html2js:dev', 'modular:dist']);
  });

  // 语法检查
  grunt.registerTask('hint', function () {
    grunt.config('config.folder', 'temp');
    grunt.task.run(['modular', 'jshint:dev']);
  });

};