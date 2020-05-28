module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/relic-drop/'
    : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Warframe Relic Drop Data',
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
}