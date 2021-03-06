const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    {memoize} = require('lodash-es')

const Badge = ({color, text, style: overrideStyles}) => {
    const {root, text: textStyle} = style(color)
    return <View style={StyleSheet.compose(root, overrideStyles)}>
        <Text style={textStyle}>{text}</Text>
    </View>
}

const style = memoize(color => StyleSheet.create({
    root: {
        backgroundColor: color,
        borderRadius: 24,
        paddingHorizontal: spacing(1),
    },
    text: {color: 'white', fontSize: fontSizes.caption},
}))

module.exports = Badge