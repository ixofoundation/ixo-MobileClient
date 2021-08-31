const React = require('react'),
    {View, Share, Alert, Text, Pressable} = require('react-native'),
    QRCode = require('react-native-qrcode-svg').default,
    {getWallet} = require('$/wallet'),
    Clipboard = require('@react-native-clipboard/clipboard').default,
    MessageBubble = require('./MessageBubble'),
    MessageText = require('./MessageText')

const handlers = {
    credit: {
        showAddressText: async () => {
            const address = await getWalletAddress('agent')

            return [
                {
                    component: ({msg}) => (
                        <MessageBubble
                            direction={msg.direction}
                            onPress={() => {
                                Clipboard.setString(address)
                                Alert.alert('Address copied to clipboard!')
                            }}
                        >
                            <MessageText
                                text={address}
                                direction={msg.direction}
                            />
                        </MessageBubble>
                    ),
                },
            ]
        },

        showAddressQRCode: async () => {
            const address = await getWalletAddress('agent')

            return [
                {text: 'See below'},

                {
                    component: ({msg}) => (
                        <MessageBubble direction={msg.direction}>
                            <View style={{alignItems: 'center', margin: 20}}>
                                <QRCode
                                    value={address}
                                    size={200}
                                />
                            </View>
                        </MessageBubble>
                    ),
                },
            ]
        },

        shareAddress: async () => {
            Share.share({message: (await getWalletAddress('agent'))})
            return [{text: 'Ok I have opened the sharing widget for you'}]
        },
    },
}

const getWalletAddress = walletType =>
    getWallet()[walletType].getAccounts().then(as => as[0].address)


module.exports = async (msg, botUtter) => {
    const [actionCategory, actionId] = msg.action.split('.'),
        handler = handlers[actionCategory][actionId]

    if (!handler)
        return console.warn(
            'Handler not found for returned action:',
            msg.action,
        )

    const utterances = await handler()

    utterances.forEach(botUtter)
}
