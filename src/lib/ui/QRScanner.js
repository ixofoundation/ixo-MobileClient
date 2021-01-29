const
    React = require('react'),
    {RNCamera} = require('react-native-camera'),
    Alert = require('./Alert')


const QRScanner = ({onScan, text, style: overrideStyles}) =>
    <RNCamera
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onScan}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
        style={{...style, ...overrideStyles}}
        children={<Alert children={text} style={alertStyle} />}
    />

const
    style = {height: '100%'},

    alertStyle = {
        borderRadius: 0,
        marginVertical: 0,
    }


module.exports = QRScanner
