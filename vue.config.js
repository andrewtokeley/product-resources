const { defineConfig } = require("@vue/cli-service");
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
