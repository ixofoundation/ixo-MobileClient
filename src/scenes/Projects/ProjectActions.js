const
    React = require('react'),

    {View, Image, Alert, Linking, StyleSheet, Text}
        = require('react-native'),

    {noop} = require('lodash-es'),

    {Button} = require('$/lib/ui'),
    theme = require('$/theme'),


    WebIcon = require('$/lib/icons/web.svg').default,
    LinkOffIcon = require('$/lib/icons/linkOff.svg').default,
    BellOffIcon = require('$/lib/icons/bellOff.svg').default,
    MenuIcon = require('$/lib/icons/menu.svg').default

const ProjectDetail = ({project, onClose = noop, onDisconnect = noop}) => <>
    <View style={style.root}>
        <View style={style.header}>
            <Image
                source={{
                    uri: project.data.image && 
                                dashedHostname(project.data.image),
                }}
                style={style.image}
            />

            <Text children={project.data.name} 
                style={style.name} />
            <Text 
                style={style.lastClaim} 
                children={'Your last claim submitted on 05-05-18'}
            />
        </View>
        <ProjectActionButton
            text='View Claim Forms'
            icon={<MenuIcon fill='white'/>}
        />
        <ProjectActionButton
            text='Disconnect from this Project'
            icon={<LinkOffIcon fill='white'/>}
            onPress={() => {
                Alert.alert('You sure?', '', [{
                    text: 'Yes, delete',
                    onPress: onDisconnect,
                }, {
                    text: 'Cancel',
                    style: 'cancel',
                }])
            }}
        />
        <ProjectActionButton
            text='Turn off Project Notifications'
            icon={<BellOffIcon fill='white'/>}
        />
        <ProjectActionButton
            text='View the Project Page'
            icon={<WebIcon fill='white'/>}
            onPress={() => Linking.openURL(getProjectURL(project))}
        /> 
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

const style = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'rgba(0, 34, 51, 0.9)',
        justifyContent: 'center',
        padding: theme.spacing(3),
    },
    header: {
        padding: theme.spacing(1.5),
        marginBottom: theme.spacing(3),
    },
    image: {
        width: '100%', 
        height: 150, 
        marginBottom: theme.spacing(2),
    },
    name: {
        fontWeight: 'bold', 
        color: 'white', 
        fontSize: theme.fontSizes.h4,
        marginBottom: theme.spacing(1),
    },
    lastClaim: {
        fontSize: theme.fontSizes.p1, 
        color: '#83D9F2',
    },
    closeBtn: {
        borderRadius: 0, 
        alignItems: 'center',
    },
})

const ProjectActionButton = ({icon, text, onPress}) => {
    return <Button 
        text={text} 
        size='lg'
        color='secondary'
        style={actionButtonStyles.root}
        prefix={icon}
        onPress={onPress}
    />
}

const actionButtonStyles = StyleSheet.create({
    root: {
        marginBottom: theme.spacing(1),
    },
})

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

const getProjectURL = id => `https://app_uat.ixo.world/projects/${id}/overview`

module.exports = ProjectDetail
