const
    React = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {without, capitalize, memoize} = require('lodash-es')


const Select = ({
    opts = [],
    value,
    onChange = () => {},
    multiple = false,
}) => {
    value = value || (multiple ? [] : undefined)

    return <View style={s.container}>
        {opts.map(opt => {
            if (typeof opt === 'string')
                opt = {value: opt}

            const {value: optValue, title = capitalize(optValue)} = opt

            return <TouchableHighlight
                key={optValue}
                style={s.btn(
                    multiple ? value.includes(optValue) : value === optValue)}
                children={<Text children={title} />}
                onPress={() => {
                    if (!multiple)
                        return onChange(optValue)

                    onChange(
                        value.includes(optValue)
                            ? without(value, optValue)
                            : [...value, optValue],
                    )
                }}
            />
        })}
    </View>
}

const s = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    btn: memoize(isSelected => ({
        backgroundColor: isSelected ? 'lime' : 'transparent',
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderRadius: 10,
    })),
}


module.exports = Select
