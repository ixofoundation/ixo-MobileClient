const React = require('react'),
    {useState, useContext, useCallback, useEffect, createElement} = React,
    {
        View,
        Image,
        Platform,
        Dimensions,
        TouchableOpacity,
        SafeAreaView,
    } = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {randomBytes} = require('react-native-randombytes'),
    Swiper = require('react-native-swiper').default,
    Video = require('react-native-video').default,
    cryptoJS = require('crypto-js'),
    {shuffle, pull, isEqual} = require('lodash-es'),
    {entropyToMnemonic} = require('bip39'),
    {makeWallet} = require('@ixo/client-sdk'),
    {getWallet, setWallet} = require('$/wallet'),
    {setClient} = require('$/ixoCli'),
    {initForExistingWallet} = require('$/init'),
    {sleep} = require('$/lib/util'),
    {
        Modal,
        Text,
        Button,
        Heading,
        ButtonGroup,
        QRScanner,
        TextInput,
        Code,
        Alert,
    } = require('$/lib/ui'),
    logo = require('./logo.png'),
    makeAnImpact = require('./ixoOnboarding1.mp4'),
    globe = require('./globe.mp4')

const IdCreation = () => {
    const [currentSubscene, setSubscene] = useState(),
        wallet = getWallet(),
        [idGenerating, setIdGenerating] = useState(false),
        {stateNavigator: nav} = useContext(NavigationContext)
    return (
        <SafeAreaView style={{flex: 1}}>
            {!wallet ? (
                <Foo>
                    <Button
                        type="outlined"
                        text="Recover wallet with backup phrase"
                        onPress={() => setSubscene('pasteMnemonic')}
                        style={{marginBottom: 10}}
                    />

                    <Button
                        type="contained"
                        text="Create new wallet"
                        onPress={() => setSubscene('createID')}
                    />

                    <TouchableOpacity onPress={() => setSubscene('scanQR')}>
                        <Text
                            style={ConnectIXOStyles.recover}
                            children="Import wallet from ixo KeySafe"
                        />
                    </TouchableOpacity>

                    <Modal
                        visible={!!currentSubscene}
                        onRequestClose={() => setSubscene(null)}
                    >
                        <View
                            style={{
                                backgroundColor: '#002B3F',
                                justifyContent: 'center',
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            {idGenerating && (
                                <Alert children="Your id is being generated. Please wait." />
                            )}

                            {currentSubscene &&
                                !idGenerating &&
                                createElement(subScenes[currentSubscene], {
                                    onReturn: async (mnemonic) => {
                                        setIdGenerating(true)
                                        await sleep(0) // See [0]
                                        const wallet = await setWallet(await makeWallet(mnemonic))
                                        setClient(wallet)
                                        setSubscene(null)
                                        setIdGenerating(false)
                                    },
                                    onBack: () => {
                                        setSubscene(null)
                                    },
                                })}
                        </View>
                    </Modal>
                </Foo>
            ) : (
                <View
                    style={{
                        backgroundColor: '#002B3F',
                        justifyContent: 'center',
                        flex: 1,
                        padding: 20,
                    }}
                >
                    <Alert children="Your id is created and saved successfully:" />

                    <Code>{wallet.agent.did}</Code>

                    <Button
                        type="contained"
                        text="Proceed"
                        onPress={() => initForExistingWallet(nav, wallet)}
                    />
                </View>
            )}
        </SafeAreaView>
    )
}

const Foo = ({children}) => (
    <Swiper
        loop={false}
        activeDotColor={ThemeColors.blue_medium}
        dotColor={ThemeColors.blue_light}
        showsButtons={false}
        activeDotStyle={OnBoardingStyles.dotStyle}
        dotStyle={OnBoardingStyles.dotStyle}
        style={{
            backgroundColor: '#002B3F',
        }}
    >
        <View style={OnBoardingStyles.onboardingContainer} key={0}>
            <View style={OnBoardingStyles.logoContainer}>
                <Image
                    resizeMode="contain"
                    style={OnBoardingStyles.logo}
                    source={logo}
                />
            </View>

            <Video
                resizeMode="contain"
                source={makeAnImpact}
                muted={true}
                playWhenInactive={false}
                playInBackground={true}
                style={OnBoardingStyles.videoStyle}
            />

            <View>
                <View>
                    <Text style={OnBoardingStyles.onboardingHeading}>
                        Make Your Impact
                    </Text>
                </View>

                <View>
                    <Text style={OnBoardingStyles.onboardingParagraph}>
                        Submit claims of what you have done
                    </Text>
                </View>
            </View>
        </View>

        <View style={OnBoardingStyles.onboardingContainer} key={1}>
            <View style={OnBoardingStyles.logoContainer}>
                <Image
                    resizeMode="contain"
                    style={OnBoardingStyles.logo}
                    source={logo}
                />
            </View>

            <Video
                resizeMode="contain"
                source={makeAnImpact}
                muted={true}
                playWhenInactive={false}
                playInBackground={true}
                style={OnBoardingStyles.videoStyle}
            />

            <View>
                <View>
                    <Text style={OnBoardingStyles.onboardingHeading}>
                        No connection?
                    </Text>
                </View>

                <View>
                    <Text style={OnBoardingStyles.onboardingParagraph}>
                        Save your claims and submit them later
                    </Text>
                </View>
            </View>
        </View>

        <View style={ConnectIXOStyles.loginWrapper}>
            <Video
                source={globe}
                rate={1.0}
                volume={1.0}
                muted={false}
                resizeMode={'cover'}
                repeat
                style={ConnectIXOStyles.globeView}
            />

            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        resizeMode="contain"
                        style={ConnectIXOStyles.logo}
                        source={logo}
                    />
                </View>

                <View style={{width: '100%'}}>{children}</View>
            </View>
        </View>
    </Swiper>
)

const windowDimensions = Dimensions.get('window')
const videoBackgroundColor = Platform.OS === 'ios' ? '#003047' : '#053347'

const ThemeColors = {
    blue_dark: '#002233',
    blue: '#002C41',
    blue_medium: '#00D2FF',
    blue_light: '#025F79',
    blue_lightest: '#83D9F2',
    blue_border: '#0D5068',
    blue_white: '#B4EEFF',
    white: '#FFF',
    black: '#000',
    grey: '#989898',
    grey_light: '#DBDBDB',
    grey_sync: '#e0e0e0',
    red: '#A11C43',
    orange: '#F89D28',
    green: '#5AB946',
    success_green: '#3F7E44',
    failed_red: '#A11C43',
    progressRed: '#E2223B',
    progressNotCounted: '#033C50',
    modalBackground: '#012639',
}

const OnBoardingStyles = {
    wrapper: {
        flex: 1,
        backgroundColor: videoBackgroundColor,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: windowDimensions.width * 0.9,
        height: windowDimensions.height * 0.1,
        backgroundColor: 'transparent',
    },
    textBox: {
        paddingBottom: 33,
        paddingLeft: 60,
        paddingRight: 60,
    },
    textBoxButtonContainer: {
        flex: 1.5,
        alignItems: 'center',
        flexDirection: 'column',
    },
    buttons: {
        justifyContent: 'center',
        width: windowDimensions.width * 0.8,
    },
    dotStyle: {
        width: windowDimensions.width * 0.03,
        height: windowDimensions.width * 0.03,
        borderRadius: 10,
    },
    videoStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.5,
    },
    onboardingContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    logoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 0.2,
    },
    onboardingHeading: {
        textAlign: 'center',
        color: ThemeColors.blue_lightest,
        paddingBottom: 10,
        fontSize: 28,
    },
    onboardingParagraph: {
        textAlign: 'center',
        color: ThemeColors.white,
        paddingBottom: 10,
        fontSize: 18,
    },
}

