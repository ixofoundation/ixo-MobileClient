const
    React = require('react'),
    {useContext} = React,
    {View} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useId} = require('$/stores'),
    {Text, Link, Button} = require('$/lib/ui')


const Menu = () => {
    const
        {id, clear: clearId} = useId(),
        {stateNavigator: nav} = useContext(NavigationContext)

    if (!id)
        return null

    return <>
        <View style={{flexGrow: 1}}>
            <Text
                size='sm'
                children={'did:ixo:' + id.didDoc.did}
                style={{
                    paddingVertical: 20,
                    backgroundColor: '#aaa',
                }}
            />

            <Link
                to='projects'
                children='Projects'
            />
        </View>

        <Button
            text='Log out'
            onPress={() => {
                nav.navigate('createId')
                clearId()
            }}
        />
    </>
}


module.exports = Menu
