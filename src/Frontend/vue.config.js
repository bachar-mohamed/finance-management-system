const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/forLater': {
        target: 'http://localhost:1234',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
