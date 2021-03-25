const React = require('react'),
    {useContext} = React,
    {View, ScrollView,
        Text, StyleSheet, ActivityIndicator} = require('react-native'),
    {useQuery} = require('react-query'),
    {NavigationContext} = require('navigation-react'),
    {keyBy, countBy} = require('lodash-es'),
    moment = require('moment'),
    {useWallet, useProjects} = require('$/stores'),
    {Tabs, Tab, Header, P} = require('$/lib/ui'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    Claim = require('./Claim'),
    ClaimListHeader = require('./ClaimListHeader'),
    ClaimActivity = require('./ClaimActivity'),
    ClaimTpl = require('$/scenes/ClaimForms/ClaimTpl'),
    {spacing, fontSizes} = require('$/theme'),
    {keys} = Object


const Claims = () => {
    const
        ws = useWallet(),
        {items: projectsById, getProject, listClaims} = useProjects(),
        {stateNavigator: nav} = useContext(NavigationContext),

        claimQuery = useQuery({
            queryKey: 'claimData',
            enabled: keys(projectsById).length > 0,
            queryFn: async () => {
                const
                    projectList =
                        await Promise.all(keys(projectsById).map(projDid =>
                            Promise.all([
                                getProject(projDid),
                                listClaims(projDid).catch(() => []),
                            ]),
                        )),

                    claimTemplates =
                        projectList.flatMap(([proj]) =>
                            proj.data.entityClaims.items.map(tpl => ({
                                ...tpl,
                                projectDid: proj.projectDid,
                                projectName: proj.data.name,
                            })),
                        ),

                    claims =
                        projectList.flatMap(([proj, claimList]) => {
                            const projClaimsById =
                                keyBy(proj.data.claims, 'claimId')

                            return claimList.map(c => ({
                                ...c,
                                projectName: proj.data.name,
                                status: projClaimsById[c.txHash].status,
                            }))
                        }),

                    claimCountsByStatus = countBy(claims, 'status')

                return {claimTemplates, claims, claimCountsByStatus}
            },
        })

    return <AssistantLayout><MenuLayout><View style={style.root}>
        <Header>
            <Text
                style={style.title}
                children='Claims'
            />
        </Header>

        {!claimQuery.isSuccess
            ? <ActivityIndicator size='large' color='black' />

            : <Tabs>
                <Tab title='Activity'>
                    <ClaimActivity
                        submitted={claimQuery.data.claims.length}
                        pending={claimQuery.data.claimCountsByStatus[0]}
                        approved={claimQuery.data.claimCountsByStatus[1]}
                        disputed={claimQuery.data.claimCountsByStatus[2]}
                        rejected={claimQuery.data.claimCountsByStatus[3]}
                    />
                </Tab>

                <Tab title='Submitted'>
                    <ScrollView>
                        <ClaimListHeader title='Submitted claims' />

                        {claimQuery.data.claims.map(c =>
                            <Claim
                                key={c.txHash}
                                name={
                                    c.projectName
                                    + ' / '
                                    + moment(c.created).format('MMM D')
                                }
                                did={'did:ixo:' + ws.agent.did}
                                savedAt={c.created}
                                status={c.status}
                                onPress={() => nav.navigate('claim-detail', {
                                    projectDid: c.projectDid,
                                    claimId: c.txHash,
                                })}
                            />,
                        )}
                    </ScrollView>
                </Tab>

                <Tab title='New'>
                    <ClaimListHeader title='Claim Templates' />

                    <P
                        children=
                            'Select a claim template to create a claim from:'
                        style={{paddingTop: 0}}
                    />

                    {claimQuery.data.claimTemplates.map(t =>
                        <ClaimTpl
                            key={t['@id']}
                            name={t.title}
                            description={t.description}
                            startDate={t.startDate}
                            endDate={t.endDate}
                            onPress={() => nav.navigate('new-claim', {
                                projectDid: t.projectDid,
                                templateDid: t['@id'],
                            })}
                        />,
                    )}
                </Tab>
            </Tabs>}
    </View></MenuLayout></AssistantLayout>
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
