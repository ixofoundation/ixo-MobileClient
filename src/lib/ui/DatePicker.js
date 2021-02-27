const
    React = require('react'),
    CalendarPicker = require('react-native-calendar-picker').default


const DatePicker = ({value = [], onChange, ...props}) =>
    <CalendarPicker
        {...props}
        allowRangeSelection={false}
        selectedStartDate={value}
        onDateChange={date => onChange(date.toISOString())}
    />


module.exports = DatePicker
