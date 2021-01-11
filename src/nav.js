const
    {StateNavigator} = require('navigation'),
    {Lorem, Ipsum} = require('./scenes')


const routes = [
    ['lorem', Lorem],
    ['ipsum', Ipsum, {trackCrumbTrail: true}],
]


const nav = new StateNavigator(routes.map(([key, , opts]) => ({key, ...opts})))

routes.forEach(([key, comp]) =>
    nav.states[key].renderScene = comp)


module.exports = nav
