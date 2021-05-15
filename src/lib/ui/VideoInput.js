const
    React = require('react'),
    {useRef, useState, useCallback} = React,
    {View, Pressable, Text} = require('react-native'),
    Video = require('react-native-video').default,
    {RNCamera} = require('react-native-camera'),
    {noop} = require('lodash-es'),
    {selectFile} = require('$/lib/util'),
    Button = require('./Button'),
    Modal = require('./Modal')


const defaultRecordOptions = {
    quality: RNCamera.Constants.VideoQuality['480p'],
}

const VideoInput = ({
    value,
    onChange = noop,
    editable = true,
    recordOptions = {},
}) => {
    const
        camRef = useRef(),
        playerRef = useRef(),
        [recorderOpen, toggleRecorder] = useState(false),
        [isRecording, toggleRecordingState] = useState(false),
        [isPlaying, togglePlaying] = useState(false),
        finalRecordOptions = {...defaultRecordOptions, ...recordOptions},

        startRecording = useCallback(async () => {
            toggleRecordingState(true)

            const resp = await camRef.current.recordAsync(finalRecordOptions)

            toggleRecordingState(false)

            onChange({uri: resp.uri, type: 'video/mp4'})
        }),

        stopRecording = useCallback(async () => {
            await camRef.current.stopRecording()
            toggleRecorder(false)
        }),

        selectVideo = useCallback(async () => {
            const vid = await selectFile('audio')

            if (vid)
                onChange(vid)
        })

    return <View style={style}>
        {value && <>
            <Video
                ref={ref => playerRef.current = ref}
                source={{uri: value.uri || value}}
                paused={!isPlaying}
                onEnd={() => {
                    togglePlaying(false)
                    playerRef.current.seek(0)
                }}
                style={{
                    width: '100%',
                    height: 250,
                    alignSelf: 'center',
                    backgroundColor: '#eee',
                }}
                resizeMode='contain'
            />
            <Button
                type='contained'
                text={isPlaying ? 'Pause' : 'Play'}
                onPress={() => togglePlaying(s => !s)}
            />
        </>}

        {editable && <>
            <Button
                type='contained'
                text='Record'
                onPress={() => toggleRecorder(true)}
            />
            <Button
                type='contained'
                text='Select'
                onPress={selectVideo}
            />
        </>}

        <Modal
            visible={editable && recorderOpen}
            onRequestClose={() => {
                if (isRecording)
                    stopRecording()

                toggleRecorder(false)
            }}
        >
            <RNCamera
                ref={ref => camRef.current = ref}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                captureAudio={true}
                style={{height: '100%', justifyContent: 'flex-end'}}
            >
                <Pressable
                    onPress={() => {
                        if (isRecording)
                            stopRecording()

                        toggleRecorder(false)
                    }}
                    style={backStyle}
                    children={
                        <Text style={backTextStyle} children='Back' />}
                />

                <Button
                    type='contained'
                    size='lg'
                    text={isRecording ? 'Stop' : 'Start'}
                    onPress={isRecording ? stopRecording : startRecording}
                />
            </RNCamera>
        </Modal>
    </View>
}

const
    style = {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    backStyle = {
        position: 'absolute',
        top: 5,
        backgroundColor: '#012D42',
        padding: 5,
    },

    backTextStyle = {
        color: 'white',
        textDecorationLine: 'underline',
    }


module.exports = VideoInput
