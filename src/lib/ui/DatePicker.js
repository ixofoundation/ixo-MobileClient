const
    React = require('react'),
    {View, StyleSheet} = require('react-native'),
    CalendarPicker = require('react-native-calendar-picker').default,
    Icon = require('./Icon'),
    theme = require('$/theme')


const DatePicker = ({value, onChange, ...props}) =>
    <CalendarPicker
        {...props}
        allowRangeSelection={props.allowRangeSelection}
        selectedStartDate={value}
        onDateChange={(date, type) => 
            onChange(date && date.toISOString(), type)}
        selectedRangeStartStyle={style.selected}
        selectedRangeStartTextStyle={style.boldText}
        selectedRangeStyle={style.selectedRange}
        selectedDayTextStyle={style.mainText}
        todayBackgroundColor='#00D2FF'
        selectedDayColor='#ED9526'
        selectedRangeEndTextStyle={style.boldText}
        customDayHeaderStyles={customDayHeaderStyles}
        dayLabelsWrapper={style.dayLabelsWrapper}
        selectedRangeEndStyle={style.selected}
        textStyle={style.mainText}
        customDateStyles={style.mainText}
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
    
    

module.exports = DatePicker
