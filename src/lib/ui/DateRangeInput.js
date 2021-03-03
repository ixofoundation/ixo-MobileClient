const
    React = require('react'),
    {useState} = React,
    {View} = require('react-native'),
    {noop} = require('lodash-es'),
    Button = require('./Button'),
    DateRangePicker = require('./DateRangePicker'),
    Modal = require('./Modal')


const DateRangeInput = ({value, onChange = noop, editable = true}) => {
    const
        [pickerShown, togglePicker] = useState(false),
        [pickerValue, setPickerValue] = useState(value)

    return <View>
        <Button
            type='contained'
            text={pickerValue ? String(pickerValue) : 'Select date range'}
            onPress={() => editable && togglePicker(true)}
        />

        <Modal
            visible={editable && pickerShown}
            onRequestClose={() => togglePicker(false)}
        >
            <DateRangePicker
                value={pickerValue}
                onChange={setPickerValue}
            />

            <Button
                type='contained'
                text='Apply'
                onPress={() => {
                    onChange(pickerValue)
                    togglePicker(false)
                }}
            />
        </Modal>
    </View>
}


module.exports = DateRangeInput
