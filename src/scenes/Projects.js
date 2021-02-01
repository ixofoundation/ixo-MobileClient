const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {TouchableOpacity, Modal, ScrollView, View, Image, Alert, Linking}
        = require('react-native'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/assistant/AssistantLayout'),
    ixo = require('$/ixoClient'),
    {useProjects} = require('$/stores'),
    {Heading, Text, Button, QRScanner} = require('$/lib/ui'),
    {entries} = Object


const Projects = () => {
    const
        ps = useProjects(),
        [scannerShown, toggleScanner] = useState(false),
        [focusedProjDid, setFocusedProj] = useState(),
        focusedProj = ps.items[focusedProjDid] || {data: {}}

    return <MenuLayout><AssistantLayout>
        <Heading children='Projects' />

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

                    const
                        projDid = url.parse(data).path.split('/')[2],
                        {body: projRec} = await ixo.sync.getProject(projDid)

                    if (ps.items[projDid])
                        return alert('Project already exists!')

                    ps.add(projDid, projRec)
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
                                ps.rm(focusedProjDid)
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
    </AssistantLayout></MenuLayout>
}

const Project = ({name, logoUrl, imageUrl}) =>
    <View style={style.proj.root}>
        <Image
            source={{uri: dashedHostname(imageUrl)}}
            style={style.proj.coverImg}
        />

        <View style={style.proj.title.root}>
            <Text children={name} style={style.proj.title.heading} />

            <Image
                source={{uri: dashedHostname(logoUrl)}}
                style={style.proj.title.logoImg}
            />
        </View>
    </View>

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

const style = {
    proj: {
        root: {
            backgroundColor: '#ccc',
            margin: 5,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#777',
        },

        coverImg: {width: '100%', height: 150},

        title: {
            root: {
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },

            heading: {flex: 1, fontWeight: 'bold'},

            logoImg: {flex: 0, width: 40, height: 40},
        },
    },
}

module.exports = Projects
