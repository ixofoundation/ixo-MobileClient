const
    React = require('react'),
    {useRef, createElement: e} = React,
    {View, ScrollView} = require('react-native'),
    useBot = require('react-rasa-assistant'),
    {memoize} = require('lodash-es'),
    {Text, Button, TextInput} = require('$/lib/ui'),
    handleCustomAssistantResponse = require('$/assistantResponseHandler')


const Assistant = ({initMsg}) => {
    const
        {
            msgHistory, onInputRef, userText, setUserText, sendUserText,
            selectOption, botUtter, restartSession,
        } =
            useBot({
                sockUrl: process.env.RASA_SOCKET_URL,
                sockOpts: {transports: ['websocket']},
                initMsg,
                onError: e => console.error('assistant error', e),
                onUtter: msg =>
                    msg.action &&
                        handleCustomAssistantResponse(msg, botUtter),
            }),

        viewRef = useRef()

    return <>
        <ScrollView
            ref={viewRef}
            onContentSizeChange={() => viewRef.current.scrollToEnd()}
        >
            {msgHistory.map((m, mIdx) => {
                if (m.text)
                    return <Text
                        key={m.ts + '-txt'}
                        direction={m.direction}
                        children={m.text}
                        style={s.textMsg(m.direction)}
                    />

                if (m.quick_replies || m.buttons)
                    return (m.quick_replies || m.buttons).map((opt, optIdx) =>
                        <Button
                            key={m.ts + '-btn-' + opt.payload}
                            text={opt.title}
                            onPress={() => selectOption(mIdx, optIdx)}
                        />)

                if (m.component)
                    return e(m.component, {
                        key: m.ts + '-comp',
                        msg: m,
                    })
            })}

        </ScrollView>

        <View style={s.msgSendView}>
            <TextInput
                value={userText}
                onChangeText={setUserText}
                ref={onInputRef}
                style={s.msgInput}
            />

            <Button text='Send' onPress={sendUserText} />
        </View>
    </>

}

const s = {
    textMsg: memoize(direction => ({
        width: '75%',
        margin: 5,
        borderRadius: 5,
        backgroundColor: direction === 'in' ? '#aaf' : '#afa',
        alignSelf: direction === 'in' ? 'flex-start' : 'flex-end',
    })),

    msgSendView: {
        borderTopWidth: 1,
        borderColor: '#aaa',
        display: 'flex',
        flexDirection: 'row',
    },

    msgInput: {flexGrow: 1},
}


module.exports = Assistant
