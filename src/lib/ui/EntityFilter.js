const React = require('react'),
    {createElement, Fragment, useState} = React,
    {View, Text, Pressable, StyleSheet} = require('react-native'),
    {noop, capitalize} = require('lodash-es'),
    Button = require('./Button'),
    Select = require('./Select'),
    Switch = require('./Switch'),
    DatePicker = require('./DatePicker'),
    DateRangePicker = require('./DateRangePicker'),
    Icon = require('./Icon'),
    Divider = require('./Divider'),
    theme = require('$/theme')

const filterComponents = {
    option: Select,
    switch: Switch,
    date: DatePicker,
    dateRange: DateRangePicker,
}

const EntityFilter = ({
    spec,
    initialValue = {},
    onChange = noop,
    onCancel = noop,
}) => {
    const [value, setValue] = useState(initialValue)

    return (
        <View style={s.root}>
            <View style={s.titleContainer}>
                <Text children="Filter" style={s.title} />
                <Pressable onPress={onCancel}>
                    <Icon name="close" fill="white" />
                </Pressable>
                <Button
                    prefix={<Icon name="web" fill="#00D2FF" />}
                    text="Reset"
                    textStyle={s.refreshBtnText}
                    style={s.refreshBtn}
                    onPress={() => setValue({})}
                />
            </View>

            {spec.map(({type, id, title = capitalize(id), ...props}, idx) => (
                <Fragment key={id}>
                    <Text children={title} style={s.filterTitle} />

                    {createElement(filterComponents[type], {
                        value: value[id],
                        onChange: (val) =>
                            setValue(() => ({...value, [id]: val})),
                        ...props,
                    })}

                    {idx < spec.length - 1 && <Divider />}
                </Fragment>
            ))}

            <Button
                text="Apply"
                color="primary"
                type="contained"
                style={s.applyBtn}
                textStyle={s.applyBtnText}
                onPress={() => onChange(value)}
            />
        </View>
    )
}

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#012D42',
        paddingHorizontal: theme.spacing(2),
    },
    title: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: theme.fontSizes.h4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: theme.spacing(2),
    },
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
    },
    refreshBtnText: {
        color: '#00D2FF',
        marginHorizontal: 0,
        marginLeft: theme.spacing(1),
    },
    applyBtn: {alignItems: 'center', marginTop: theme.spacing(1)},
    applyBtnText: {color: 'white'},
    filterTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
        marginBottom: theme.spacing(1),
    },
})

module.exports = EntityFilter
