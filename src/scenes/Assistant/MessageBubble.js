const React = require('react'),
    {StyleSheet, View} = require('react-native'),
    theme = require('$/theme')

const MessageBubble = ({children, direction}) => {
    const directionStyle = direction === 'in' ? 
        styles.bubbleIn : styles.bubbleOut
    const bubbleStyle = StyleSheet.compose(
        styles.bubble, 
        directionStyle,
    )
    return <View style={bubbleStyle}>
        
        {children}
    </View>
}

const styles = StyleSheet.create({
    bubble: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        borderRadius: 25,
        width: '75%',
        ...theme.shadow(),        
    },
    bubbleIn: {
        borderTopLeftRadius: 5,
        alignSelf: 'flex-start',
        backgroundColor: '#F8FAFD',
    },
    bubbleOut: {
        borderTopRightRadius: 5,
        alignSelf: 'flex-end',
        backgroundColor: '#1B6E90',
    },
})


module.exports = MessageBubble
