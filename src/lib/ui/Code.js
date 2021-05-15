const
    React = require('react'),
    {Text, Platform} = require('react-native')


const Code = ({style: overrideStyles, ...props}) =>
    <Text
        style={{...style, ...overrideStyles}}
        {...props}
    />

const style = {
    fontFamily: {
        ios: 'Courier New',
        android: 'monospace'
    }[Platform.OS],
    backgroundColor: '#555',
    color: 'white',
    fontSize: 18,
    padding: 5,
    marginBottom: 10,
}


module.exports = Code
