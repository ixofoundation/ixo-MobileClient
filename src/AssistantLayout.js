const React = require('react'),
    {useState} = React,
    {View, StyleSheet, Pressable} = require('react-native'),
    {Modal, Icon} = require('$/lib/ui'),
    Assistant = require('$/scenes/Assistant'),
    theme = require('$/theme')

const AssistantLayout = ({initMsg, children, autoOpen = false}) => {
    const [astShown, setAstVisibility] = useState(autoOpen)

    return (
        <>
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
                <Pressable onPress={() => setAstVisibility(true)}>
                    <Icon name="assistant" />
                </Pressable>
            </View>
        </>
    )
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
