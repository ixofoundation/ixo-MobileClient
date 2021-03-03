const
    React = require('react'),
    {NavigationHandler} = require('navigation-react'),
    {NavigationStack} = require('navigation-react-native'),
    {QueryClient, QueryClientProvider} = require('react-query'),
    nav = require('./nav')


const queryClient = new QueryClient()

module.exports = () =>
    <QueryClientProvider client={queryClient}>
        <NavigationHandler stateNavigator={nav}>
            <NavigationStack />
        </NavigationHandler>
    </QueryClientProvider>
