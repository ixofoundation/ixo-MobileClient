const
    React = require('react'),
    {useState, useRef, useCallback} = React,
    {Platform, PermissionsAndroid} = require('react-native'),
    {Recorder} = require('@react-native-community/audio-toolkit'),
    {noop} = require('lodash-es'),
    Button = require('./Button')


const AudioRecorder = ({onStart = noop, onStop = noop}) => {
    const
        [isRecording, toggleRecordingState] = useState(false),

        recorderRef = useRef(),

        startRecording = useCallback(async () => {
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
                    onStart()
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

                    onStop({
                        uri: recorderRef.current.fsPath,
                        type: 'audio/mp4',
                    })
                }
            }),
        )

    return <Button
        type='contained'
        text={isRecording ? 'Stop recording' : 'Record audio'}
        onPress={isRecording ? stopRecording : startRecording}
        style={isRecording ? {backgroundColor: 'red'} : null}
    />
}

const askForAndroidAudioPermission = () =>
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Microphone Permission',
        message: 'ixo need microphone access so you can make a recording',
    })
        .then(result => result === PermissionsAndroid.RESULTS.GRANTED)


module.exports = AudioRecorder
