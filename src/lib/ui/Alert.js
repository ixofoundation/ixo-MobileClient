const
    React = require('react'),
    {Text} = require('react-native')


const Alert = ({style: overrideStyles, ...props}) =>
    <Text
        style={{...style, ...overrideStyles}}
        {...props}
    />

const style = {
    borderRadius: 5,
    backgroundColor: 'orange',
    color: 'white',
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    marginVertical: 10,
    padding: 5,
}


module.exports = Alert
