const React = require('react'),
    {StyleSheet, Pressable} = require('react-native'),
    {memoize} = require('lodash-es'),
    theme = require('$/theme')

const MessageBubble = ({direction, children, onPress}) => (
    <Pressable
        onPress={onPress}
        style={styles(direction).bubble}
        children={children}
    />
)

const getMsgPositionStyle = (dir) => {
    if (dir === 'in') {
        return {
            borderTopLeftRadius: 5,
            alignSelf: 'flex-start',
            backgroundColor: '#F8FAFD',
        }
    }
    return {
        borderTopRightRadius: 5,
        alignSelf: 'flex-end',
        backgroundColor: '#1B6E90',
    }
}

const styles = memoize((direction) =>
    StyleSheet.create({
        bubble: {
            marginBottom: theme.spacing(1),
            padding: theme.spacing(2),
            borderRadius: 25,
            width: '75%',
            ...theme.shadow(),

            ...getMsgPositionStyle(direction),
        },
    }),
)

module.exports = MessageBubble
