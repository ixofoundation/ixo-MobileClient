const
    React = require('react'),
    {View} = require('react-native'),
    Button = require('./Button')


const ButtonGroup = ({style: overrideStyles, items, ...props}) =>
    <View
        style={{...style, ...overrideStyles}}
        children={items.map(btn =>
            <Button key={btn.text} {...props} {...btn} />)}
    />

const style = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
}


module.exports = ButtonGroup
