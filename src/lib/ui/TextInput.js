const React = require('react'),
    {forwardRef} = React,
    {TextInput, StyleSheet} = require('react-native')

module.exports = forwardRef(({style, onChange, ...props}, ref) => (
    <TextInput
        style={StyleSheet.compose(inputStyle.root, style)}
        placeholderTextColor="#BCC1CA"
        onChangeText={onChange}
        {...props}
        ref={ref}
    />
))

const inputStyle = StyleSheet.create({
    root: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomColor: '#BCC1CA',
        borderBottomWidth: 1,
    },
})
