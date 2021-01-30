const
    React = require('react'),
    {Text} = require('react-native'),
    {memoize} = require('lodash-es')


module.exports = ({style: overrideStyles, size = 'md', ...props}) =>
    <Text
        style={{...style(size), ...overrideStyles}}
        {...props}
    />


const style = memoize(size => ({
    fontSize: {sm: 15, md: 20, lg: 25}[size],
    padding: 5,
}))
