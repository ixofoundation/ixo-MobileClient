const
    React = require('react'),
    {forwardRef} = React,
    {TextInput} = require('react-native')


module.exports = forwardRef(({style, ...props}, ref) =>
    <TextInput
        style={{...style, ...inputStyle}}
        {...props}
        ref={ref}
    />)


const inputStyle = {
    fontSize: 20,
    backgroundColor: '#ddd',
    margin: 5,
    borderRadius: 10,
}
