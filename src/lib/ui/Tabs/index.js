const React = require('react'),
    {useState, Children, cloneElement} = React,
    {View, StyleSheet} = require('react-native'),
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
        padding: spacing(3),
    },
})


// TODO: remove after the merge
const ToggleView = ({
    children,
    opened = [],
    onItemClick,
}) => {
    return Children.map(children, (child, index) => {
        return cloneElement(child, {
            ...child.props,
            onPress: () => onItemClick(index),
            open: opened.some(i => i === index),
        })
    })
}

module.exports = Tabs