const
    React = require('react'),
    {Text} = require('react-native')


module.exports = ({style: overrideStyles, ...props}) =>
    <Text
        style={{...style, ...overrideStyles}}
        {...props}
    />


const style = {
    fontSize: 20,
    padding: 5,
}
