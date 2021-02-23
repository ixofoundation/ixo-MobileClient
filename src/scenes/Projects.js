const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {TouchableOpacity, ScrollView, 
        View, Image, Alert, Linking, StyleSheet, Text}
        = require('react-native'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/assistant/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Modal, Button, QRScanner} = require('$/lib/ui'),
    theme = require('$/lib/theme'),
    {entries} = Object


const Projects = () => {
    const
        ps = useProjects(),
        [scannerShown, toggleScanner] = useState(false),
        [focusedProjDid, setFocusedProj] = useState(),
        focusedProj = ps.items[focusedProjDid] || {data: {}}

    return <MenuLayout><AssistantLayout>
        <View style={style.root}>
            <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between',
            }}>
                <Text>Menu</Text>
                <Text>Some appendix</Text>
            </View>
            <Text 
                style={{
                    color: 'white', 
                    fontSize: theme.fontSizes.h2,
                }} 
                children={'Projects'}/>

            <ScrollView style={{flex: 1}}>
                {entries(ps.items).map(([projDid, proj]) =>
                    <TouchableOpacity
                        key={projDid}
                        onPress={() =>  setFocusedProj(projDid)}
                    >
                        <Project
                            name={proj.data.name}
                            logoUrl={proj.data.logo}
                            imageUrl={proj.data.image}
                        />
                    </TouchableOpacity>,
                )}
            </ScrollView>

            <Button
                onPress={() => toggleScanner(true)}
                text='Connect to a project'
            />

            <Modal
                visible={scannerShown}
                onRequestClose={() => toggleScanner(false)}
            >
                <QRScanner
                    text='Scan project QR code'
                    onScan={async ({data}) => {
                        toggleScanner(false)

                        const projDid = url.parse(data).path.split('/')[2]

                        if (ps.items[projDid])
                            return alert('Project already exists!')

                        try {
                            await ps.connect(projDid)
                        } catch (e) {
                            alert('Couldn\'t connect to project, please try again later!') // eslint-disable-line max-len
                        }
                    }}
                />
            </Modal>

            <Modal
                visible={!!focusedProjDid}
                onRequestClose={() => setFocusedProj(null)}
                transparent
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    justifyContent: 'center',
                }}>
                    <Project
                        name={focusedProj.data.name}
                        logoUrl={focusedProj.data.logo}
                        imageUrl={focusedProj.data.image}
                    />
                    <Button
                        text='Disconnect from this Project'
                        onPress={() => {

                            Alert.alert('You sure?', '', [{
                                text: 'Yes, delete',
                                onPress: () => {
                                    ps.disconnect(focusedProjDid)
                                    setFocusedProj(null)
                                },
                            }, {
                                text: 'Cancel',
                                style: 'cancel',
                            }])
                        }}
                    />
                    <Button
                        text='View the Project Page'
                        onPress={() =>
                            Linking.openURL(
                                'https://app_uat.ixo.world/projects/'
                            + focusedProjDid
                            + '/overview',
                            )
                        }
                    />
                </View>
            </Modal>
        </View>
    </AssistantLayout></MenuLayout>
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#012D42',
        flex: 1,
        paddingHorizontal: theme.spacing(2),
    },
})


const Project = ({name, logoUrl, imageUrl}) =>
    <View style={projectStyle.root}>
        <Image
            source={{uri: dashedHostname(imageUrl)}}
            style={projectStyle.coverImg}
        />

        <View style={projectDetailStyle.root}>
            <Text children={name} style={projectDetailStyle.heading} />

            <Image
                source={{uri: dashedHostname(logoUrl)}}
                style={projectDetailStyle.logoImg}
            />
        </View>
    </View>

const projectStyle = StyleSheet.create({
    root: {
        backgroundColor: '#012639',
        margin: theme.spacing(1),
        alignItems: 'center',
    },

    coverImg: {width: '100%', height: 150},
})

const projectDetailStyle = StyleSheet.create({
    root: {
        paddingHorizontal: theme.spacing(2),
        paddingTop: theme.spacing(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#0E536B',
        borderWidth: 1,
        borderTopWidth: 0,
    },

    heading: {
        flex: 1, 
        fontWeight: 'bold', 
        color: 'white', 
        fontSize: theme.fontSizes.h4,
    },

    logoImg: {flex: 0, width: 40, height: 40},
})

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

module.exports = Projects
