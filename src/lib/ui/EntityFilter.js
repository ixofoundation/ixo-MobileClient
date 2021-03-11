const
    React = require('react'),
    {useState, Children, cloneElement} = React,
    {View, Text, Pressable, StyleSheet} = require('react-native'),
    {noop} = require('lodash-es'),
    Button = require('./Button'),
    Select = require('./Select'),
    Switch = require('./Switch'),
    DatePicker = require('./DatePicker'),
    DateRangePicker = require('./DateRangePicker'),
    Icon = require('./Icon'),
    theme = require('$/theme')

const filterComponents = [
    Select,
    Switch,
    DatePicker,
    DateRangePicker,
]

const EntityFilter = ({
    children,
    initialValue = {},
    onChange = noop,
    onCancel = noop,
}) => {
    const [value, setValue] = useState(initialValue)
    const itemCount = Children.count(children)
    return <View style={s.root}>
        <View style={s.titleContainer}>
            <Text 
                children='Filter' 
                style={s.title}
            />
            <Pressable onPress={onCancel}>
                <Icon name='close' fill='white'/>
            </Pressable>
            <Button 
                prefix={<Icon name='web' fill='#00D2FF'/>}
                text='Reset'
                textStyle={s.refreshBtnText}
                style={s.refreshBtn}
                onPress={() => setValue({})}
            />
        </View>

        {
            Children.map(children, (child, index) => {
                if (filterComponents.some(comp => comp === child.type)) {
                    const {id} = child.props
                    const filterItem = cloneElement(child, {
                        ...child.props, 
                        key: id,
                        onChange: val =>
                            setValue(prevValue => ({...prevValue, [id]: val})),
                        value: value[id],
                    })
                    return <>
                        {filterItem}
                        {index !== itemCount - 1 && <Divider/>}
                    </>
                }
                return child
            })
        }

        <Button 
            text='Apply' 
            color='primary'
            type='contained'
            style={s.applyBtn}
            textStyle={s.applyBtnText}
            onPress={() => onChange(value)} 
        />
    </View>
}

const Divider = () => <View style={s.divider}/>

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
    divider: {
        borderBottomWidth: 1,
        borderColor: '#023851',
        width: '100%',
        marginVertical: theme.spacing(1),
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
})

module.exports = EntityFilter
