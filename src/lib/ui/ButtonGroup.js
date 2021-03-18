const
    React = require('react'),
    {View, StyleSheet} = require('react-native'),
    Button = require('./Button')

const ButtonGroup = ({style: overrideStyles, items, ...props}) =>
    <View
        style={StyleSheet.compose(style.container, overrideStyles)}
        children={items.map(btn =>
            <Button key={btn.text} {...props} {...btn} />)}
    />

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
})


module.exports = ButtonGroup
