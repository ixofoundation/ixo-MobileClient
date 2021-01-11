const
    React = require('react'),
    {NavigationHandler} = require('navigation-react'),
    {NavigationStack} = require('navigation-react-native'),
    AsyncStorage = require('@react-native-async-storage/async-storage').default,
    nav = require('./nav')


nav.navigate('lorem')

AsyncStorage.getItem('test')
    .then(console.log)

AsyncStorage.setItem('test', 'mest' + Date.now())


module.exports = () =>
    <NavigationHandler stateNavigator={nav}>
        <NavigationStack />
    </NavigationHandler>
