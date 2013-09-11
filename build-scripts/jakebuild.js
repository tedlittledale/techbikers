//jake -f build-scripts/jakebuild.js 
var  requirejs = require('/usr/local/bin/r.js'),
fs = require('fs');
// settings
var FILE_ENCODING = 'utf-8',
EOL = '\n';

var wrench = require('wrench'),
util = require('util'),
TEMPDIR = 'builddir/temp/', time = (new Date()).getTime();

var configIndex = {
  // Initialize the application with the main application file
  baseUrl: "app",
    name : "config-techbikers",
    out : "builddir/app/config-techbikers-"+time+".js",
    templates : ['tweetTemplate', 'progressTemplate'],
    optimize : "uglify",
  paths: {
    // JavaScript folders
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",

    // Libraries
    jquery: "../assets/js/libs/jquery",
    handlebars: "../assets/js/libs/handlebars",
    helpers: "../assets/js/libs/handlebar-helpers",
    underscore: "../assets/js/libs/underscore",
    modernizr: "../assets/js/libs/modernizr-2.5.3.min",
    backbone: "../assets/js/libs/backbone-min",
    swipe: "../assets/js/libs/plugins/swipe",
    d3: "../assets/js/libs/d3",
    foundation : "../javascripts/foundation/foundation",
    joyride : "../javascripts/foundation/foundation.joyride",
    tooltips : "../javascripts/foundation/foundation.tooltips"
  },
underscorerlArgs: "bust=v"+Math.round(Math.random()*1000000),
  shim: {
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    handlebars: {
      exports: "Handlebars"
    },
    underscore: {
      exports: "_"
    },
    d3: {
      exports: "d3"
    }
  }
};
task('default', function (params) {
    jake.Task.compileSass.invoke(params);
});
task('compileSass', function (params){
    console.log('starting sass compile.', params);
    jake.exec(['compass compile sass/app.scss --output-style compressed --force'], function (compiled) {
        console.log('sass compiled');
        jake.Task.wrenchtasks.invoke(params);
        jake.Task.requireopt.invoke(params);
        jake.Task.copyhtml.invoke(params);
        jake.Task.handlebars.invoke(params);
        complete();
    }, {printStdout: false});
},{async: true});
task('wrenchtasks', function (params) {
    console.log(params);
    console.log('starting wrenchtasks.');
    wrench.rmdirSyncRecursive('builddir', function(){});
    wrench.mkdirSyncRecursive('builddir/assets/js/libs/', '0777');
    wrench.mkdirSyncRecursive('builddir/temp/app/templates', '0777');
    wrench.mkdirSyncRecursive('builddir/stylesheets', '0777');
    wrench.copyDirSyncRecursive('assets/img/', 'builddir/assets/img');
    wrench.copyDirSyncRecursive('stylesheets', 'builddir/stylesheets');
    wrench.copyDirSyncRecursive('tweetdata', 'builddir/tweetdata');
    wrench.copyDirSyncRecursive('javascripts', 'builddir/javascripts');
    console.log('completed wrenchtasks.');
});

task('requireopt', function (params) {


    if(params === 'all' || params === 'configIndex'){
        console.log('starting requireopt leaderboard.');
        requirejs.optimize(configIndex, function (buildResponse) {
        //buildResponse is just a text output of the modules
        //included. Load the built file for the contents.
        //Use config.out to get the optimized file contents.
        var contents = fs.readFileSync(configIndex.out, 'utf8');
        });
        console.log('completing requireopt. leaderboard');
    }
});
task('copyhtml', function (params) {
    console.log('starting copyhtml.');
    copy('index.html', 'builddir/index.html');
    copySimple('assets/js/libs/require.js', 'builddir/assets/js/libs/require.js');
    console.log('completing copyhtml.');
});
function copySimple(srcPath, epgdistPath) {
    var out =  fs.readFileSync(srcPath, FILE_ENCODING);
    fs.writeFileSync(epgdistPath, out, FILE_ENCODING);
    console.log(' '+ epgdistPath +' built.');
}
task('handlebars', function (params) {
    var list = new jake.FileList();
    list.include('app/templates/*.html');
    var cmds = [], templates = list.toArray(), tempFiles = [];
    for(var i = 0, l = templates.length; i < l; i++){
        cmds.push('handlebars '+templates[i] +' -f builddir/temp/'+templates[i].substring(0, templates[i].indexOf('.html'))+'.js');
        tempFiles.push('builddir/temp/'+templates[i].substring(0, templates[i].indexOf('.html'))+'.js');
        console.log(templates[i].substring(0, templates[i].indexOf('.html')));
    }
    var out =  'JST = [];';
    //fs.writeFileSync('', out, FILE_ENCODING);
    console.log(cmds.join(','));
    jake.exec(cmds, function (compiled) {
        console.log('All tests passed.');
        console.log(compiled);
        jake.logger.log('done');
        complete();
        console.log(tempFiles.join(','));
        concatTemplates(tempFiles, TEMPDIR+'temp.js');
        console.log(params);

        if(params === 'all' || params === 'configIndex'){
            concat([
                'builddir/app/config-techbikers-'+time+'.js',
                TEMPDIR+'temp.js'
                ], 'builddir/app/config-techbikers-'+time+'.js');
        }
        wrench.rmdirSyncRecursive(TEMPDIR, function(){
            console.log('failed');
        });
        //wrench.rmdirSyncRecursive('builddir/temp', function(){});
        //out += 'JST['+templates+']'
    }, {printStdout: false});

});

function copy(srcPath, epgdistPath) {
    var out =  fs.readFileSync(srcPath, FILE_ENCODING);
    out = out.replace(/http\:\/\/fast/g, 'https://fast');
    out = out.replace(/app\.css/g, 'app.css?'+Math.round(Math.random() * 1000000));
    out = out.replace(/config-techbikers/g, 'config-techbikers-'+time);
    fs.writeFileSync(epgdistPath, out, FILE_ENCODING);
    console.log(' '+ epgdistPath +' built.');
}

function concatTemplates(fileList, epgdistPath) {
    var global = 'var JST = [];';
    var out = fileList.map(function(filePath){
        var path = filePath.substring(filePath.indexOf(TEMPDIR)+TEMPDIR.length, filePath.indexOf('.js'));
        var prefix = 'JST["'+path+'"] = ';
            //console.log(fs.readFileSync(filePath, FILE_ENCODING));
            return prefix + fs.readFileSync(filePath, FILE_ENCODING);
        });

    fs.writeFileSync(epgdistPath, global+out.join(EOL), FILE_ENCODING);
    console.log(' '+ epgdistPath +' built.');
}

function concat(fileList, epgdistPath) {
    var out = fileList.map(function(filePath){
        return fs.readFileSync(filePath, FILE_ENCODING);
    });
    fs.writeFileSync(epgdistPath, out.join(EOL), FILE_ENCODING);
    console.log(' '+ epgdistPath +' built.');
}
