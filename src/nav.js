const
    React = require('react'),
    {StateNavigator} = require('navigation'),
    {CreateId, Register, Projects, Credit} = require('./scenes')


const routes = [
    ['createId', CreateId],
    ['register', Register],
    ['projects', Projects],
    ['credit', Credit],
]


const nav = new StateNavigator(routes.map(([key, , opts]) => ({key, ...opts})))

routes.forEach(([key, Component]) =>
    nav.states[key].renderScene = () => <Component />)


module.exports = nav
