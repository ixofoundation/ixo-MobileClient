const React = require('react'),
    {Text, StyleSheet} = require('react-native')

const MessageText = ({direction, text}) => {
    return (
        <Text
            style={direction === 'in' ? s.textMsgIn : s.textMsgOut}
            direction={direction}
            children={text}
        />
    )
}

const s = StyleSheet.create({
    textMsgIn: {
        color: 'black',
    },
    textMsgOut: {
        color: 'white',
    },
})

module.exports = MessageText
