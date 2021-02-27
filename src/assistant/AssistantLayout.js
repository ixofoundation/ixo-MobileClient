const
    React = require('react'),
    {useState} = React,
    {View, StyleSheet, Pressable} = require('react-native'),
    {Modal} = require('$/lib/ui'),
    Assistant = require('./Assistant'),
    theme = require('$/lib/theme'),
    AssistantIcon = require('$/lib/icons/assistant.svg').default


const AssistantLayout = ({initMsg, children, autoOpen = false}) => {
    const [astShown, setAstVisibility] = useState(autoOpen)

    return <>
        <Modal
            visible={astShown}
            onRequestClose={() => setAstVisibility(false)}
        >
            <Assistant
                initMsg={initMsg}
                onClose={() => setAstVisibility(false)}
            />
        </Modal>

        <View style={style.content} children={children} />

        <View style={style.bottomBar}>
            <Pressable
                onPress={() => setAstVisibility(true)}
            >
                <AssistantIcon/>
            </Pressable>
        </View>
    </>
}

const style = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexGrow: 1,
    },
})


module.exports = AssistantLayout
