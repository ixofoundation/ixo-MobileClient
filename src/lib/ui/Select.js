const React = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {without, capitalize, memoize, noop} = require('lodash-es'),
    theme = require('$/theme')

const Select = ({
    opts = [],
    value,
    onChange = noop,
    multiple = false,
    editable = true,
}) => {
    value = value || (multiple ? [] : undefined)

    return (
        <View style={s.container}>
            {opts
                .map((opt) => (typeof opt === 'object' ? opt : {value: opt}))
                .filter(
                    (opt) =>
                        editable ||
                        (multiple
                            ? value.includes(opt.value)
                            : value === opt.value),
                )
                .map((opt) => {
                    if (typeof opt !== 'object') opt = {value: opt}

                    const isSelected = multiple
                        ? value.includes(opt.value)
                        : value === opt.value

                    let optChildren = opt.title || capitalize(String(opt.value))

                    if (typeof optChildren === 'string')
                        optChildren = (
                            <Text
                                style={s.btnText(isSelected)}
                                children={optChildren}
                            />
                        )

                    return (
                        <TouchableHighlight
                            key={opt.value}
                            style={s.btn(isSelected)}
                            children={optChildren}
                            onPress={() => {
                                if (!editable) return

                                if (!multiple) return onChange(opt.value)

                                onChange(
                                    value.includes(opt.value)
                                        ? without(value, opt.value)
                                        : [...value, opt.value],
                                )
                            }}
                        />
                    )
                })}
        </View>
    )
}

const s = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    btn: memoize((isSelected) => ({
        backgroundColor: isSelected ? '#00D2FF' : 'transparent',
        padding: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderWidth: 1,
        borderRadius: 24,
        borderColor: '#00D2FF',
        minWidth: 40,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    })),
    btnText: memoize((isSelected) => ({
        color: isSelected ? 'white' : '#00D2FF',
        fontSize: theme.fontSizes.button,
        textAlign: 'center',
    })),
}

module.exports = Select
