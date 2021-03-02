const
    React = require('react'),
    {useState, useRef, useCallback} = React,
    {Recorder} = require('@react-native-community/audio-toolkit'),
    {noop} = require('lodash-es'),
    {getAndroidPermission} = require('$/lib/util'),
    Button = require('./Button')


const AudioRecorder = ({onStart = noop, onStop = noop}) => {
    const
        [isRecording, toggleRecordingState] = useState(false),

        recorderRef = useRef(),

        startRecording = useCallback(async () => {
            recorderRef.current = new Recorder('recording.mp4')

            try {
                await getAndroidPermission('RECORD_AUDIO', {
                    title: 'Microphone Permission',
                    message: 'ixo need microphone access so you can make a recording', // eslint-disable-line max-len
                })
            } catch (e) {
                return
            }

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


module.exports = AudioRecorder
