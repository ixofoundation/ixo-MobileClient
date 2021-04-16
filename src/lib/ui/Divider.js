
const React = require('react'),
    {View, StyleSheet} = require('react-native'),
    theme = require('$/theme')

const Divider = () => <View style={s.root}/>

const s = StyleSheet.create({
    root: {
        borderBottomWidth: 1,
        borderColor: '#023851',
        width: '100%',
        marginVertical: theme.spacing(1),
    },
})

module.exports = Divider

