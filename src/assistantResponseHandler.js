const
    React = require('react'),
    {View, Share} = require('react-native'),
    QRCode = require('react-native-qrcode-svg').default,
    {useId} = require('$/stores')


const handlers = {
    credit: {
        showAddressText: () => [{text:  useId.getState().id.address}],

        showAddressQRCode: () => [
            {text: 'See below'},

            {component: <View style={{alignItems: 'center', margin: 20}}>
                <QRCode value={useId.getState().id.address} size={200} />
            </View>},
        ],

        shareAddress: () => {
            Share.share({
                message:
                    'I need some uixo tokens sent to '
                        + useId.getState().id.address
                        + '. Care to help?',
            })

            return [{text: 'Ok I\'ve opened the sharing widget for you'}]
        },
    },
}

module.exports = (msg, botUtter) => {
    const
        [actionCategory, actionId] = msg.action.split('.'),
        handler = handlers[actionCategory][actionId]

    if (!handler)
        return console.warn(
            'Handler not found for returned action:', msg.action)

    handler().forEach(botUtter)
}
