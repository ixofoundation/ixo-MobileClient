const
    React = require('react'),
    {useState, useCallback} = React,
    {View, StyleSheet} = require('react-native'),
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

    return <View style={style.root}>
        {value &&
            <Audio
                source={typeof value === 'string' ? {uri: value} : value}
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



const style = StyleSheet.create({
    root: {flexDirection: 'row'},
})


module.exports = AudioInput
