const
    React = require('react'),
    {useContext} = React,
    {View, Text} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    ixo = require('$/ixoClient'),
    {useId} = require('$/stores'),
    {Button} = require('$/lib/ui')


module.exports = () => {
    const
        {id, set: setId} = useId(),
        {stateNavigator: nav} = useContext(NavigationContext)

    return <View>
        <Text>Registration</Text>
        <Text>You have already generated an identity:</Text>
        <Text>{JSON.stringify(id, null, 2)}</Text>
        <Text>Wanna register now?</Text>
        <Button
            onPress={async () => {
                try {
                    await ixo.sync.registerUser(id.didDoc) }
                catch (e) {
                    alert('Could not register, try again later!') }

                alert('Registration complete!')
                nav.navigate('projects')
            }}
            text='Yes please'
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
