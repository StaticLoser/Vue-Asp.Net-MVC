module.exports = {
    outputDir: 'dist',
    assetsDir: 'static',
    devServer: {
        port: 8081,
        proxy: {
            '/Article': { //前端任何含/api的URL请求都会被反向代理。如http://localhost:8000/xxx/api/source/xxx的请求会变成服务器的反向代理请求
                target: 'http://localhost:2021', //原来请求的服务器IP地址会换成此地址，如以上地址会变成http://localhost:5000/xxx/api/source/xxx
                changeOrigin: true, // 是否跨域
                //   pathRewrite:{'.+?/api':'/api'}  // 这里会对反向代理的地址进行重写。比如我的实际后端资源的URI是http://localhost:5000/api/resource，那么不加这个配置属性的话是访问不到我这个有效地址的。这里配置是一个正则替换，替换后就是后端api真正有效的地址了
            }
        }
    }
}