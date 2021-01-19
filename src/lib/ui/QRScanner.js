const
    React = require('react'),
    {Text} = require('react-native'),
    {RNCamera} = require('react-native-camera')


module.exports = ({onScan, text}) =>
    <RNCamera
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onScan}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
    >
        <Text>{text}</Text>
    </RNCamera>
