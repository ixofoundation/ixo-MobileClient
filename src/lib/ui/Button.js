const
    React = require('react'),
    {Text, TouchableHighlight} = require('react-native')


module.exports = ({text, onPress, style, ...props}) =>
    <TouchableHighlight
        onPress={onPress}
        style={{...wrapperStyle, ...style}}
        children={
            <Text style={textStyle} children={text} />
        }
        {...props}
    />


const
    wrapperStyle = {
        backgroundColor: 'yellow',
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },

    textStyle = {
        fontSize: 20,
        textAlign: 'center',
    }
