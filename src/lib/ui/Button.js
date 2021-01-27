const
    React = require('react'),
    {Text, TouchableHighlight} = require('react-native')


module.exports = ({text, onPress}) =>
    <TouchableHighlight
        onPress={onPress}
        style={wrapperStyle}
        children={
            <Text style={textStyle} children={text} />
        }
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
    }
