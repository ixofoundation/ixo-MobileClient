const React = require('react'),
    {NavigationHandler} = require('navigation-react'),
    {NavigationStack} = require('navigation-react-native'),
    {QueryClient, QueryClientProvider} = require('react-query'),
    {ScrollView} = require('react-native'),
    nav = require('./nav')

const queryClient = new QueryClient()

ScrollView.defaultProps = {
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
}

module.exports = () => (
    <QueryClientProvider client={queryClient}>
        <NavigationHandler stateNavigator={nav}>
            <NavigationStack />
        </NavigationHandler>
    </QueryClientProvider>
)
