const
    React = require('react'),
    {useState} = React,
    {View} = require('react-native'),
    {noop} = require('lodash-es'),
    TextInput = require('./TextInput'),
    Button = require('./Button'),
    DatePicker = require('./DatePicker'),
    Modal = require('./Modal')


const DateInput = ({value, onChange = noop, editable = true}) => {
    const
        [pickerShown, togglePicker] = useState(false),
        [pickerValue, setPickerValue] = useState(value)

    return <View>
        <TextInput
            value={value}
            onChange={val => editable && onChange(val)}
        />

        {editable &&
            <Button
                type='contained'
                text='Open date picker'
                onPress={() => togglePicker(true)}
            />}

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
