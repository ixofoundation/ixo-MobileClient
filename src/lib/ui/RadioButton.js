const React = require('react'),
    {View, Pressable, Text, StyleSheet} = require('react-native'),
    ToggleView = require('./ToggleView'),
    {spacing} = require('$/theme')

const RadioButton = ({options = [], value, onChange}) => {
    const activeIndex = options.findIndex((v) => {
        return v.value === value.value
    })
    return (
        <View style={styles.root}>
            <ToggleView
                opened={[activeIndex]}
                onItemClick={(index) => {
                    const v = options.find((v, i) => i === index)
                    if (v) {
                        onChange(v)
                    }
                }}
            >
                {options.map((o, i) => (
                    <RadioButtonItem
                        key={o.value + i}
                        option={o}
                        start={i === 0}
                        end={i === options.length - 1}
                    />
                ))}
            </ToggleView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
})

const RadioButtonItem = ({open, option, onPress, start, end}) => {
    const styles = itmeStyles(open, start, end)
    return (
        <Pressable onPress={onPress} style={styles.btn}>
            <Text style={styles.btnText}>{option.label}</Text>
        </Pressable>
    )
}

const itmeStyles = (open, start, end) =>
    StyleSheet.create({
        btn: {
            backgroundColor: open ? '#043C57' : '#022F45',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 24,
            padding: spacing(2),
            borderTopEndRadius: end ? 8 : 0,
            borderBottomEndRadius: end ? 8 : 0,
            borderTopStartRadius: start ? 8 : 0,
            borderBottomStartRadius: start ? 8 : 0,
        },
        btnText: {
            color: open ? 'white' : '#5A879D',
        },
    })

module.exports = RadioButton
