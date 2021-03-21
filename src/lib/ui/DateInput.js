

const
    React = require('react'),
    {useState} = React,
    {View, Pressable, Text, StyleSheet} = require('react-native'),
    {noop} = require('lodash-es'),
    Button = require('./Button'),
    DatePicker = require('./DatePicker'),
    Modal = require('./Modal'),
    Header = require('./Header'),
    Icon = require('./Icon'),
    theme = require('$/theme')


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
            <Header>
                <Pressable onPress={() => togglePicker(false)}>
                    <Icon name='chevronLeft' width={24} fill='white'/>
                </Pressable>
                <Text 
                    style={style.title}
                    children='Select Date'
                />
                <View style={{width: 24}}/>
            </Header>
            <View style={style.container}>    
                
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
            </View>
        </Modal>
    </View>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002233',
        padding: theme.spacing(3),
    },
    title: {
        color: 'white',
        fontSize: theme.fontSizes.h5,
    },
})


module.exports = DateInput
