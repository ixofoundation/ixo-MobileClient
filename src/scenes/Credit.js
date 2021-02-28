const
    React = require('react'),
    {useContext} = React,
    {NavigationContext} = require('navigation-react'),
    {Heading, Text, Button} = require('$/lib/ui'),
    AssistantLayout = require('$/AssistantLayout')


const Credit = () => {
    const {stateNavigator: nav} = useContext(NavigationContext)

    return <AssistantLayout
        initMsg='I want to credit my account'
        autoOpen={true}
    >
        <Heading children='Credit your account' />

        <Text>
            If you are done crediting your account, please continue to
            registration.
        </Text>

        <Button
            text='Proceed to registration'
            onPress={() => nav.navigate('register')}
        />
    </AssistantLayout>
}


module.exports = Credit
