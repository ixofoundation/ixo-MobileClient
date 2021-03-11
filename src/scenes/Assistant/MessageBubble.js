const React = require('react'),
    {StyleSheet, View} = require('react-native'),
    {memoize} = require('lodash-es'),
    theme = require('$/theme')

const MessageBubble = ({direction, children}) =>
    <View style={styles(direction).bubble} children={children} />

const styles = memoize(direction =>
    StyleSheet.create({
        bubble: {
            marginBottom: theme.spacing(1),
            padding: theme.spacing(2),
            borderRadius: 25,
            width: '75%',
            ...theme.shadow(),

            ...(direction === 'in' ? {
                borderTopLeftRadius: 5,
                alignSelf: 'flex-start',
                backgroundColor: '#F8FAFD',
            } : {
                borderTopRightRadius: 5,
                alignSelf: 'flex-end',
                backgroundColor: '#1B6E90',
            }),
        },
    }),
)


module.exports = MessageBubble
