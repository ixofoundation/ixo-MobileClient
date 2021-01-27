const
    React = require('react'),
    {useRef, Fragment} = React,
    {ScrollView, TextInput} = require('react-native'),
    useBot = require('react-rasa-assistant'),
    {Text, Button} = require('$/lib/ui'),
    handleCustomAssistantResponse = require('$/assistantResponseHandler')


module.exports = ({initMsg}) => {
    const
        {
            msgHistory, onInputRef, userText, setUserText, sendUserText,
            selectOption, botUtter, restartSession,
        } =
            useBot({
                sockUrl: process.env.RASA_SOCKET_URL,
                sockOpts: {transports: ['websocket']},
                initMsg,
                onError: e =>
                    console.error('assistant error', e),
                onUtter: msg =>
                    msg.action &&
                        handleCustomAssistantResponse(msg, botUtter),
            }),

        viewRef = useRef()

    return <ScrollView
        ref={viewRef}
        onContentSizeChange={() => viewRef.current.scrollToEnd()}
    >
        {msgHistory.map((m, mIdx) => {
            if (m.text)
                return <Text key={m.ts + '-txt'}>
                    {{in: '<', out: '>'}[m.direction]} {m.text}
                </Text>

            if (m.quick_replies || m.buttons)
                return (m.quick_replies || m.buttons).map((opt, optIdx) =>
                    <Button
                        key={m.ts + '-btn-' + opt.payload}
                        text={opt.title}
                        onPress={() => selectOption(mIdx, optIdx)}
                    />)

            if (m.component)
                return <Fragment key={m.ts + '-comp'}>
                    {m.component}
                </Fragment>
        })}

        <TextInput
            value={userText}
            onChangeText={setUserText}
            ref={onInputRef}
        />

        <Button text='Send' onPress={sendUserText} />
        <Button text='Restart' onPress={restartSession} />
    </ScrollView>
}
