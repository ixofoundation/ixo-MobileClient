const
    React = require('react'),
    {Text} = require('react-native'),
    {memoize} = require('lodash-es'),
    theme = require('$/theme')


module.exports = ({style: overrideStyles, size = 'sm', children}) =>
    <Text
        style={{...style(size), ...overrideStyles}}
        children={children}
    />


const style = memoize(size => ({
    fontSize: {sm: 15, lg: 25}[size],
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    color: 'white',
}))
