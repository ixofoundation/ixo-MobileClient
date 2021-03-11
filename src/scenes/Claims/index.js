const React = require('react'),
    {useState} = React,
    {View, Text, StyleSheet} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Tabs = require('$/lib/ui/Tabs'),
    Tab = require('$/lib/ui/Tabs/Tab'),
    Badge = require('$/lib/ui/Badge'),
    Modal = require('$/lib/ui/Modal'),
    Header = require('$/lib/ui/Header'),
    AssistantLayout = require('$/AssistantLayout'),
    Claim = require('./Claim'),
    ClaimListHeader = require('./ClaimListHeader'),
    ClaimActions = require('./ClaimActions'),
    {spacing, fontSizes} = require('$/theme')

const Claims = () => {
    const claimItems = [1, 2, 3]
    const [activeClaim, setActiveClaim] = useState(null)
    const [claimActivity, setClaimActivity] = useState(null)
    return <AssistantLayout><View style={style.root}>
        <Header>
            <Icon name='dotsVertical' width={24} fill='white'/>
            <Text 
                style={style.title}
            >
                Claims
            </Text>
            <Icon name='dotsVertical' width={24} fill='white'/>
        </Header>
        <Tabs>
            <Tab title='New Claim'>
                <ClaimListHeader
                    title='New Claims' 
                    onFilterPress={console.log}
                />
                {claimItems.map((i) => 
                    <Claim
                        key={'claim-' + i}
                        name='Claim/Project Name'
                        did='did:sov:RFWuuFmLvNd8uq9x5sUYku'
                        savedAt={new Date()}
                        highlight='#85AD5C'
                        onPress={() => setActiveClaim({})}
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
        <Modal visible={!!activeClaim} transparent>
            <ClaimActions 
                onClose={() => setActiveClaim(null)}
            />
        </Modal>
    </View></AssistantLayout>
}

const style = StyleSheet.create({
    root: {flex: 1},
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    tabBadge: {marginLeft: spacing(.5)},
})

module.exports = Claims