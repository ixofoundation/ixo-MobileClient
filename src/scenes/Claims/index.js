
const React = require('react'),
    {useMemo} = require('react'),
    {View, ScrollView, Text, StyleSheet} = require('react-native'),
    {useQueries} = require('react-query'),
    {keyBy, countBy, sortBy} = require('lodash-es'),
    moment = require('moment'),
    {getClient} = require('$/ixoCli'),
    {getWallet} = require('$/wallet'),
    {useProjects} = require('$/stores'),
    {Tabs, Tab, Header, P} = require('$/lib/ui'),
    Loadable = require('$/lib/ui/Loadable'),
    {useNav} = require('$/lib/util'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    Claim = require('./Claim'),
    ClaimListHeader = require('./ClaimListHeader'),
    ClaimActivity = require('./ClaimActivity'),
    ClaimTpl = require('$/scenes/ClaimForms/ClaimTpl'),
    {spacing, fontSizes} = require('$/theme')


const Claims = () => {
    const
        ixoCli = getClient(),

        {items: projDids} = useProjects(),

        projectQueries = useQueries(projDids.map(projDid => ({
            queryKey: ['projects', projDid],
            queryFn:  () => ixoCli.getProject(projDid),
        }))),

        claimQueries = useQueries(projDids.map(projDid => ({
            queryKey: ['claims', {projectDid: projDid}],
            queryFn: () => ixoCli.listClaims(projDid).catch(() => []),
        }))),

        isLoading =
            projectQueries.some(q => q.isLoading)
            || claimQueries.some(q => q.isLoading),

        error =
            projectQueries.find(q => q.error)
            || claimQueries.find(q => q.error),

        {
            claimTemplates = [],
            claims = [],
            claimCountsByStatus = {0: 0, 1: 0, 2: 0, 3: 0},
        } =
            // Compute only after all queries are successfully loaded:
            useMemo(
                () =>
                    isLoading
                        ? {}
                        : computeClaimData(projectQueries, claimQueries),

                [isLoading],
            )

    return (
        <AssistantLayout>
            <MenuLayout>
                <View style={style.root}>
                    <Header>
                        <Text style={style.title} children="Claims" />
                    </Header>
                    <Loadable
                        loading={isLoading}
                        error={error}
                        data={{claimTemplates, claims, claimCountsByStatus}}
                        render={ClaimTabs}
                    />
                </View>
            </MenuLayout>
        </AssistantLayout>
    )
}

const computeClaimData = (projectQueries, claimQueries) => {
    const
        projects =
            projectQueries
                .filter(q => q.isSuccess)
                .map(q => q.data),

        claims =
            claimQueries
                .filter(q => q.isSuccess)
                .flatMap(q => q.data),

        projectsByDid =
            keyBy(projects, 'projectDid'),

        projectClaimsById =
            keyBy(
                projects.flatMap(p => p.data.claims),
                'claimId',
            ),

        claimTemplates =
            projects.flatMap(proj =>
                proj.data.entityClaims.items.map(tpl => ({
                    ...tpl,
                    projectDid: proj.projectDid,
                    projectName: proj.data.name,
                })),
            ),

        claimsEnrichedSorted =
            claims
                .map(claim => ({
                    ...claim,
                    projectName: projectsByDid[claim.projectDid].data.name,
                    status: projectClaimsById[claim.txHash].status,
                }))
                .sort((a, b) => b.dateTime.localeCompare(a.dateTime)),

        claimCountsByStatus = countBy(claims, 'status')

    return {
        claimTemplates,
        claims: claimsEnrichedSorted,
        claimCountsByStatus,
    }
}

const ClaimTabs = ({claims, claimCountsByStatus, claimTemplates}) => {
    const nav = useNav()
    const wallet = getWallet()
    return (
        <Tabs>
            <Tab title="Activity">
                <ClaimActivity
                    submitted={claims.length}
                    pending={claimCountsByStatus[0]}
                    approved={claimCountsByStatus[1]}
                    disputed={claimCountsByStatus[2]}
                    rejected={claimCountsByStatus[3]}
                />
            </Tab>

            <Tab title="Submitted">
                <ScrollView>
                    <ClaimListHeader title="Submitted claims" />

                    {claims.map((c) => (
                        <Claim
                            key={c.txHash}
                            name={
                                c.projectName +
                                ' / ' +
                                moment(c._created).format('MMM D')
                            }
                            did={wallet.agent.did}
                            savedAt={c._created}
                            status={c.status}
                            onPress={() =>
                                nav.navigate('claim-detail', {
                                    projectDid: c.projectDid,
                                    claimId: c.txHash,
                                })
                            }
                        />
                    ))}
                </ScrollView>
            </Tab>

            <Tab title="New">
                <ClaimListHeader title="Claim Templates" />

                <P
                    children="Select a claim template to create a claim from:"
                    style={{paddingTop: 0}}
                />

                {claimTemplates.map((t) => (
                    <ClaimTpl
                        key={t['@id']}
                        name={t.title}
                        description={t.description}
                        startDate={t.startDate}
                        endDate={t.endDate}
                        onPress={() =>
                            nav.navigate('new-claim', {
                                projectDid: t.projectDid,
                                templateDid: t['@id'],
                            })
                        }
                    />
                ))}
            </Tab>
        </Tabs>
    )
}

const style = StyleSheet.create({
    root: {flex: 1},
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    tabBadge: {marginLeft: spacing(0.5)},
})


module.exports = Claims
