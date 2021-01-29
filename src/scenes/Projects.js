const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {View, Modal} = require('react-native'),
    ixo = require('$/ixoClient'),
    {Heading, Text, Button, QRScanner} = require('$/lib/ui')


const Projects = () => {
    const [scannerShown, toggleScanner] = useState(false)

    return <View>
        <Heading children='Projects' />

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
                    const
                        did = url.parse(data).path.split('/')[2],
                        project = await ixo.sync.getProject(did)

                    toggleScanner(false)

                    console.log('scan successful', did, project)
                }}
            />
        </Modal>
    </View>
}


module.exports = Projects
