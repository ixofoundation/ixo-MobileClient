const
    React = require('react'),
    {View, StyleSheet} = require('react-native'),
    CalendarPicker = require('react-native-calendar-picker').default,
    Icon = require('$/lib/ui/Icon'),
    theme = require('$/theme')


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
                        ? [date.toISOString(), prevVal[1]]
                        : [prevVal[0], date.toISOString()]

            onChange(newVal)
        }}
        selectedRangeStartStyle={style.selected}
        selectedRangeStartTextStyle={style.boldText}
        selectedRangeStyle={style.selectedRange}
        selectedDayTextStyle={style.mainText}
        todayBackgroundColor='#00D2FF'
        selectedRangeEndTextStyle={style.boldText}
        customDayHeaderStyles={customDayHeaderStyles}
        dayLabelsWrapper={style.dayLabelsWrapper}
        selectedRangeEndStyle={style.selected}
        textStyle={style.mainText}
        customDatesStyles={style.mainText}
        monthTitleStyle={style.boldText}
        nextComponent={
            <View style={style.monthBtn}>
                <Icon name='chevronRight' fill='white'/>
            </View>
        }
        previousComponent={
            <View style={style.monthBtn}>
                <Icon name='chevronLeft' fill='white'/>
            </View>
        }
    />


const customDayHeaderStyles = () => ({
    textStyle: {
        color: '#1B77A4',
        fontWeight: 'bold',
        fontSize: theme.fontSizes.p1,
    },
})

const style = StyleSheet.create({
    selected: {
        backgroundColor: '#ED9526',
    },
    selectedRange: {
        backgroundColor: '#ED952666',
    },
    boldText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dayLabelsWrapper: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    mainText: {
        color: 'white',
    },
    monthBtn: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#56CCF2',
        paddingHorizontal: theme.spacing(1),
        paddingVertical: theme.spacing(.5),
    },
})

module.exports = DateRangePicker
