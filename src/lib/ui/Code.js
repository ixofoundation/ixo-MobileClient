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
    backgroundColor: '#555',
    color: 'white',
    fontSize: 18,
    padding: 5,
    marginBottom: 10,
}


module.exports = Code
