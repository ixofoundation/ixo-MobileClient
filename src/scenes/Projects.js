const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {Modal, ScrollView, View, Image, Alert} = require('react-native'),
    Swipeable = require('react-native-gesture-handler/Swipeable').default,
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/assistant/AssistantLayout'),
    ixo = require('$/ixoClient'),
    {useProjects} = require('$/stores'),
    {Heading, Text, Button, QRScanner} = require('$/lib/ui'),
    {entries} = Object


const Projects = () => {
    const
        ps = useProjects(),
        [scannerShown, toggleScanner] = useState(false)

    return <MenuLayout><AssistantLayout>
        <Heading children='Projects' />

        <ScrollView style={{flex: 1}}>
            {entries(ps.items).map(([projDid, proj]) =>
                <Project
                    key={projDid}
                    name={proj.data.name}
                    logoUrl={proj.data.logo}
                    imageUrl={proj.data.image}
                    onRemove={() => {
                        Alert.alert('You sure?', '', [{
                            text: 'Yes, delete',
                            onPress: () => ps.rm(projDid),
                        }, {
                            text: 'Cancel',
                            style: 'cancel',
                        }])
                    }}
                />)}
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
    </AssistantLayout></MenuLayout>
}

const Project = ({name, logoUrl, imageUrl, onRemove}) =>
    <Swipeable
        renderLeftActions={() => <Button text='Remove' onPress={onRemove} />}
        renderRightActions={() => <Button text='Remove' onPress={onRemove} />}
    >
        <View style={style.proj.root}>
            <Image source={{uri: proxyUri(logoUrl)}} style={style.proj.coverImg} />
            <Image source={{uri: proxyUri(imageUrl)}} style={style.proj.logoImg} />
            <Text children={name} />
        </View>
    </Swipeable>

const proxyUri = uri =>
    'http:/localhost:8084' + url.parse(uri).path

const style = {
    proj: {
        root: {
            backgroundColor: '#ccc',
            margin: 5,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'black',
        },
        coverImg: {width: '100%', height: 150},
        logoImg: {width: 50, height: 50},
    },
}

module.exports = Projects
