const
    React = require('react'),
    {Text} = require('react-native')


const Code = ({style: overrideStyles, ...props}) =>
    <Text
        style={{...style, ...overrideStyles}}
        {...props}
    />

const style = {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    fontSize: 18,
    padding: 5,
}


module.exports = Code
