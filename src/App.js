const
    React = require('react'),
    {NavigationHandler} = require('navigation-react'),
    {NavigationStack} = require('navigation-react-native'),
    nav = require('./nav')

nav.navigate('lorem')


module.exports = () =>
    <NavigationHandler stateNavigator={nav}>
        <NavigationStack />
    </NavigationHandler>
