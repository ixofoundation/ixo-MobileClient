const React = require('react'),
    {View, ScrollView, Text, StyleSheet, Pressable} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Button = require('$/lib/ui/Button'),
    Card = require('$/lib/ui/Card'),
    Highlight = require('$/lib/ui/Highlight'),
    Header = require('$/lib/ui/Header'),
    Statistic = require('$/lib/ui/Statistic'),
    ClaimPayment = require('./ClaimPayment'),
    {spacing, fontSizes} = require('$/theme')


const ClaimActivity = ({
    onClose,
    dateRange,
    submitted = 0,
    total,
    approved = 0,
    pending = 0,
    disputed = 0,
    rejected = 0,
}) => {
    const payments = [1, 2, 3]

    return <ScrollView style={style.root}>
        <View style={style.content}>
            <View style={style.titleContainer}>
                <View style={style.title}>
                    <Text style={style.titleText}>
                        Claim Activity
                    </Text>

                    {dateRange &&
                        <Text
                            style={style.dateRange}
                            children={dateRange}
                        />}
                </View>

                {/*<View style={style.icons}>
                    <Icon name='web' fill='#00D2FF' />
                    <Space />
                    <Icon name='web' fill='#00D2FF'/>
                </View>*/}
            </View>

            <Card style={style.statsContainer}>
                <Highlight color='#00D2FF'/>
                <View style={style.progressData}>
                    <Text style={style.progress}>{submitted}</Text>

                    {total && <Text style={style.target}>/{total}</Text>}
                </View>

                <Text style={style.submitted}>Submitted</Text>
            </Card>

            <View style={style.statRow}>
                <Statistic label='Approved' value={approved} highlight='#85AD5C'/>
                <Space />
                <Statistic label='Pending' value={pending} highlight='#ED9526'/>
            </View>

            <View style={style.statRow}>
                <Statistic label='Disputed' value={disputed} highlight='#AD245C'/>
                <Space />
                <Statistic label='Rejected' value={rejected} highlight='#E2223B'/>
            </View>

            {/*
            <Text children='My Claim Payments' style={style.paymentTitle} />

            <View>{payments.map(i =>
                <ClaimPayment
                    key={i}
                    count={10}
                    amount={230}
                    currency='eEUR'
                    status='pending'
                />
            )}</View>
            */}
        </View>
    </ScrollView>
}


const Space = () => <View style={style.space}/>

const style = StyleSheet.create({
    root: {flex: 1, backgroundColor: '#012D42'},
    redBtn: {
        backgroundColor: '#A11C43', 
        borderRadius: 24, 
        padding: 0,
    },
    redBtnText: {color: 'white'},
    name: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    content: {flex: 1, paddingHorizontal: spacing(2)},
    titleContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    titleText: {
        color: 'white', 
        fontSize: fontSizes.h4, 
        marginBottom: spacing(.5),
    },
    title: {marginVertical: spacing(2)},
    dateRange: {color: '#83D9F2', fontSize: fontSizes.caption},
    icons: {flexDirection: 'row'},
    space: {marginLeft: spacing(2)},
    statsContainer: {marginBottom: spacing(2)},
    paymentTitle: {
        color: 'white',
        fontSize: fontSizes.h6,
        marginBottom: spacing(2),
    },
    progressData: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {color: 'white', fontSize: fontSizes.h4},
    target: {color: '#83D9F2', fontSize: fontSizes.h4},
    submitted: {color: '#83D9F2', fontSize: fontSizes.p1, alignSelf: 'center'},
    statRow: {flexDirection: 'row', marginBottom: spacing(2)},
})

module.exports = ClaimActivity
