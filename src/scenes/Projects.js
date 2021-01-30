const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {Modal} = require('react-native'),
    MenuLayout = require('$/MenuLayout'),
    ixo = require('$/ixoClient'),
    {Heading, Button, QRScanner} = require('$/lib/ui')


const Projects = () => {
    const [scannerShown, toggleScanner] = useState(false)

    return <MenuLayout>
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
    </MenuLayout>
}


module.exports = Projects
