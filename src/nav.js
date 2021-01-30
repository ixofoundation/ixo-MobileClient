const
    React = require('react'),
    {SafeAreaView} = require('react-native'),
    {StateNavigator} = require('navigation'),
    {CreateId, Register, Projects, Credit} = require('./scenes')



const routes = [
    ['createId', CreateId, {trackCrumbTrail: false}],
    ['register', Register],
    ['projects', Projects],
    ['credit', Credit],
]


const nav =
    new StateNavigator(
        routes.map(([key, , opts]) => ({
            key,
            trackCrumbTrail: true,
            ...opts,
        })),
    )

routes.forEach(([key, Component]) =>
    nav.states[key].renderScene =
        () =>
            <SafeAreaView
                style={{flex: 1}}
                children={<Component />}
            />
)


module.exports = nav
