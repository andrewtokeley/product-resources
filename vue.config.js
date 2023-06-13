const { defineConfig } = require("@vue/cli-service");

process.env.VUE_APP_VERSION = require('./package.json').version


module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {   
    resolve: {
      fallback: {
        "fs": false,
        "tls": false,
        "net": false,
        "stream": false,
        "crypto": false,
        "path": false,
        "child_process": false,
        "os": false,
        "https": false,
        "request": false,
      }
    }
  }
})
