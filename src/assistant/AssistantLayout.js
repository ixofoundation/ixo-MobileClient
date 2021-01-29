const
    React = require('react'),
    {useState} = React,
    {View, Modal} = require('react-native'),
    {Button} = require('$/lib/ui'),
    Assistant = require('./Assistant')


const AssistantLayout = ({initMsg, children}) => {
    const [astShown, setAstVisibility] = useState(true)

    return <>
        <Modal visible={astShown}>
            <Assistant
                initMsg={initMsg}
                onClose={() => setAstVisibility(false)}
            />
        </Modal>

        <View style={{flexGrow: 1}} children={children} />

        <Button
            text='A'
            onPress={() => setAstVisibility(true)}
            style={{width: 50, height: 50, alignSelf: 'center'}}
        />
    </>
}


module.exports = AssistantLayout
