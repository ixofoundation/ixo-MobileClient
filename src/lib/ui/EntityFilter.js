const
    React = require('react'),
    {createElement, useState} = React,
    {View, Text, Switch} = require('react-native'),
    CalendarPicker = require('react-native-calendar-picker').default,
    {noop, capitalize} = require('lodash-es'),
    ButtonGroup = require('./ButtonGroup'),
    Button = require('./Button'),
    Select = require('./Select'),
    Heading = require('./Heading'),
    DateRangePicker = require('./DateRangePicker')


const filterComp = {
    option: {
        component: Select,
        valueProp: 'value',
        onChangeProp: 'onChange',
    },
    switch: {
        component: Switch,
        valueProp: 'value',
        onChangeProp: 'onValueChange',
    },
    date: {
        component: CalendarPicker,
        valueProp: 'selectedStartDate',
        onChangeProp: 'onDateChange',
    },
    dateRange: {
        component: DateRangePicker,
        valueProp: 'value',
        onChangeProp: 'onChange',
    },
}


const EntityFilter = ({
    spec,
    initialValue = {},
    onChange = noop,
    onCancel = noop,
}) => {
    const [value, setValue] = useState(initialValue)

    return <View>
        <Heading children='Filter' />

        <ButtonGroup items={[
            {text: 'Close', onPress: onCancel},
            {text: 'Reset', onPress: () => setValue({})},
        ]} />

        {spec.flatMap(({type, id, title = capitalize(id), ...props}) => [
            <Text
                key={id + '_title'}
                children={title}
                style={s.heading}
            />,

            createElement(filterComp[type].component, {
                key: id,

                [filterComp[type].valueProp]: value[id],

                [filterComp[type].onChangeProp]: val =>
                    setValue(prevValue => ({...value, [id]: val})),

                ...props,
            }),
        ])}

        <Button text='Apply' onPress={() => onChange(value)} />
    </View>
}

const s = {
    heading: {
        fontWeight: 'bold',
        marginTop: 10,
        borderTopWidth: 1,
    },
}


module.exports = EntityFilter
