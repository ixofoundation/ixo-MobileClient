const React = require('react'),
    {View, Share, Alert, Text, Pressable} = require('react-native'),
    QRCode = require('react-native-qrcode-svg').default,
    {useWallet} = require('$/stores'),
    Clipboard = require('@react-native-clipboard/clipboard').default,
    MessageBubble = require('./MessageBubble'),
    MessageText = require('./MessageText')

const handlers = {
    credit: {
        showAddressText: () => [
            {
                component: ({msg}) => (
                    <MessageBubble
                        direction={msg.direction}
                        onPress={() => {
                            Clipboard.setString(
                                useWallet.getState().agent.address,
                            )
                            Alert.alert('Address copied to clipboard!')
                        }}
                    >
                        <MessageText
                            text={useWallet.getState().agent.address}
                            direction={msg.direction}
                        />
                    </MessageBubble>
                ),
            },
        ],

        showAddressQRCode: () => [
            {text: 'See below'},

            {
                component: ({msg}) => (
                    <MessageBubble direction={msg.direction}>
                        <View style={{alignItems: 'center', margin: 20}}>
                            <QRCode
                                value={useWallet.getState().agent.address}
                                size={200}
                            />
                        </View>
                    </MessageBubble>
                ),
            },
        ],

        shareAddress: () => {
            Share.share({message: useWallet.getState().agent.address})
            return [{text: 'Ok I have opened the sharing widget for you'}]
        },
    },
}

module.exports = (msg, botUtter) => {
    const [actionCategory, actionId] = msg.action.split('.'),
        handler = handlers[actionCategory][actionId]

    if (!handler)
        return console.warn(
            'Handler not found for returned action:',
            msg.action,
        )

    handler().forEach(botUtter)
}
