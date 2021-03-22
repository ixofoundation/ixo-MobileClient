const React = require('react'),
    {View, Text, StyleSheet, Pressable} = require('react-native'),
    AssistantLayout = require('$/AssistantLayout'),
    Icon = require('$/lib/ui/Icon'),
    Button = require('$/lib/ui/Button'),
    Card = require('$/lib/ui/Card'),
    Highlight = require('$/lib/ui/Highlight'),
    Header = require('$/lib/ui/Header'),
    Statistic = require('$/lib/ui/Statistic'),
    ClaimPayment = require('./ClaimPayment'),
    {spacing, fontSizes} = require('$/theme')
const {ScrollView} = require('react-native-gesture-handler')


const ClaimActivity = ({onClose, name}) => {
    const payments = [1, 2, 3]
    return <AssistantLayout><View style={style.root}>
        <Header>
            <Pressable onPress={onClose}>
                <Icon name='close' width={24} fill='white'/>
            </Pressable>
            <Text 
                style={style.name}
                children={name}
            />
            <Button 
                text='5'
                type='contained'
                suffix={<Icon name='autoRenew' fill='white'/>}
                style={style.redBtn}
                textStyle={style.redBtnText}
            />
        </Header>
        <View style={style.content}>
            <View 
                style={style.titleContainer}
            >
                <View style={style.title}>
                    <Text style={style.titleText}>
                        Claim Activity
                    </Text>
                    <Text style={style.dateRange}>
                        12/10/2020 - 31/12/2020
                    </Text>
                </View>
                <View style={style.icons}>
                    <Icon name='web' fill='#00D2FF' />
                    <Space />
                    <Icon name='web' fill='#00D2FF'/>
                </View>
            </View>

            <Card style={style.statsContainer}>
                <Highlight color='#00D2FF'/>
                <View style={style.progressData}>
                    <Text style={style.progress}>43</Text>
                    <Text style={style.target}>/300</Text>
                </View>
                <Text style={style.submitted}>Submitted</Text>
            </Card>
            <View style={style.statRow}>
                <Statistic label='Approved' value={40} highlight='#85AD5C'/>
                <Space />
                <Statistic label='Pending' value={23} highlight='#ED9526'/>
            </View>
            <View style={style.statRow}>
                <Statistic label='Disputed' value={0} highlight='#AD245C'/>
                <Space />
                <Statistic label='Rejected' value={10} highlight='#E2223B'/>
            </View>

            <Text style={style.paymentTitle}>
                My Claim Payments
            </Text>
            <ScrollView>
                {payments.map(i => <ClaimPayment
                    key={i}
                    count={10}
                    amount={230}
                    currency='eEUR'
                    status='pending'
                />)}
            </ScrollView>
        </View>
    </View></AssistantLayout>
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
