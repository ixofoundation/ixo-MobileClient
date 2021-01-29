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
    fontSize: 36,
    marginBottom: 10,
    textAlign: 'center',
}


module.exports = Heading
