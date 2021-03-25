const React = require('react'),
    {Text, Pressable, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    {memoize} = require('lodash-es')

const Tab = ({title, suffix, prefix, open, onPress}) => {
    const {root, text} = style(open)
    return <Pressable
        style={root}
        onPress={onPress}
    >
        {prefix}
        <Text
            style={text}
        >
            {title}
        </Text>
        {suffix}
    </Pressable>
}

const style = memoize(open => StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: open ? 2 : 0,
        borderColor: '#00D2FF',
        padding: spacing(1),
    },
    text:{
        color: open ? '#00D2FF' : 'white',
        fontSize: fontSizes.button,
    },
}))

module.exports = Tab
