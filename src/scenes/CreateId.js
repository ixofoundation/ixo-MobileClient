const
    React = require('react'),
    {useState, useContext, createElement} = React,
    {View, Modal} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {randomBytes} = require('react-native-randombytes'),
    cryptoJS = require('crypto-js'),
    {shuffle, pull, isEqual} = require('lodash-es'),
    {initForExistingId} = require('$/init'),
    {useId} = require('$/stores'),
    {Heading, Text, Button, ButtonGroup, QRScanner, TextInput, Code, Alert}
        = require('$/lib/ui'),
    {crypto: {
        generateMnemonic, deriveAddress, deriveECKeyPair, deriveDidDoc,
        deriveAgentAddress,
    }}
        = require('@ixo/client-sdk')


const IdCreation = () => {
    const
        [currentSubscene, setSubscene] = useState(),
        {id, set: setId} = useId(),
        [idGenerating, setIdGenerating] = useState(false),
        {stateNavigator: nav} = useContext(NavigationContext)

    return !id
        ? <View>
            <Heading children='Create / Import ID' />

            <Button
                text='Import by scanning Keysafe QR code'
                onPress={() => setSubscene('scanQR')}
            />
            <Button
                text='Import by pasting mnemonic'
                onPress={() => setSubscene('pasteMnemonic')}
            />
            <Button
                text='Create new ID'
                onPress={() => setSubscene('createID')}
            />

            <Modal
                visible={!!currentSubscene}
                onRequestClose={() => setSubscene(null)}
            >
                <Heading children='Create / Import ID' />

                {idGenerating
                    ? <Alert
                        children='Your id is being generated. Please wait.'/>

                    : null}

                {(currentSubscene && !idGenerating) &&
                    createElement(subScenes[currentSubscene], {
                        onReturn: async mnemonic => {
                            setIdGenerating(true)

                            setTimeout(() => {
                                const id = generateId(mnemonic)

                                try {
                                    setId({id})
                                    setSubscene(null)
                                    setIdGenerating(false)
                                } catch (e) {
                                    console.error(e)
                                }
                            }, 0)
                        },
                    })
                }
            </Modal>
        </View>

        : <View>
            <Heading children='Create / Import ID' />

            <Alert children='Your id is created and saved successfully:' />

            <Code>did:ixo:{id.didDoc.did}</Code>

            <Button
                text='Proceed'
                onPress={() => initForExistingId(nav, id)}
            />
        </View>
}

const subScenes = {
    scanQR: ({onReturn}) => {
        const
            [scanCompleted, setScanCompleted] = useState(false),
            [encryptedUserData, setEncryptedUserData] = useState(),
            [pwd, setPwd] = useState('')

        return !scanCompleted
            ? <QRScanner
                onScan={({data}) => {
                    setEncryptedUserData(data)
                    setScanCompleted(true)
                }}
                text='Please scan QR code'
            />

            : <>
                <Text children='Enter Keysafe password to unlock:'  />

                <TextInput
                    placeholder='password'
                    secureTextEntry={true}
                    onChangeText={setPwd}
                />

                <Button
                    onPress={() => {
                        const {mnemonic} = decryptAES(encryptedUserData, pwd)
                        onReturn(mnemonic)
                        setScanCompleted(false)
                        setEncryptedUserData(null)
                    }}
                    text='Import'
                />
            </>
    },

    pasteMnemonic: ({onReturn}) => {
        const [text, setText] = useState('')

        return <>
            <TextInput
                multiline
                placeholder='Enter mnemonic'
                onChangeText={setText}
            />

            <Button
                onPress={() => onReturn(text)}
                text='Done'
            />
        </>
    },

    createID: ({onReturn}) => {
        const
            [mmChosen, setMmChosen] = useState(false),
            [mm, setMm] = useState([]),
            [shuffledMm, setShuffledMm] = useState([]),
            [reconstructedMm, setReconstructedMm] = useState([])

        return !mmChosen
            ? <>
                {!mm.length
                    ? null
                    : <>
                        <Code children={mm.slice(0, 4).join(' ')} />
                        <Code children={mm.slice(4, 8).join(' ')} />
                        <Code children={mm.slice(8, 12).join(' ')} />
                    </>}

                <Button
                    onPress={() =>
                        setMm(generateMnemonic(randomBytes(16)).split(' '))}
                    text={
                        mm.length ? 'Give me another' : 'Generate mnemonic'}
                />

                {!mm.length
                    ? null
                    : <Button
                        onPress={() => {
                            setMmChosen(true)
                            setShuffledMm(shuffle(mm))
                        }}
                        text='Ok I like this'
                    />}
            </>

            : <>
                <Text>
                    Prove that you saved your mnemonic, select the mnemonic
                    words with the right order:
                </Text>

                <ButtonGroup size='lg' items={shuffledMm.map(word => ({
                    text: word,
                    onPress: () => {
                        const nextReconstructedMm =
                            [...reconstructedMm, word]

                        setShuffledMm(pull(shuffledMm, word))
                        setReconstructedMm(nextReconstructedMm)

                        if (shuffledMm.length > 0)
                            return

                        if (isEqual(nextReconstructedMm, mm))
                            onReturn(mm.join(' '))
                        else {
                            setShuffledMm(shuffle(mm))
                            setReconstructedMm([])
                        }
                    },
                }))} />

                <Code children={reconstructedMm.slice(0, 4).join(' ')} />
                <Code children={reconstructedMm.slice(4, 8).join(' ')} />
                <Code children={reconstructedMm.slice(8, 12).join(' ')} />

                <Button
                    text='Retry'
                    onPress={() => {
                        setShuffledMm(shuffle(mm))
                        setReconstructedMm([])
                    }}
                />
            </>

    },
}


const decryptAES = (text, pwd) => {
    const
        bytes = cryptoJS.AES.decrypt(text, pwd),
        contentsHex = bytes.toString(cryptoJS.enc.Utf8),
        payloadJson = Buffer.from(contentsHex, 'hex').toString('utf8')

    return JSON.parse(payloadJson)
}

const generateId = mnemonic => {
    const
        address = deriveAddress(mnemonic),
        pkey = deriveECKeyPair(mnemonic).privateKey.toString('hex'),
        didDoc = deriveDidDoc(mnemonic),
        claimAddress = deriveAgentAddress(didDoc.verifyKey)

    return {address, pkey, didDoc, claimAddress}
}


module.exports = IdCreation
