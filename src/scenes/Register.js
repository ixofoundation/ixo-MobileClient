const
    React = require('react'),
    {useContext, useCallback} = React,
    {View} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useWallet} = require('$/stores'),
    {Heading, Button, Text, Code} = require('$/lib/ui')


const Register = () => {
    const
        ws /*wallet store*/ = useWallet(),
        {stateNavigator: nav} = useContext(NavigationContext)

    const register = useCallback(async () => {
        try {
            await ws.register()
            alert('Registration complete!')
            nav.navigate('projects')
        } catch (e) {
            alert(
                'Could not register, please try again! '
                + 'If the error persists, consider creating a new ID.',
            )
        }
    })

    const createNewId = useCallback(() => {
        nav.navigate('createId')
        ws.reset()
    })

    if (!ws.secp)
        return null

    return <View>
        <Heading children='Register' />

        <Text>You have already generated an identity:</Text>
        <Code>did:ixo:{ws.agent.did}</Code>
        <Text>Would you like to register now?</Text>

        <Button onPress={register} text='Sure' />
        <Button onPress={createNewId} text='No, create a new id' />
    </View>
}


module.exports = Register
