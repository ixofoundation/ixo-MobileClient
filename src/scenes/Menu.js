const
    React = require('react'),
    {useContext} = React,
    {View} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useWallet} = require('$/stores'),
    {Text, Link, Button} = require('$/lib/ui')


const Menu = () => {
    const
        ws = useWallet(),
        {stateNavigator: nav} = useContext(NavigationContext)

    if (!ws.secp)
        return null

    return <>
        <View style={{flexGrow: 1}}>
            <Text
                size='sm'
                children={'did:ixo:' + ws.agent.did}
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
                ws.reset()
            }}
        />
    </>
}


module.exports = Menu
