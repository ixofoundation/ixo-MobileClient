const React = require('react'),
    {View, StyleSheet} = require('react-native')

const ProgressBar = ({percent = 0, progress = 0}) => {
    const percentValue = Math.min(Math.max(0, percent), 100)
    const progressValue = Math.min(
        Math.max(0, progress),
        100 - Math.max(0, percent),
    )
    const progressStyle = StyleSheet.compose(style.progress, {
        width: percentValue + '%',
    })
    const percentageStyle = StyleSheet.compose(style.percentage, {
        width: progressValue + '%',
    })
    return (
        <View style={style.backgroundBar}>
            <View style={progressStyle} />
            <View style={percentageStyle} />
            <View style={style.empty} />
        </View>
    )
}

const style = StyleSheet.create({
    backgroundBar: {
        flexDirection: 'row',
        width: '100%',
        height: 5,
        backgroundColor: '#033C50',
        borderRadius: 10,
    },
    progress: {
        backgroundColor: '#04D0FB',
        borderTopStartRadius: 10,
        borderBottomStartRadius: 10,
    },
    percentage: {
        backgroundColor: '#CD1C33',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
    },
    empty: {
        flexGrow: 1,
        backgroundColor: '#033C50',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
    },
})

module.exports = ProgressBar
