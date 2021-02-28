const
    React = require('react'),
    {View, StyleSheet} = require('react-native')

const ButtonGroup = ({style: overrideStyles, children}) =>
    <View
        style={StyleSheet.compose(style.container, overrideStyles)}
        children={children}
    />

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
})


module.exports = ButtonGroup
