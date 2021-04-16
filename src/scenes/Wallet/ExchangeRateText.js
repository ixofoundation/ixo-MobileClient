const React = require('react'),
    {Text, StyleSheet} = require('react-native'),
    {fontSizes} = require('$/theme'),
    {memoize} = require('lodash')

const ExchangeRateText = ({change, style: overrideStyle = {}}) => <Text
    style={StyleSheet.compose(style(change < 0).root, overrideStyle)} 
    children={change.toFixed(2) + '%'}
/>

const style = memoize((negative) => StyleSheet.create({
    root: {
        color: negative ? '#E2223B' :'#85AD5C',
        fontSize: fontSizes.p1,
    },
}))

module.exports = ExchangeRateText