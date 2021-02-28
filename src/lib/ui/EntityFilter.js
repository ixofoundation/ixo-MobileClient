const
    React = require('react'),
    {useState, Children, cloneElement} = React,
    {View} = require('react-native'),
    {noop} = require('lodash-es'),
    ButtonGroup = require('./ButtonGroup'),
    Button = require('./Button'),
    Select = require('./Select'),
    Switch = require('./Switch'),
    Heading = require('./Heading'),
    DatePicker = require('./DatePicker'),
    DateRangePicker = require('./DateRangePicker')

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

    return <View>
        <Heading children='Filter' />

        <ButtonGroup>
            <Button text='Close' onPress={onCancel}/>
            <Button text='Reset' onPress={() => setValue({})}/>
        </ButtonGroup>

        {
            Children.map(children, (child) => {
                if (filterComponents.some(comp => comp === child.type)) {
                    const {id} = child.props
                    return cloneElement(child, {
                        ...child.props, 
                        key: id,
                        onChange: val =>
                            setValue(prevValue => ({...prevValue, [id]: val})),
                        value: value[id],
                    })
                }
                return child
            })
        }

        <Button text='Apply' onPress={() => onChange(value)} />
    </View>
}


module.exports = EntityFilter
