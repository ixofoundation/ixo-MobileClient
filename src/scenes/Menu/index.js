const
    React = require('react'),
    {useContext, useState} = React,
    {View, Text, Pressable} = require('react-native'),
    {useWallet} = require('$/stores'),
    {Button, Icon, ToggleView} = require('$/lib/ui'),
    {NavigationContext} = require('navigation-react'),
    MenuItem = require('./MenuItem'),
    SubMenuItem = require('./SubMenuItem'),
    {spacing, fontSizes} = require('$/theme')


const Menu = () => {
    const
        ws = useWallet(),
        {stateNavigator: nav} = useContext(NavigationContext)

    if (!ws.secp)
        return null
    
    const [activeItems, setActiveItems] = useState([])
    const handleMenuItemClick = (index) => 
        setActiveItems(activeItems[0] === index ? [] : [index])

    return <View style={style.root}>
        <View style={style.container}>
            <Pressable>
                <Icon name='close' fill='white'/>
            </Pressable>
            <View style={style.header}>
                <Text 
                    children='Shaun' 
                    style={style.username}
                />
                <Text
                    children={'did:ixo:' + ws.agent.did}
                    style={style.did}
                />
            </View>

            <ToggleView 
                opened={activeItems} 
                onItemClick={handleMenuItemClick}
            >
                <MenuItem
                    title='My Claims'
                    icon={<Icon name='claim' width={24} fill='white'/>}
                    to=''
                />
                    
                <MenuItem 
                    icon={<Icon name='wallet' width={24} fill='white'/>}
                    title='My Account'
                >
                    <SubMenuItem title='Wallet' to=''/>
                    <SubMenuItem title='Portfolio' to=''/>
                    <SubMenuItem title='Staking' to=''/>
                </MenuItem>

                <MenuItem 
                    icon={<Icon name='explore' width={24} fill='white'/>}
                    title='Explorer'
                >
                    <SubMenuItem title='Cells' to=''/>
                    <SubMenuItem title='Projects' to=''/>
                    <SubMenuItem title='Invesments' to=''/>
                    <SubMenuItem title='Oracles' to=''/>
                    <SubMenuItem title='Templates' to=''/>
                </MenuItem>

                <MenuItem 
                    icon={<Icon name='accountCircleOutline' fill='white'/>}
                    title='My Data'
                >
                    <SubMenuItem title='Profile'/>
                    <SubMenuItem title='Badges'/>
                </MenuItem>

                <MenuItem 
                    title='Settings'
                    icon={<Icon name='gear' width={24} fill='white'/>}
                    to=''
                />

                <MenuItem 
                    title='Help'
                    icon={<Icon name='helpCircleOutline' fill='white'/>}
                    to=''
                />
            </ToggleView>
        </View>

        <Button
            text='Log out'
            color='secondary'
            size='lg'
            onPress={() => {
                nav.navigate('createId')
                ws.reset()
            }}
        />
    </View>
}

const style = {
    root: {
        flexGrow: 1, 
        backgroundColor: '#01273A', 
        justifyContent: 'space-between',
        paddingVertical: spacing(4), 
    },
    container: {
        paddingLeft: spacing(2), 
    },
    header: {marginVertical: spacing(2)},
    username: {
        color: 'white', 
        fontSize: fontSizes.h4,
        marginBottom: spacing(1),
    },
    did:{
        color: '#5A879D',
    },
}

module.exports = Menu
