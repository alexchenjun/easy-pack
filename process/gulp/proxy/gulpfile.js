module.exports.var = {
    CONST : "<%require('./constant.json')%>",
    proxy : "<%require('http-proxy-middleware')%>",
    proxyDemo: "<%proxy('/topics', {\
        target: 'https://cnodejs.org/api/v1',\
        changeOrigin: true,\
        logLevel: 'debug'\
    })%>",
    proxyList : "<%PROXYSTATUS ? [proxyDemo] : null%>"
}

module.exports.config = [
    "gulp.task('sync', ['STYLECOMPILER', 'js', 'handlebars'], () => {\
        browserSync.init({\
            port: 3333,\
            server: {\
                baseDir: './src',\
                middleware: proxyList\
            },\
        });\
        gulp.watch('./src/templates/**/*.*', ['handlebars']);\
        gulp.watch('./src/STYLECOMPILER/*.STYLECOMPILER', ['STYLECOMPILER']);\
        gulp.watch('./src/es6/*.js', ['js']);\
        gulp.watch('./src/*.html').on('change', browserSync.reload)\
    })"
]