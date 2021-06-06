const React = require('react'),
    {useContext} = React,
    {Text, StyleSheet, Pressable} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    {NavigationContext} = require('navigation-react')

const SubMenuItem = ({title, to, data}) => {
    const {stateNavigator: nav} = useContext(NavigationContext)
    return (
        <Pressable style={style.subItem} onPress={() => nav.navigate(to, data)}>
            <Text children={title} style={style.subItemText} />
        </Pressable>
    )
}

const style = StyleSheet.create({
    subItem: {
        backgroundColor: 'transparent',
        paddingVertical: spacing(1),
        paddingLeft: spacing(1),
    },
    subItemText: {
        color: '#8BAABA',
        fontSize: fontSizes.h6,
    },
})

module.exports = SubMenuItem
