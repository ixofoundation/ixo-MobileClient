const React = require('react'),
    {View, Image, Alert, Linking, StyleSheet, Text} = require('react-native'),
    {noop} = require('lodash-es'),
    {Button, Icon} = require('$/lib/ui'),
    theme = require('$/theme'),
    {getProjectLatestClaimDateText, fixImageUrl} = require('./util')

const ProjectActions = ({
    project,
    onClose = noop,
    onDisconnect = noop,
    onNavigate = noop,
}) => (
    <>
        <View style={style.root}>
            <View style={style.container}>
                <View style={style.header}>
                    <Image
                        source={{uri: fixImageUrl(project.data.image)}}
                        style={style.image}
                    />

                    <View style={style.nameContainer}>
                        <Text children={project.data.name} style={style.name} />
                        <Text
                            style={style.lastClaim}
                            children={getProjectLatestClaimDateText(project)}
                        />
                    </View>
                </View>
                <ProjectActionButton
                    text="View Claim Forms"
                    icon={<Icon name="menu" fill="white" />}
                    onPress={() =>
                        onNavigate('claim-forms', {
                            projectDid: project.projectDid,
                        })
                    }
                />
                <ProjectActionButton
                    text="Disconnect from this Project"
                    icon={<Icon name="linkOff" fill="white" />}
                    onPress={() => {
                        Alert.alert('You sure?', '', [
                            {
                                text: 'Yes, disconnect',
                                onPress: onDisconnect,
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                        ])
                    }}
                />
                {/*<ProjectActionButton
            text='Turn off Project Notifications'
            icon={<Icon name='bellOff' fill='white'/>}
        />*/}
                <ProjectActionButton
                    text="View the Project Page"
                    icon={<Icon name="web" fill="white" />}
                    onPress={() => Linking.openURL(getProjectURL(project))}
                />
                <Button
                    text="Close"
                    type="contained"
                    size="lg"
                    color="secondary"
                    style={style.closeBtn}
                    onPress={onClose}
                />
            </View>
        </View>
    </>
)

const style = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column-reverse',
        backgroundColor: 'rgba(0, 34, 51, 0.9)',
    },
    container: {
        backgroundColor: theme.colors.primary.darkBlue,
    },
    header: {
        marginBottom: theme.spacing(3),
    },
    image: {
        width: '100%',
        height: 180,
        marginBottom: theme.spacing(2),
    },
    name: {
        fontWeight: '500',
        color: 'white',
        fontSize: theme.fontSizes.h2,
        marginBottom: theme.spacing(2) - 3,
    },
    nameContainer: {
        paddingHorizontal: theme.spacing(1),
    },
    lastClaim: {
        fontSize: theme.fontSizes.smallBody,
        color: theme.colors.primary.lightBlue,
        fontWeight: '400',
    },
    closeBtn: {
        borderRadius: 0,
        alignItems: 'center',
        marginVertical: theme.spacing(3),
    },
})

const ProjectActionButton = ({icon, text, onPress}) => {
    return (
        <Button
            text={text}
            size="lg"
            color="secondary"
            style={actionButtonStyles.root}
            prefix={icon}
            onPress={onPress}
        />
    )
}

const actionButtonStyles = StyleSheet.create({
    root: {
        marginBottom: theme.spacing(1),
    },
})

const getProjectURL = (id) =>
    `https://app_uat.ixo.world/projects/${id}/overview`

module.exports = ProjectActions
