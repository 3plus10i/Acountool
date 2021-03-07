module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Acountool/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
