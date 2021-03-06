const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Tabs = require('$/lib/ui/Tabs'),
    Tab = require('$/lib/ui/Tabs/Tab'),
    Badge = require('$/lib/ui/Badge'),
    AssistantLayout = require('$/AssistantLayout'),
    Claim = require('./Claim'),
    ClaimListHeader = require('./ClaimListHeader'),
    {spacing, fontSizes} = require('$/theme')

const Claims = () => {
    const claimItems = [1, 2, 3]
    return <AssistantLayout><View style={style.root}>
        <View style={style.header}>
            <Icon name='dotsVertical' width={24} fill='white'/>
            <Text 
                style={style.title}
            >
                Claims
            </Text>
            <Icon name='dotsVertical' width={24} fill='white'/>
        </View>
        <Tabs>
            <Tab title='New Claim'>
                <ClaimListHeader
                    title='New Claims' 
                    onFilterPress={console.log}
                />
                {claimItems.map(() => 
                    <Claim
                        name='Claim/Project Name'
                        did='did:sov:RFWuuFmLvNd8uq9x5sUYku'
                        savedAt={new Date()}
                        highlight='#85AD5C'
                    />,
                )}
            </Tab>
            <Tab 
                title='Saved' 
                suffix={
                    <Badge 
                        color='#AD245C' 
                        text='5' 
                        style={style.tabBadge}/>
                }
            >
                <Text>Tab 2</Text>
            </Tab>
            <Tab title='Submitted'>
                <Text>Tab 3</Text>
            </Tab>
        </Tabs> 
    </View></AssistantLayout>
}



const style = StyleSheet.create({
    root: {flex: 1},
    header: {
        padding: spacing(2),
        flexDirection: 'row',
        backgroundColor: '#002233',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    tabBadge: {marginLeft: spacing(.5)},
})

module.exports = Claims