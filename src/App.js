const
    React = require('react'),
    {NavigationHandler} = require('navigation-react'),
    {NavigationStack} = require('navigation-react-native'),
    nav = require('./nav')


module.exports = () =>
    <NavigationHandler stateNavigator={nav}>
        <NavigationStack />
    </NavigationHandler>
