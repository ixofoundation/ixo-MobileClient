const
    React = require('react'),
    DatePicker = require('./DatePicker')


const DateRangePicker = ({value = [], onChange, ...props}) =>
    <DatePicker
        {...props}
        allowRangeSelection={true}
        value={value[0]}
        selectedEndDate={value[1]}
        onChange={(date, dateType) => {
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
