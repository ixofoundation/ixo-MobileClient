require('node-libs-react-native/globals')
require('react-native-gesture-handler')

const
    React = require('react'),
    {AppRegistry, LogBox} = require('react-native'),
    App = require('./src/App'),
    nav = require('./src/nav'),
    {init} = require('./src/init')

AppRegistry.registerComponent('ixoWallet', () => App)

LogBox.ignoreAllLogs()

navigator.geolocation = require('react-native-geolocation-service')

init(nav).catch(e => {
    alert(e)
    console.error(e)
})
