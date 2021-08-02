const React = require('react'),
    {useContext, useCallback} = React,
    {View, Alert} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {getClient} = require('$/ixoCli'),
    {getWallet, setWallet} = require('$/wallet'),
    AssistantLayout = require('$/AssistantLayout'),
    {Heading, Button, Text, Code} = require('$/lib/ui')

const Register = () => {
    const
        wallet = getWallet(),
        {stateNavigator: nav} = useContext(NavigationContext)

    const register = useCallback(async () => {
        try {
            await getClient().register()
            alert('Registration complete!')
            nav.navigate('projects')
        } catch (e) {
            console.error(e)

            Alert.alert(
                'Registration Error',
                "Could not register! You presumably have no tokens in your account so we're redirecting you to the crediting page", // eslint-disable-line max-len
                [{text: 'OK', onPress: () => nav.navigate('credit')}],
                {cancelable: false},
            )
        }
    })

    const createNewId = useCallback(() => {
        nav.navigate('createId')
        setWallet(null)
    })

    if (!wallet) return null

    return (
        <AssistantLayout>
            <View
                style={{
                    backgroundColor: '#002B3F',
                    flex: 1,
                    padding: 10,
                }}
            >
                <Heading children="Register" />

                <Text
                    style={{color: 'white', marginBottom: 20}}
                    children="You have already generated an identity:"
                />

                <Code style={{marginBottom: 20}}>{wallet.agent.did}</Code>

                <Text
                    style={{color: 'white', marginBottom: 20}}
                    children="Would you like to register now?"
                />

                <Button
                    type="contained"
                    onPress={register}
                    text="Sure"
                    style={{marginBottom: 10}}
                />

                <Button
                    type="outlined"
                    onPress={createNewId}
                    text="No, create a new id"
                />
            </View>
        </AssistantLayout>
    )
}

module.exports = Register
