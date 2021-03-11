const React = require('react'),
    {useContext} = React,
    {View, Text, StyleSheet, Image} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Button = require('$/lib/ui/Button'),
    {spacing, fontSizes} = require('$/theme'),
    {NavigationContext} = require('navigation-react')
    
const ClaimActions = ({onClose}) => {
    const {stateNavigator: nav} = useContext(NavigationContext)
    const logoUri = 'https://pds_pandora.ixo.world/public/bojrn1k1wokkxjlgzl'
    return <>
        <View 
            style={style.root}
        >
            <View style={style.content}/>
            <View 
                style={style.titleContainer}
            >
                <View>
                    <Text style={style.title}>
                    Claim Project Name
                    </Text>
                    <Text style={style.lastClaimDate}>
                    Your last claim submitted on 05-05-18
                    </Text>
                </View>
                <Image
                    source={{
                        uri: logoUri,
                    }}
                    style={style.logo}
                />
            </View>
            <View>
                <ActionButton 
                    icon={<Icon name='web' fill='white'/>}
                    text='Remove from My Claim Forms list'
                />
                <ActionButton 
                    onPress={() => {
                        nav.navigate('claimActivity')
                        onClose()
                    }}
                    icon={<Icon name='web' fill='white'/>}
                    text='Claim Activity'
                />
                <ActionButton 
                    icon={<Icon name='web' fill='white'/>}
                    text='Archive Claim Form'
                />
                <ActionButton 
                    icon={<Icon name='web' fill='white'/>}
                    text='Turn on Claim Notifications'
                />
                <ActionButton 
                    icon={<Icon name='web' fill='white'/>}
                    text='View Claim Form Template'
                />
            </View>
        </View>
        <Button 
            text='Close' 
            type='contained'
            size='lg' 
            color='secondary' 
            style={style.closeBtn}
            onPress={onClose}
        />
    </>
}

const ActionButton = ({icon, text, onPress}) => {
    return <Button 
        text={text} 
        size='lg'
        color='secondary'
        style={style.actionBtn}
        prefix={icon}
        onPress={onPress}
    />
}

const style = StyleSheet.create({
    actionBtn: {marginBottom: spacing(1)},
    closeBtn: {alignItems: 'center', borderRadius: 0, paddingLeft: 0},
    logo: {
        flex: 0, 
        width: 40, 
        height: 40,
    },
    lastClaimDate: {color: '#83D9F2', fontSize: fontSizes.p1},
    title: {color: 'white', fontSize: fontSizes.h5, fontWeight: 'bold'},
    titleContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginLeft: spacing(1.5),
        marginBottom: spacing(2),
    },
    content: {flex: 1},
    root: {
        flex: 1,
        backgroundColor: 'rgba(0, 34, 51, 0.9)',
        justifyContent: 'center',
        padding: spacing(3),
    },
})

module.exports = ClaimActions