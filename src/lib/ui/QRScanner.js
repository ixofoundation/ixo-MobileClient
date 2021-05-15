const
    React = require('react'),
    {View, Text, Pressable} = require('react-native'),
    {RNCamera} = require('react-native-camera'),
    {noop} = require('lodash-es')


const QRScanner = ({onScan, onClose = noop, text, style: overrideStyles}) =>
    <RNCamera
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onScan}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
        style={{...style, ...overrideStyles}}
    >
        <View style={labelStyle}>
            <Pressable
                children={<Text style={backTextStyle} children='Back' />}
                onPress={onClose}
            />
            <Text style={textStyle} children={text} />
        </View>
    </RNCamera>

const
    style = {height: '100%'},

    labelStyle = {
        backgroundColor: '#012D42',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },

    backTextStyle = {
        color: 'white',
        textDecorationLine: 'underline',
    },

    textStyle = {
        color: 'white',
        flexGrow: 1,
        textAlign: 'center',
        fontSize: 20,
    }


module.exports = QRScanner
