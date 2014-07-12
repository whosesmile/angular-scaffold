/* global module:false, require:true */
module.exports = function (grunt) {
  var fs = require('fs');
  var path = require('path');
  var util = require('util');

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    bower: grunt.file.readJSON('.bowerrc'),

    config: {
      folder: 'temp',
      livereload: 35740
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.
    wiredep: {
      target: {
        src: ['app/index.html'],
        cwd: '',
        dependencies: true,
        devDependencies: false,
        exclude: ['json2', 'html5shiv', 'bootstrap.js'],
        fileTypes: {},
        ignorePath: '',
        overrides: {}
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dev: {
        src: ['app/**/*.js']
      }
    },

    html2js: {
      options: {
        module: 'templates',
        rename: function (name) {
          return name.replace('../app/', '');
        }
      },
      dev: {
        src: ['app/**/templates/*.html'],
        dest: 'app/templates.js'
      },
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dev: {
        src: ['app/app.js', 'app/common/**/*.js', 'app/modules/**/module.js', 'app/modules/**/*.js', 'app/templates.js'],
        dest: '<%= config.folder %>/app.js' // ^ ^
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dev: {
        src: '<%= concat.dev.dest %>',
        dest: '<%= config.folder %>/app.min.js' // ^ ^
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
        files: ['<%= jshint.dev.src %>'],
        tasks: ['concat:dev']
      },
      html2js: {
        files: ['app/**/*.html', '!app/*.html'],
        tasks: ['html2js:dev', 'concat:dev']
      },
      index: {
        files: ['app/index.html'],
        tasks: ['copy:index']
      },
      interface: {
        files: ['interface/**/*'],
        tasks: ['copy:interface']
      }
    },
    connect: {
      dev: {
        options: {
          // 经过测试 connect插件会依照base的定义顺序检索文件
          // 这意味着如果存在相同文件，定义在前面的会优先返回
          base: ['<%= config.folder %>', '.'],
          port: 8888,
          open: 'http://127.0.0.1:<%= connect.dev.options.port %>',
          livereload: '<%= config.livereload%>',
          hostname: '*',
          middleware: function (connect, options, middlewares) {
            var support = ['POST', 'PUT', 'DELETE'];
            middlewares.unshift(function (req, res, next) {
              // 单独处理POST请求 请求的地址必须是文件 这里没有进行rewrite处理
              if (support.indexOf(req.method.toUpperCase()) !== -1) {
                var filepath = path.join(options.base[0], req.url);
                if (filepath.indexOf('?') >= 0) {
                  filepath = filepath.substring(0, filepath.indexOf('?'));
                }
                if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                  return res.end(fs.readFileSync(filepath));
                }
              }

              return next();
            });

            return middlewares;
          },
        }
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['index.html', '**/*.{ico,png,txt,gif,jpg,jpeg,css,svg,eot,ttf,woff,json}'],
          dest: '<%= config.folder %>'
        }]
      },
      index: {
        src: 'app/index.html',
        dest: '<%= config.folder %>/index.html'
      },
      interface: {
        src: 'interface',
        dest: '<%= config.folder %>/interface'
      }
    },
    clean: {
      dev: ['<%= config.folder %>'],
    }
  });

  // 模块化工程 (如果工程太大 拆分成多个单页面App，而不是打包成一个大的App)
  grunt.registerTask('modular', function (target) {
    var base = path.join(__dirname, 'app/modules');
    var paths = fs.readdirSync(base);
    paths.forEach(function (name) {
      var stats = fs.statSync(path.join(base, name));
      if (stats.isDirectory()) {

        var modulejs = util.format('%s/modules/%s.js', grunt.config('config.folder'), name);

        // 将模板合并在一起
        grunt.config(util.format('html2js.%s', name), {
          src: util.format('app/modules/%s/templates/*.html', name),
          dest: modulejs
        });

        // 合并模块内部脚本以及相关模板
        grunt.config(util.format('concat.%s', name), {
          src: ['app/app.js', 'app/common/**/*.js', 'app/modules/' + name + '/module.js', 'app/modules/' + name + '/*.js', modulejs],
          dest: modulejs
        });

        grunt.task.run([util.format('html2js:%s', name), util.format('concat:%s', name)]);

        // 是否是构建工程
        if (target === 'dist') {
          grunt.config(util.format('uglify.%s', name), {
            src: modulejs,
            dest: modulejs.replace(/js$/, 'min.js')
          });

          grunt.task.run(util.format('uglify:%s', name));
        }
      }
    });

  });

  // watch会保持node运行 为防止阻塞其后的任务 将watch放在最后
  // 这样也不再需要设定connect的keepalive
  grunt.registerTask('default', function () {
    grunt.config('config.folder', 'temp');
    grunt.task.run(['clean:dev', 'copy:dev', 'html2js:dev', 'modular', 'concat:dev', 'connect:dev', 'watch']);
  });

  grunt.registerTask('dist', function () {
    grunt.config('config.folder', 'dist');
    grunt.task.run(['clean:dev', 'copy:dev', 'html2js:dev', 'modular:dist', 'concat:dev', 'uglify:dev', 'connect:dev', 'watch']);
  });

};