const React = require('react'),
    {View, StyleSheet} = require('react-native'),
    {spacing} = require('$/theme')


const Header = ({children, style: overrideStyles}) => {
    return <View style={StyleSheet.compose(style.header, overrideStyles)}>
        {children}
    </View>
}


const style = StyleSheet.create({
    header: {
        padding: spacing(2),
        flexDirection: 'row',
        backgroundColor: '#002233',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})

module.exports = Header
