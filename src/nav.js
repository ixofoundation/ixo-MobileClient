const
    React = require('react'),
    {StateNavigator} = require('navigation'),
    {CreateId} = require('./scenes')


const routes = [
    ['createId', CreateId],
]


const nav = new StateNavigator(routes.map(([key, , opts]) => ({key, ...opts})))

routes.forEach(([key, Component]) =>
    nav.states[key].renderScene = () => <Component />)


module.exports = nav
