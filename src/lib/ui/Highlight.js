const React = require('react'),
    {View, StyleSheet} = require('react-native'),
    {memoize} = require('lodash-es')

const Highlight = ({color}) => {
    return <View
        style={style(color).root}
    />
}

const style = memoize(color => StyleSheet.create({
    root: {
        position: 'absolute',
        backgroundColor: color,
        borderRadius: 24,
        height: '40%',
        top: '50%',
        left: -5,
        width: 10,
    },
}))

module.exports = Highlight