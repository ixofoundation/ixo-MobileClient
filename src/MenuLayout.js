const
    React = require('react'),
    {gestureHandlerRootHOC} = require('react-native-gesture-handler'),
    DrawerLayout = require('react-native-gesture-handler/DrawerLayout').default,
    Menu = require('./scenes/Menu')


const MenuLayout = gestureHandlerRootHOC(({children}) =>
    <DrawerLayout
        drawerWidth={300}
        drawerPosition={DrawerLayout.positions.Left}
        drawerType='front'
        drawerBackgroundColor='#ddd'
        renderNavigationView={() => <Menu />}
        children={children}
    />,
)


module.exports = MenuLayout
