

const React = require('react'),
    {View, StyleSheet} = require('react-native'),
    {spacing, shadow} = require('$/theme')

const Card = ({children, style: overrideStyles}) => {
    return <View 
        style={StyleSheet.compose(style.root, overrideStyles)}
    >
        {children}
    </View>
}

const style = StyleSheet.create({
    root: {
        padding: spacing(2),
        backgroundColor: '#002B3F',
        borderRadius: 4,
        ...shadow(),
        shadowColor: 'black',
    },
})

module.exports = Card
