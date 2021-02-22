const React = require('react'),
    {StyleSheet, View} = require('react-native'),
    theme = require('$/lib/theme'),
    {default: LinearGradient} = require('react-native-linear-gradient')

const MessageBubble = ({children, direction}) => {
    const directionStyle = direction === 'in' ? 
        styles.bubbleIn : styles.bubbleOut
    const bubbleColerRange = direction === 'in' ? 
        ['#FFFFFF', '#F8FAFD'] : ['#10597B', '#1B6E90']
    const bubbleStyle = StyleSheet.compose(
        styles.bubble, 
        directionStyle,
    )
    const bubbleShadowStyle = StyleSheet.compose(
        styles.bubbleShadow, 
        directionStyle,
    )
    return <View style={bubbleShadowStyle}>
        <LinearGradient 
            colors={bubbleColerRange} 
            style={bubbleStyle}>
            {children}
        </LinearGradient>
    </View>
}


const styles = StyleSheet.create({
    bubble: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        borderRadius: 25,        
    },
    bubbleShadow: {
        borderRadius: 25,
        width: '75%',
        ...theme.shadow(),
    },
    bubbleIn: {
        borderTopLeftRadius: 5,
        alignSelf: 'flex-start',
    },
    bubbleOut: {
        borderTopRightRadius: 5,
        alignSelf: 'flex-end',
    },
})


module.exports = MessageBubble