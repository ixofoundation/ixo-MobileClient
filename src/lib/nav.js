const
    React = require('react'),
    {NavigationContext} = require('navigation-react')


const withNav = WrappedComponent => props =>
    <NavigationContext.Consumer
        children={nav => <WrappedComponent {...props} nav={nav} />}
    />


module.exports = {
    withNav,
}
