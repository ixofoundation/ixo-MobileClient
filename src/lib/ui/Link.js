const
    React = require('react'),
    {useContext} = React,
    {NavigationContext} = require('navigation-react'),
    Text = require('./Text')


const Link = ({
    to,
    data,
    onPress = () => {},
    style: overrideStyles,
    ...props
}) => {
    const {stateNavigator: nav} = useContext(NavigationContext)

    return <Text
        onPress={e => {
            onPress(e)
            nav.navigate(to, data)
        }}
        style={{...style, ...overrideStyles}}
        {...props}
    />
}

const style = {
    borderBottomWidth: 1,
    backgroundColor: 'darkblue',
    color: 'white',
}


module.exports = Link
