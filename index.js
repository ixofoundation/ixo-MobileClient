require('node-libs-react-native/globals')

const
    React = require('react'),
    {AppRegistry} = require('react-native'),
    App = require('./src/App')

AppRegistry.registerComponent('ixoWallet', () => () => <App />)
