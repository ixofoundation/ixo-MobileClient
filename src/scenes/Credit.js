const
    React = require('react'),
    {useContext} = React,
    {View, Text} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    QRCode = require('react-native-qrcode-svg').default,
    {useId} = require('$/stores'),
    {Button} = require('$/lib/ui')


module.exports = () => {
    const
        {id, set: setId} = useId(),

        {
            stateNavigator: nav,
            data: {uixoBalance, address},
        }
            = useContext(NavigationContext)

    return <View>
        <Text>You need to credit your account</Text>
        <Text>Your uixo balance: {uixoBalance}</Text>
        <Text>Go beg for uixo tokens from somebody</Text>
        <Text>Here's your wallet address in plain text and QR code</Text>
        <Text>{address}</Text>
        <QRCode value={address} />
        <Button
            text={'Done, let\'s proceed!'}
            onPress={() => nav.navigate('register')}
        />
        <Button
            onPress={() => {
                setId({id: null})
                nav.navigate('createId')
            }}
            text='No, remove this id and start over'
        />
    </View>
}
