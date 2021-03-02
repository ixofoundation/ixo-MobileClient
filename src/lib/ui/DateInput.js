const
    React = require('react'),
    {useState} = React,
    {View, Modal} = require('react-native'),
    TextInput = require('./TextInput'),
    Button = require('./Button'),
    DatePicker = require('./DatePicker')


const DateInput = ({value, onChange}) => {
    const
        [pickerShown, togglePicker] = useState(false),
        [pickerValue, setPickerValue] = useState(value)

    return <View>
        <TextInput value={value} onChange={onChange} />

        <Button
            type='contained'
            text='Open date picker'
            onPress={() => togglePicker(true)}
        />

        <Modal
            visible={pickerShown}
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
