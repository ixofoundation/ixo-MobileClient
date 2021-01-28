require('node-libs-react-native/globals')

const
    React = require('react'),
    {AppRegistry} = require('react-native'),
    App = require('./src/App'),
    nav = require('./src/nav'),
    {init} = require('./src/init')

AppRegistry.registerComponent('ixoWallet', () => () => <App />)

init(nav).catch(e => {
    alert(e)
    console.error(e)
})
