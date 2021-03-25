const
    React = require('react'),
    {Text} = require('react-native')


const Heading = ({style: overrideStyles, ...props}) =>
    <Text
        style={{...style, ...overrideStyles}}
        {...props}
    />

const style = {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
}


module.exports = Heading
