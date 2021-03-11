const
    React = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {without, capitalize, memoize, noop} = require('lodash-es'),
    theme = require('$/theme')

const Select = ({
    opts = [],
    value,
    onChange = noop,
    multiple = false,
}) => {
    value = value || (multiple ? [] : undefined)

    return <View style={s.container}>
        {opts.map(opt => {
            if (typeof opt === 'string')
                opt = {value: opt}

            const {value: optValue, title = capitalize(optValue)} = opt
            const isSelected = multiple ? 
                value.includes(optValue) : value === optValue
            return <TouchableHighlight
                key={optValue}
                style={s.btn(isSelected)}
                onPress={() => {
                    if (!multiple)
                        return onChange(optValue)

                    onChange(
                        value.includes(optValue)
                            ? without(value, optValue)
                            : [...value, optValue],
                    )
                }}
            >
                <Text style={s.btnText(isSelected)} children={title} />
            </TouchableHighlight>
        })}
    </View>
}

const s = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    btn: memoize(isSelected => ({
        backgroundColor: isSelected ? '#00D2FF' : 'transparent',
        padding: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderWidth: 1,
        borderRadius: 24,
        borderColor: '#00D2FF',
    })),
    btnText: memoize(isSelected => ({
        color: isSelected ? 'white' : '#00D2FF',
        fontSize: theme.fontSizes.button,
    })),
}


module.exports = Select
