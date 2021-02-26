const
    React = require('react'),
    CalendarPicker = require('react-native-calendar-picker').default


const DateRangePicker = ({value = [], onChange, ...props}) =>
    <CalendarPicker
        {...props}
        allowRangeSelection={true}
        selectedStartDate={value[0]}
        selectedEndDate={value[1]}
        onDateChange={(date, dateType) => {
            if (!date)
                return

            const
                prevVal =
                    (value[0] && value[1])
                        ? [undefined, undefined]
                        : value,

                newVal =
                    dateType === 'START_DATE'
                        ? [date, prevVal[1]]
                        : [prevVal[0], date]

            onChange(newVal)
        }}
    />


module.exports = DateRangePicker
