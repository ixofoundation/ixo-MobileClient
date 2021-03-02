const
    React = require('react'),
    {useState, useCallback} = React,
    {View, Text, Modal} = require('react-native'),
    Button = require('./Button'),
    QRScanner = require('./QRScanner')


const QRCodeInput = ({value, onChange}) => {
    const
        [camShown, toggleCam] = useState(false),

        handleScan = useCallback(scanResp => {
            onChange(scanResp.data)
            toggleCam(false)
        })

    return <View>
        {value && <Text children={value} />}

        <Button
            type='contained'
            text='Scan'
            onPress={() => toggleCam(true)}
        />

        <Modal
            visible={camShown}
            onRequestClose={() => toggleCam(false)}
        >
            <QRScanner onScan={handleScan} />
        </Modal>
    </View>
}


module.exports = QRCodeInput
