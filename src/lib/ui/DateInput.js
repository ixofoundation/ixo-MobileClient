const
    React = require('react'),
    {useState} = React,
    {View} = require('react-native'),
    {noop} = require('lodash-es'),
    Button = require('./Button'),
    DatePicker = require('./DatePicker'),
    Modal = require('./Modal')


const DateInput = ({value, onChange = noop, editable = true}) => {
    const
        [pickerShown, togglePicker] = useState(false),
        [pickerValue, setPickerValue] = useState(value)

    return <View>
        <Button
            type='contained'
            text={value || 'Select Date'}
            onPress={() => editable && togglePicker(true)}
        />

        <Modal
            visible={editable && pickerShown}
            onRequestClose={() => togglePicker(false)}
        >
            <DatePicker
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


module.exports = DateInput
