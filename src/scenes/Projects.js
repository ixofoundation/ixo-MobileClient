const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {View, Text, Modal} = require('react-native'),
    ixo = require('$/ixoClient'),
    {Button, QRScanner} = require('$/lib/ui')


module.exports = () => {
    const [scannerShown, toggleScanner] = useState(false)

    return <View>
        <Text>Projects</Text>

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
