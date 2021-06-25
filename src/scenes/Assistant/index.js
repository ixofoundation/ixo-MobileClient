const MessageText = require('./MessageText')

const React = require('react'),
    {useState, useRef, useCallback, createElement: e} = React,
    {
        View,
        ScrollView,
        StyleSheet,
        TextInput,
        Pressable,
        SafeAreaView,
        KeyboardAvoidingView,
    } = require('react-native'),
    useBot = require('react-rasa-assistant'),
    {Modal, Text, QRScanner, Icon} = require('$/lib/ui'),
    handleCustomAssistantResponse = require('./assistantResponseHandler'),
    theme = require('$/theme'),
    MessageBubble = require('./MessageBubble')

const Assistant = ({initMsg, onClose = () => {}}) => {
    const {
            msgHistory,
            onInputRef,
            userText,
            setUserText,
            sendUserText,
            selectOption,
            botUtter,
            restartSession,
        } = useBot({
            sockUrl: process.env.RASA_SOCKET_URL,
            sockOpts: {transports: ['websocket']},
            initMsg,
            onError: (e) => {
                console.error('assistant error', e)
                alert('Failed to make socket connection!')
            },
            onUtter: (msg) =>
                msg.action && handleCustomAssistantResponse(msg, botUtter),
        }),
        viewRef = useRef(),
        [qrModalVisible, setQrModalVisibility] = useState(false),
        openModal = useCallback(() => setQrModalVisibility(true)),
        closeModal = useCallback(() => setQrModalVisibility(false))

    return (
        <KeyboardAvoidingView behavior="padding" style={s.container}>
            <View style={s.sessionCtrlView}>
                <Pressable
                    style={s.headerBtn}
                    onLongPress={restartSession}
                    onPress={onClose}
                >
                    <Icon name="assistant" />
                </Pressable>
            </View>

            <ScrollView
                ref={viewRef}
                style={s.msgHistoryContainer}
                onContentSizeChange={() => viewRef.current.scrollToEnd()}
            >
                {msgHistory.map((m, mIdx) => {
                    if (m.text)
                        return (
                            <MessageBubble
                                key={m.ts + '-txt'}
                                direction={m.direction}
                                onPress={m.onPress}
                            >
                                <MessageText
                                    text={m.text}
                                    direction={m.direction}
                                />
                            </MessageBubble>
                        )

                    if (m.quick_replies || m.buttons)
                        return (
                            <View
                                key={m.ts + '-btns'}
                                style={s.optionBtnContainer}
                            >
                                {(m.quick_replies || m.buttons).map(
                                    (opt, optIdx) => (
                                        <Pressable
                                            key={m.ts + '-btn-' + opt.payload}
                                            onPress={() =>
                                                selectOption(mIdx, optIdx)
                                            }
                                        >
                                            <View style={s.optionBtn}>
                                                <Text style={s.optionBtnText}>
                                                    {opt.title}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ),
                                )}
                            </View>
                        )

                    if (m.component) {
                        return e(m.component, {
                            key: m.ts + '-comp',
                            msg: m,
                        })
                    }
                })}
            </ScrollView>

            <View style={s.msgSendView}>
                <Pressable style={s.scanBtn} onPress={openModal}>
                    <Icon name="scan" />
                </Pressable>

                <View style={s.msgInputContainer}>
                    <TextInput
                        value={userText}
                        placeholder={'type here...'}
                        onChangeText={setUserText}
                        ref={onInputRef}
                        style={s.msgInput}
                    />
                    <Pressable style={s.sendBtn} onPress={sendUserText}>
                        <Icon name="arrowUp" />
                    </Pressable>
                </View>
            </View>

            <Modal visible={qrModalVisible} onRequestClose={closeModal}>
                <QRScanner
                    onScan={({data}) => {
                        setUserText(userText + ' ' + data)
                        closeModal()
                    }}
                    onClose={closeModal}
                />
            </Modal>
        </KeyboardAvoidingView>
    )
}

const s = StyleSheet.create({
    container: {
        backgroundColor: '#F0F3F9',
        flex: 1,
    },
    sessionCtrlView: {
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBtn: {
        width: 50,
    },
    textMsgIn: {
        color: 'black',
    },
    textMsgOut: {
        color: 'white',
    },
    msgHistoryContainer: {
        paddingHorizontal: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    optionBtnContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionBtn: {
        backgroundColor: 'transparent',
        borderColor: '#125C7E',
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: theme.spacing(2),
        paddingVertical: theme.spacing(1),
        margin: theme.spacing(1),
        marginLeft: 0,
        marginTop: 0,
    },
    optionBtnText: {
        color: '#125C7E',
    },
    msgSendView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: theme.spacing(1),
    },
    msgInputContainer: {
        flexGrow: 1,
        borderColor: '#E8EBED',
        borderRadius: 50,
        borderWidth: 2,
        padding: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    msgInput: {flex: 1, fontSize: 16},
    scanBtn: {justifyContent: 'center', alignItems: 'center', width: 50},
    sendBtn: {
        backgroundColor: '#49BFE0',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

module.exports = Assistant
