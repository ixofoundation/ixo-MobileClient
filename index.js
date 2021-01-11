const
    React = require('react'),
    {AppRegistry, Text} = require('react-native')


const App = () =>
    <Text>hello world</Text>

AppRegistry.registerComponent('ixoWallet', () => () => <App />)
