const {fontSizes, spacing} = require('$/theme')
const React = require('react'),
    {View, Text, Pressable, StyleSheet, Dimensions} = require('react-native'),
    {RNCamera} = require('react-native-camera'),
    {noop} = require('lodash-es')
const Icon = require('./Icon')

const QRScanner = ({
    onScan,
    onClose = noop,
    text,
    style: overrideStyles,
    footer = true,
}) => {
    const styles = getStyles(footer)
    return (
        <>
            <RNCamera
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={onScan}
                flashMode={RNCamera.Constants.FlashMode.on}
                captureAudio={false}
                style={{...styles.root, ...overrideStyles}}
            >
                <View styles={styles.frameContainer}>
                    <View style={styles.frameTop} />
                    <View style={styles.midFrameContainer}>
                        <View style={styles.midFrame} />
                        <View style={styles.midFrame} />
                    </View>
                    <View style={styles.frameBottom} />
                </View>

                <View style={styles.titleContainer}>
                    <View style={styles.titleLayout}>
                        <Pressable
                            style={styles.closeIcon}
                            children={
                                <Icon
                                    name="arrowLeft"
                                    fill="white"
                                    width={30}
                                    height={30}
                                />
                            }
                            onPress={onClose}
                        />
                        {text && <Text style={styles.titleText}>{text}</Text>}
                        <View style={styles.titlePad} />
                    </View>
                </View>

                <View style={styles.overlay}>
                    <View style={styles.cornerContainer}>
                        <View
                            style={StyleSheet.compose(
                                styles.corner,
                                styles.topLeftCorner,
                            )}
                        />
                        <View
                            style={StyleSheet.compose(
                                styles.corner,
                                styles.topRightCorner,
                            )}
                        />
                    </View>
                    <View style={styles.cornerContainer}>
                        <View
                            style={StyleSheet.compose(
                                styles.corner,
                                styles.bottomLeftCorner,
                            )}
                        />
                        <View
                            style={StyleSheet.compose(
                                styles.corner,
                                styles.botomRightCorner,
                            )}
                        />
                    </View>
                </View>
            </RNCamera>
            {footer && (
                <View style={styles.footer}>
                    <Pressable
                        onPress={onClose}
                        children={<Icon name="assistant" fill="white" />}
                    />
                </View>
            )}
        </>
    )
}

const {width, height} = Dimensions.get('screen')
const overlayCenterSize = width * 0.5
const overlayBorderSize = 2

const footerHeight = spacing(2) + 42

const getStyles = (footer) =>
    StyleSheet.create({
        root: {flex: 1},
        footer: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing(1),
            backgroundColor: '#56CCF2',
        },
        titleText: {
            color: 'white',
            fontSize: fontSizes.h5,
        },
        titlePad: {width: 30},
        titleContainer: {
            position: 'absolute',
            width: '100%',
            height: 30,
            top: spacing(2),
            left: 0,
        },
        titleLayout: {
            paddingLeft: spacing(2),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        frameContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        frameTop: {
            backgroundColor: 'rgba(1,1,1,0.6)',
            height:
                (height - overlayCenterSize) / 2 - (footer ? footerHeight : 0),
            width: '100%',
        },
        frameBottom: {
            backgroundColor: 'rgba(1,1,1,0.6)',
            height:
                (height - overlayCenterSize) / 2 + (footer ? footerHeight : 0),
            width: '100%',
        },
        midFrameContainer: {
            height: overlayCenterSize,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        midFrame: {
            width: (width - overlayCenterSize) / 2,
            backgroundColor: 'rgba(1,1,1,0.6)',
            height: '100%',
        },
        cornerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        corner: {
            width: 70,
            height: 70,
            borderColor: 'white',
        },
        topLeftCorner: {
            borderLeftWidth: overlayBorderSize,
            borderTopWidth: overlayBorderSize,
        },
        topRightCorner: {
            borderRightWidth: overlayBorderSize,
            borderTopWidth: overlayBorderSize,
        },
        bottomLeftCorner: {
            borderLeftWidth: overlayBorderSize,
            borderBottomWidth: overlayBorderSize,
        },
        botomRightCorner: {
            borderRightWidth: overlayBorderSize,
            borderBottomWidth: overlayBorderSize,
        },
        overlay: {
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: overlayCenterSize + overlayBorderSize * 2,
            width: overlayCenterSize + overlayBorderSize * 2,
            top:
                (height - overlayCenterSize) / 2 -
                overlayBorderSize -
                (footer ? footerHeight : 0),
            left: (width - overlayCenterSize) / 2 - overlayBorderSize,
        },
    })

module.exports = QRScanner
