const
    React = require('react'),
    {useRef, useState, useEffect, useCallback} = React,
    {Platform} = require('react-native'),
    {noop} = require('lodash-es'),
    {Player, MediaStates} = require('@react-native-community/audio-toolkit'),
    Button = require('./Button')


const Audio = ({
    source,
    paused,
    onPlay = noop,
    onPause = noop,
    onEnd = noop,
}) => {
    const
        playerRef = useRef(),
        [paused_, togglePauseState] = useState(true),
        isPaused = typeof paused !== 'undefined' ? paused : paused_
        // if "paused" is set, then this becomes a controlled component

    useEffect(() => { isPaused ? pauseRecord() : playRecord() }, [isPaused])

    useEffect(() => {
        playerRef.current = new Player(source.uri, {autoDestroy: false})

        if (Platform.OS === 'android')
            playerRef.current.speed = 0.0
        /* See https://github.com/react-native-audio-toolkit/react-native-audio-toolkit/issues/168#issuecomment-552074604 */// eslint-disable-line max-len

        playerRef.current.on('ended', () => {
            togglePauseState(true)
            onEnd()
        })

        return () => playerRef.current.destroy()
    }, [source])

    const
        playRecord = useCallback(() => {
            if (playerRef.current.currentTime > -1)
                return playerRef.current.play()
                // Without arguments it acts as "resume"

            playerRef.current.play(err => {
                if (err) {
                    alert('An error occurred, please try again later!')
                    console.error(err)
                    return
                }

                if (Platform.OS === 'android')
                    playerRef.current.speed = 1.0
                /* See https://github.com/react-native-audio-toolkit/react-native-audio-toolkit/issues/168#issuecomment-552074604 */// eslint-disable-line max-len
            })
        }),

        pauseRecord = useCallback(() => {
            if (
                !playerRef.current
                || playerRef.current.state !== MediaStates.PLAYING
            )
                return

            playerRef.current.pause(err => {
                if (err) {
                    alert('An error occurred, please try again later!')
                    console.error(err)
                    return
                }
            })
        })

    return <Button
        type='contained'
        text={(isPaused ? 'Play' : 'Pause') + ' record'}
        onPress={() => {
            togglePauseState(s => !s)
            ;(isPaused ? onPlay : onPause)()
        }}
    />
}


module.exports = Audio
