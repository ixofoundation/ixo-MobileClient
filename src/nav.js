const
    React = require('react'),
    {SafeAreaView} = require('react-native'),
    {StateNavigator} = require('navigation'),
    {NavigationContext} = require('navigation-react'),
    {CreateId, Register, Projects, Credit, ClaimForms} = require('./scenes')



const routes = [
    ['createId', CreateId, {trackCrumbTrail: false}],
    ['register', Register],
    ['projects', Projects],
    ['credit', Credit],
    ['claim-forms', ClaimForms],
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
            <NavigationContext.Consumer children={({data: routeData}) =>
                <SafeAreaView
                    style={{flex: 1}}
                    children={<Component {...routeData} />}
                />}
            />,
)


module.exports = nav
