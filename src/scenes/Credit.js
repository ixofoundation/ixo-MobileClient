const
    React = require('react'),
    {useContext} = React,
    {NavigationContext} = require('navigation-react'),
    {Text, Button} = require('$/lib/ui'),
    AssistantLayout = require('$/assistant/AssistantLayout')


const Credit = () => {
    const {stateNavigator: nav} = useContext(NavigationContext)

    return <AssistantLayout
        initMsg='I want to credit my account'
    >
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
