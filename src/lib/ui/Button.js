const
    React = require('react'),
    {Text, TouchableHighlight} = require('react-native'),
    {memoize} = require('lodash')


const Button = ({text, size = 'md', onPress, style: overrideStyles, ...props})=>
    <TouchableHighlight
        onPress={onPress}
        style={{...style(size), ...overrideStyles}}
        children={
            <Text style={textStyle(size)} children={text} />
        }
        {...props}
    />

const
    style = memoize(size => ({
        backgroundColor: 'yellow',
        padding: {sm: 5, md: 10, lg: 20}[size],
        margin: 5,
        borderRadius: 10,
    })),

    textStyle = memoize(size => ({
        fontSize: {sm: 7, md: 20, lg: 20}[size],
        textAlign: 'center',
    }))


module.exports = Button
