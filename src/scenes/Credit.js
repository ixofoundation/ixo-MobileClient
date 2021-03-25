const
    React = require('react'),
    {useContext} = React,
    {View} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {Heading, Text, Button} = require('$/lib/ui'),
    AssistantLayout = require('$/AssistantLayout')


const Credit = () => {
    const {stateNavigator: nav} = useContext(NavigationContext)

    return <AssistantLayout
        initMsg='I want to credit my account'
        autoOpen={true}
    >
        <View style={{
            backgroundColor: '#002B3F',
            flex: 1,
            padding: 10,
        }}>
            <Heading children='Credit your account' />

            <Text style={{color: 'white'}}>
                If you are done crediting your account, please continue to
                registration.
            </Text>

            <Button
                type='contained'
                text='Proceed to registration'
                onPress={() => nav.navigate('register')}
                style={{marginTop: 20}}
            />
        </View>
    </AssistantLayout>
}


module.exports = Credit
