const
    React = require('react'),
    {createElement, useContext, useState, useCallback, useRef} = React,
    {
        Platform, PermissionsAndroid, View, Text, Modal, Image,
    } = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    DocumentPicker = require('react-native-document-picker').default,
    {RNCamera} = require('react-native-camera'),
    {readFile} = require('react-native-fs'),
    {Recorder, Player, MediaStates} =
        require('@react-native-community/audio-toolkit'),
    {useProjects} = require('$/stores'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {Heading, ButtonGroup, Button, TextInput, Select} = require('$/lib/ui')


const NewClaim = ({projectDid, templateDid}) => {
    const
        {stateNavigator: nav} = useContext(NavigationContext),
        [formShown, toggleForm] = useState(false)

    return <MenuLayout><AssistantLayout>
        <Heading children='Submit a Claim' />

        <Text>
            Thank you for being interested in our project. In order to complete
            the claims on this project you'll need to complete the following:
        </Text>

        <Text children='Fill in a short answer' />
        <Text children='Choose between options' />
        <Text children='Upload an image' />
        <Text children='Upload audio' />
        <Text children='Upload a file / document' />
        <Text children='Give a detailed answer' />
        <Text children='Select an image' />
        <Text children='Upload video' />
        <Text children='Scan a QR code' />

        <ButtonGroup items={[{
            type: 'outlined',
            text: 'Come back later',
            onPress: () => nav.navigateBack(1),
        }, {
            type: 'contained',
            text: 'Submit a Claim',
            onPress: () => toggleForm(true),
        }]} />

        <Modal
            visible={formShown}
            onRequestClose={() => toggleForm(false)}
            children={
                <ClaimForm
                    projectDid={projectDid}
                    templateDid={templateDid}
                    onClose={() => toggleForm(false)}
                />}
        />
    </AssistantLayout></MenuLayout>
}

const ClaimForm = ({projectDid, templateDid, onClose}) => {
    const
        [currentStepIdx, setCurrentStep] = useState(0),
        currentStep = claimFormSteps[currentStepIdx],
        [formState, setFormState] = useState({}),
        [formError, setFormError] = useState(null)

    console.log('form state', formState)

    return <View>
        <Button type='contained' text='Close' onPress={onClose} />

        {createElement(currentStep.comp, {
            projectDid,
            templateDid,
            value: formState[currentStep.id],
            onChange: val =>
                setFormState(fs => ({...fs, [currentStep.id]: val})),
        })}

        {formError === 'required' &&
            <Text children='Field is required' style={{color: 'red'}} />}

        {currentStepIdx > 0 &&
            <Button
                text='Prev'
                type='outlined'
                onPress={() => {
                    setFormError(null)
                    setCurrentStep(s => s - 1)
                }}
            />}

        {currentStepIdx < claimFormSteps.length - 1 &&
            <Button
                text='Next'
                type='contained'
                onPress={() => {
                    const emptyVals = ['null', 'undefined', '']

                    if (emptyVals.includes(String(formState[currentStep.id])))
                        return setFormError('required')

                    setFormError(null)
                    setCurrentStep(s => s + 1)
                }}
            />}
    </View>
}

const FillInShortAnswer = ({value, onChange}) => <>
    <TextInput
        placeholder='Fill in a short answer'
        value={value}
        onChangeText={onChange}
    />
</>

const ChooseBetweenOptions = ({value, onChange}) => <>
    <Text children='choose between options' />

    <Select
        multiple
        opts={['lorem', 'ipsum', 'dolor']}
        value={value}
        onChange={onChange}
    />
</>

const UploadImage = ({value, onChange, projectDid}) => {
    const
        ps = useProjects(),
        [selectedImg, setSelectedImg] = useState({uri: value}),
        [camShown, toggleCam] = useState(false)

    const takePhoto = useCallback(async cam => {
        const
            options = {quality: 0.3},
            data = await cam.takePictureAsync(options)

        data.type = 'image/jpeg'

        setSelectedImg(data)
        toggleCam(false)
    })

    const selectImage = useCallback(async () => {
        const img = await selectFile('images')

        if (img)
            setSelectedImg(img)
    })

    const uploadImage = useCallback(async () => {
        const fileUrl =
            await uploadFileToCellNode(
                ps, projectDid, selectedImg.type, selectedImg.uri)

        onChange(fileUrl)

        alert('Complete!')
    })

    return <View>
        <Text children='upload image' />

        {selectedImg &&
            <Image
                source={{uri: selectedImg.uri}}
                style={{width: '60%', height: 200, alignSelf: 'center'}}
            />}

        <Button
            type='contained'
            text='Take a Photo'
            onPress={() => toggleCam(true)}
        />

        <Button
            type='contained'
            text='Select Image'
            onPress={selectImage}
        />

        {selectedImg &&
            <Button
                type='contained'
                text='Upload Image'
                onPress={uploadImage}
            />}

        <Modal
            visible={camShown}
            onRequestClose={() => toggleCam(false)}
        >
            <RNCamera
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
                captureAudio={false}
                style={style.cam}
            >
                {({camera}) =>
                    <Button
                        type='contained'
                        text='Take Photo'
                        onPress={() => takePhoto(camera)}
                    />}
            </RNCamera>
        </Modal>
    </View>
}

const UploadAudio = ({value, onChange, projectDid}) => {
    const
        ps = useProjects(),
        [audioFile, setAudioFile] = useState(),
        [isRecording, toggleRecordingState] = useState(false),
        [isPlaying, togglePlayingState] = useState(false),

        recorderRef = useRef(),
        playerRef = useRef(),

        startRecording = useCallback(async () => {
            if (
                playerRef.current
                && playerRef.current.state === MediaStates.PLAYING
            )
                playerRef.current.pause(err => {
                    if (err) {
                        alert('An error occurred, please try again later!')
                        console.error(err)
                        return
                    }

                    togglePlayingState(false)
                })

            recorderRef.current = new Recorder('recording.mp4')

            if (
                Platform.OS === 'android'
                && !(await askForAndroidAudioPermission())
            )
                return

            recorderRef.current.record(err => {
                if (err) {
                    alert('An error occurred! Please try again.')
                    console.error(err)
                } else {
                    toggleRecordingState(true)
                }
            })
        }),

        stopRecording = useCallback(() =>
            recorderRef.current.stop(err => {
                if (err) {
                    alert('An error occurred! Please try again.')
                    console.error(err)
                } else {
                    toggleRecordingState(false)

                    setAudioFile({
                        uri: recorderRef.current.fsPath,
                        type: 'audio/mp4',
                    })

                    playerRef.current = null
                }
            }),
        ),

        playRecord = useCallback(() => {
            if (playerRef.current && playerRef.current.currentTime > -1) {
                playerRef.current.play()// Without arguments it acts as "resume"
                togglePlayingState(true)
                return
            }

            playerRef.current = new Player(audioFile.uri)

            if (Platform.OS === 'android')
                playerRef.current.speed = 0.0
                /* See https://github.com/react-native-audio-toolkit/react-native-audio-toolkit/issues/168 */// eslint-disable-line max-len

            playerRef.current.on('ended', () => togglePlayingState(false))

            playerRef.current.play(err => {
                if (err) {
                    alert('An error occurred, please try again later!')
                    console.error(err)
                    return
                }

                if (Platform.OS === 'android')
                    playerRef.current.speed = 1.0

                togglePlayingState(true)
            })
        }),

        pauseRecord = useCallback(() => {
            playerRef.current.pause(err => {
                if (err) {
                    alert('An error occurred, please try again later!')
                    console.error(err)
                    return
                }

                togglePlayingState(false)
            })
        }),

        selectAudioFile = useCallback(async () => {
            const audioFile = await selectFile('audio')

            if (audioFile)
                setAudioFile(audioFile)
        }),

        uploadAudio = useCallback(async () => {
            const fileUrl =
                await uploadFileToCellNode(
                    ps, projectDid, audioFile.type, audioFile.uri)

            onChange(fileUrl)

            alert('Complete!')
        })

    return <View>
        <Text children='upload audio' />

        {isRecording && <Text>Now recording...</Text>}

        {isPlaying && <Text>Now playing...</Text>}

        {audioFile &&
            <Button
                type='contained'
                text={(isPlaying ? 'Pause' : 'Play') + ' record'}
                onPress={isPlaying ? pauseRecord : playRecord}
            />}

        <Button
            type='contained'
            text={isRecording ? 'Stop recording' : 'Record audio'}
            onPress={isRecording ? stopRecording : startRecording}
        />

        <Button
            type='contained'
            text='Select audio file'
            onPress={selectAudioFile}
        />

        {audioFile &&
            <Button
                type='contained'
                text='Upload audio'
                onPress={uploadAudio}
            />}
    </View>
}

const UploadDoc = ({value, onChange}) =>
    <Text children='upload doc' />

const GiveDetailedAnswer = ({value, onChange}) =>
    <Text children='give detailed answer' />

const SelectImage = ({value, onChange}) =>
    <Text children='select image' />

const UploadVideo = ({value, onChange}) =>
    <Text children='upload video' />

const ScanQRCode = ({value, onChange}) =>
    <Text children='scan QR code' />

const claimFormSteps = [
    {id: 'shortAnswer',  comp: FillInShortAnswer},
    {id: 'chosenOption', comp: ChooseBetweenOptions},
    {id: 'img',          comp: UploadImage},
    {id: 'audio',        comp: UploadAudio},
    {id: 'doc',          comp: UploadDoc},
    {id: 'longAnswer',   comp: GiveDetailedAnswer},
    {id: 'selectedImg',  comp: SelectImage},
    {id: 'video',        comp: UploadVideo},
    {id: 'qr',           comp: ScanQRCode},
]

// @param allowedTypes: array of following values:
//     "allFiles" | "images" | "plainText" | "audio" | "pdf" | "zip" | "csv" |
//     "doc" | "docx" | "ppt" | "pptx" | "xls" | "xlsx"
//
const selectFile = async (allowedTypes = ['allFiles'], {multi = false} = {}) =>{
    if (typeof allowedTypes=== 'string')
        allowedTypes = [allowedTypes]

    try {
        const doc = await DocumentPicker[multi ? 'pickMultiple' : 'pick']({
            type: allowedTypes.map(t => DocumentPicker.types[t]),
        })

        return doc

    } catch (err) {
        if (DocumentPicker.isCancel(err))
            return null
        else
            throw err
    }
}

const askForAndroidAudioPermission = () =>
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Microphone Permission',
        message: 'ixo need microphone access so you can make a recording',
    })
        .then(result => result === PermissionsAndroid.RESULTS.GRANTED)

const uploadFileToCellNode = async (
    ps,
    projectDid,
    fileMimeType,
    localFilePath,
) => {
    const
        base64Content = await readFile(localFilePath, 'base64'),

        serviceEndpoint =
            dashedHostname(
                ps.items[projectDid].data.nodes.items
                    .find(i => i['@type'] === 'CellNode')
                    .serviceEndpoint
                    .replace(/\/$/, ''),
            ),

        fileId =
            await ps.createFile(
                serviceEndpoint,
                'data:' + fileMimeType + ';base64,' + base64Content,
            ),

        fileUrl = serviceEndpoint + '/public/' + fileId

    return fileUrl
}

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)?/,
        (_, proto, host, path) => proto + host.replace('_', '-') + (path || ''),
    )

const style = {
    cam: {
        height: '100%',
    },
}


module.exports = NewClaim
