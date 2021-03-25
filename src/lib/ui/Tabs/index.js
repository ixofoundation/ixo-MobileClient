const React = require('react'),
    {useState, Children} = React,
    {View, StyleSheet} = require('react-native'),
    ToggleView = require('$/lib/ui/ToggleView'),
    {spacing} = require('$/theme')

const Tabs = ({children, initialState = 0}) => {
    const [opened, setOpened] = useState(initialState)
    const activeChild = Children.toArray(children)[opened]
    return <>
        <View 
            style={style.tabs}
        >
            <ToggleView opened={[opened]} onItemClick={setOpened}>
                {children}
            </ToggleView>
        </View>
        <View 
            style={style.body}
        >
            { activeChild && activeChild.props.children}
        </View>
    </>
}

const style = StyleSheet.create({
    tabs: {
        flexDirection: 'row', 
        backgroundColor: '#002233',
    },
    body: {
        flex: 1, 
        backgroundColor: '#002B3F', 
    },
})

module.exports = Tabs
