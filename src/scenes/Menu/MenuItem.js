const React = require('react'),
    {useContext} = React,
    {View, Text, Pressable} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    {NavigationContext} = require('navigation-react')

const MenuItem = ({title, icon, to, data, open, onPress, children}) => {
    const {stateNavigator: nav} = useContext(NavigationContext)
    return (
        <>
            <Pressable
                style={style.root}
                onPress={(e) => {
                    if (to) {
                        nav.navigate(to, data)
                    }
                    onPress(e)
                }}
            >
                {icon}
                <Text children={title} style={style.text} />
            </Pressable>
            {children && open && (
                <View style={style.subItems}>
                    <View style={style.line} />
                    <View style={style.listContainer}>{children}</View>
                </View>
            )}
        </>
    )
}

const style = {
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing(1.5),
    },
    text: {
        color: 'white',
        fontSize: fontSizes.h6,
        marginLeft: spacing(1),
    },
    subItems: {flexDirection: 'row'},
    line: {
        marginHorizontal: 12,
        borderColor: '#143F54',
        borderLeftWidth: 1,
    },
    listContainer: {flex: 1},
}

module.exports = MenuItem