const ConnectIXOStyles = {
    wrapper: {
        flex: 1,
        backgroundColor: ThemeColors.blue_dark,
    },
    globeView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    loginWrapper: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: windowDimensions.width * 0.9,
        height: windowDimensions.height * 0.1,
        backgroundColor: 'transparent',
    },
    buttons: {
        width: '100%',
        justifyContent: 'center',
    },
    infoBlock: {
        justifyContent: 'center',
        height: windowDimensions.height * 0.1,
    },
    infoBlockImage: {
        width: windowDimensions.width * 0.08,
        height: windowDimensions.width * 0.08,
    },
    recover: {
        marginVertical: windowDimensions.height * 0.04,
        color: ThemeColors.blue_lightest,
        fontSize: 12,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
}

const subScenes = {
    scanQR: ({onReturn, onBack}) => {
        const [scanCompleted, setScanCompleted] = useState(false),
            [encryptedUserData, setEncryptedUserData] = useState(),
            [pwd, setPwd] = useState('')

        return !scanCompleted ? (
            <Modal visible={true}>
                <QRScanner
                    onScan={({data}) => {
                        setEncryptedUserData(data)
                        setScanCompleted(true)
                    }}
                    onClose={onBack}
                    footer={false}
                    text="Please scan QR code"
                />
            </Modal>
        ) : (
            <>
                <Heading children="Unlock KeySafe" />

                <TextInput
                    placeholder="Enter KeySafe password"
                    secureTextEntry={true}
                    onChange={setPwd}
                />

                <Button
                    type="contained"
                    onPress={() => {
                        const {mnemonic} = decryptAES(encryptedUserData, pwd)
                        onReturn(mnemonic)
                        setScanCompleted(false)
                        setEncryptedUserData(null)
                    }}
                    text="Import"
                    style={{margin: 5}}
                />
            </>
        )
    },

    pasteMnemonic: ({onReturn}) => {
        const [text, setText] = useState('')

        return (
            <>
                <Heading children="Recover Wallet" />

                <TextInput
                    multiline
                    numberOfLines={3}
                    placeholder="Enter backup phrase"
                    onChangeText={setText}
                />

                <Button
                    type="contained"
                    onPress={() => onReturn(text)}
                    text="Done"
                    style={{margin: 5}}
                />
            </>
        )
    },

    createID: ({onReturn}) => {
        const [mmChosen, setMmChosen] = useState(false),
            [mm, setMm] = useState([]),
            [shuffledMm, setShuffledMm] = useState([]),
            [reconstructedMm, setReconstructedMm] = useState([]),
            generateMnemonic = useCallback(() =>
                setMm(entropyToMnemonic(randomBytes(16)).split(' ')),
            )

        useEffect(generateMnemonic, [])

        return !mmChosen ? (
            <>
                <Heading children="Create wallet" />

                <Text
                    style={{
                        color: 'white',
                        paddingBottom: 20,
                    }}
                >
                    Your backup phrase is below. Please save it somewhere before
                    proceeding. We will ask you for it in the next step.
                </Text>

                <Code children={mm.slice(0, 4).join(' ')} />
                <Code children={mm.slice(4, 8).join(' ')} />
                <Code children={mm.slice(8, 12).join(' ')} />

                <Button
                    type="contained"
                    onPress={() => {
                        setMmChosen(true)
                        setShuffledMm(shuffle(mm))
                    }}
                    text="Proceed"
                    style={{marginTop: 20}}
                />
            </>
        ) : (
            <>
                <Heading children="Create wallet" />

                <Text
                    style={{
                        color: 'white',
                        paddingBottom: 20,
                    }}
                >
                    Prove that you saved your mnemonic, select the mnemonic
                    words with the right order:
                </Text>

                <ButtonGroup
                    items={shuffledMm.map((word) => ({
                        text: word,
                        onPress: () => {
                            const nextReconstructedMm = [
                                ...reconstructedMm,
                                word,
                            ]

                            setShuffledMm(pull(shuffledMm, word))
                            setReconstructedMm(nextReconstructedMm)

                            if (shuffledMm.length > 0) return

                            if (isEqual(nextReconstructedMm, mm))
                                onReturn(mm.join(' '))
                            else {
                                setShuffledMm(shuffle(mm))
                                setReconstructedMm([])
                            }
                        },
                        style: {
                            flexGrow: 1,
                            textAlign: 'center',
                            margin: 8,
                        },
                    }))}
                    type="contained"
                    style={{marginBottom: 20}}
                />

                <Code children={reconstructedMm.slice(0, 4).join(' ')} />
                <Code children={reconstructedMm.slice(4, 8).join(' ')} />
                <Code children={reconstructedMm.slice(8, 12).join(' ')} />

                <Button
                    type="contained"
                    text="Retry"
                    onPress={() => {
                        setShuffledMm(shuffle(mm))
                        setReconstructedMm([])
                    }}
                    style={{marginTop: 20}}
                />
            </>
        )
    },
}

const decryptAES = (text, pwd) => {
    const bytes = cryptoJS.AES.decrypt(text, pwd),
        contentsHex = bytes.toString(cryptoJS.enc.Utf8),
        payloadJson = Buffer.from(contentsHex, 'hex').toString('utf8')

    return JSON.parse(payloadJson)
}

module.exports = IdCreation

// [0]: Delaying the following code until the next tick as we first want to see
//      the effects of "setIdGenerating". Although "setIdGenerating" returns
//      immediately, its carries out its job asynchronously, yet it doesn't
//      return a Promise so we resort to this hack. This problem originates from
//      Zustand. We may solve this issue with a Zustand middleware in the
//      future.
