const
    React = require('react'),
    {useRef, useState, useCallback} = React,
    {View} = require('react-native'),
    Video = require('react-native-video').default,
    {RNCamera} = require('react-native-camera'),
    {selectFile} = require('$/lib/util'),
    Button = require('./Button'),
    Modal = require('./Modal')


const VideoInput = ({value, onChange, editable = true}) => {
    const
        camRef = useRef(),
        playerRef = useRef(),
        [recorderOpen, toggleRecorder] = useState(false),
        [isRecording, toggleRecordingState] = useState(false),
        [isPlaying, togglePlaying] = useState(false),

        startRecording = useCallback(async () => {
            toggleRecordingState(true)

            const resp = await camRef.current.recordAsync({
                quality: RNCamera.Constants.VideoQuality['288p'],
            })

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
                source={{uri: value.uri}}
                paused={!isPlaying}
                onEnd={() => {
                    togglePlaying(false)
                    playerRef.current.seek(0)
                }}
                style={{
                    width: '100%',
                    height: 250,
                    alignSelf: 'center',
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
                text='Start recording'
                onPress={() => toggleRecorder(true)}
            />
            <Button
                type='contained'
                text='Select video'
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
                defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
                captureAudio={true}
                style={{height: '100%'}}
            >
                <Button
                    type='contained'
                    text={isRecording ? 'Stop' : 'Start'}
                    onPress={isRecording ? stopRecording : startRecording}
                />
            </RNCamera>
        </Modal>
    </View>
}

const style = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
}


module.exports = VideoInput
