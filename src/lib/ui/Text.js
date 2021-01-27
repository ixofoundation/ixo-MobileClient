const
    React = require('react'),
    {Text} = require('react-native')


module.exports = ({style, ...props}) =>
    <Text
        style={{...style, ...textStyle}}
        {...props}
    />


const textStyle = {
    fontSize: 20,
    padding: 5,
}
