const
    React = require('react'),
    {useState, useContext, createElement} = React,
    {View, Text, Modal, TextInput} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {RNCamera} = require('react-native-camera'),
    {randomBytes} = require('react-native-randombytes'),
    cryptoJS = require('crypto-js'),
    {shuffle, pull, isEqual} = require('lodash-es'),
    {initForExistingId} = require('$/init'),
    {useId} = require('$/stores'),
    {Button} = require('$/lib/ui'),
    {crypto: {
        generateMnemonic, deriveAddress, deriveECKeyPair, deriveDidDoc,
        deriveClaimAddress,
    }}
        = require('@ixo/client-sdk')


const IdCreation = () => {
    const
        [currentSubscene, setSubscene] = useState(),
        {id, set: setId} = useId(),
        {stateNavigator: nav} = useContext(NavigationContext)

    return !id
        ? <View>
            <Text>Create / Import ID</Text>

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
                {currentSubscene && createElement(subScenes[currentSubscene], {
                    onReturn: async mnemonic => {
                        const id = generateId(mnemonic)

                        try {
                            setId({id})
                            setSubscene(null)
                        } catch (e) {
                            console.error(e)
                        }
                    },
                })}
            </Modal>
        </View>

        : <View>
            <Text>Your id is created and saved successfully:</Text>

            <Text>{JSON.stringify(id, null, 2)}</Text>

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
                text='Scan QR code'
            />

            : <>
                <TextInput
                    placeholder='Enter password'
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
                {mm && <Text>Mnemonic: {mm.join(' ')}</Text>}

                <Button
                    onPress={() =>
                        setMm(generateMnemonic(randomBytes(16)).split(' '))}
                    text='(Re)generate mnemonic'
                />

                <Button
                    onPress={() => {
                        setMmChosen(true)
                        setShuffledMm(shuffle(mm))
                    }}
                    text='Proceed with this mnemonic'
                />
            </>

            : <>
                <Text>Prove that you saved your mnemonic</Text>

                {shuffledMm.map(word =>
                    <Button
                        key={word}
                        text={word}
                        onPress={() => {
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
                        }}
                    />,
                )}

                <Text>{reconstructedMm.join(' ')}</Text>

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

const QRScanner = ({onScan, text}) =>
    <RNCamera
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onScan}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
    >
        <Text>{text}</Text>
    </RNCamera>


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
        claimAddress = deriveClaimAddress(didDoc.verifyKey)

    return {address, pkey, didDoc, claimAddress}
}


module.exports = IdCreation
