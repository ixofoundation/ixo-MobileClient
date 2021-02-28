const
    React = require('react'),
    {useContext}= React,
    {Text} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),    
    {NavigationContext} = require('navigation-react')

const SubMenuItem = ({title, to, data}) => {
    const {stateNavigator: nav} = useContext(NavigationContext)
    return <Text
        children={title}
        onPress={() => nav.navigate(to, data)}
        style={style.subItem}
    />
}

const style = {
    subItem: {
        backgroundColor: 'transparent', 
        color: '#8BAABA', 
        fontSize: fontSizes.h6,
        marginVertical: spacing(1),
        marginLeft: spacing(1),
    },
}

module.exports = SubMenuItem