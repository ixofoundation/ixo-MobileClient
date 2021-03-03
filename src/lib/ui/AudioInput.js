const
    React = require('react'),
    {useState, useCallback} = React,
    {View} = require('react-native'),
    {noop} = require('lodash-es'),
    {selectFile} = require('$/lib/util'),
    Audio = require('./Audio'),
    AudioRecorder = require('./AudioRecorder'),
    Button = require('./Button')


const AudioInput = ({value, onChange = noop, editable = true}) => {
    const
        [isPlaying, togglePlayingState] = useState(false),

        selectAudioFile = useCallback(async () => {
            const audioFile = await selectFile('audio')

            if (audioFile)
                onChange(audioFile)
        })

    return <View style={style}>
        {value &&
            <Audio
                source={value}
                paused={!isPlaying}
                onPlay={() => togglePlayingState(true)}
                onPause={() => togglePlayingState(false)}
                onEnd={() => togglePlayingState(false)}
            />}

        {editable && <>
            <AudioRecorder
                onStart={() => togglePlayingState(false)}
                onStop={onChange}
            />

            <Button
                type='contained'
                text='Select file'
                onPress={selectAudioFile}
            />
        </>}
    </View>
}


const style = {
    flexDirection: 'row',
}


module.exports = AudioInput
