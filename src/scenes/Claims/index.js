const Loadable = require('$/lib/ui/Loadable')
const {useNav} = require('$/lib/util')

const React = require('react'),
    {View, ScrollView, Text, StyleSheet} = require('react-native'),
    {useQuery} = require('react-query'),
    {keyBy, countBy, sortBy} = require('lodash-es'),
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
    const {items: projectsById, getProject, listClaims} = useProjects(),
        claimQuery = useQuery({
            queryKey: 'claimData',
            queryFn: async () => {
                const projectList = await Promise.all(
                        keys(projectsById).map((projDid) =>
                            Promise.all([
                                getProject(projDid),
                                listClaims(projDid).catch(() => []),
                            ]),
                        ),
                    ),
                    claimTemplates = projectList.flatMap(([proj]) =>
                        proj.data.entityClaims.items.map((tpl) => ({
                            ...tpl,
                            projectDid: proj.projectDid,
                            projectName: proj.data.name,
                        })),
                    ),
                    claims = projectList.flatMap(([proj, claimList]) => {
                        const projClaimsById = keyBy(
                            proj.data.claims,
                            'claimId',
                        )

                        return claimList.map((c) => ({
                            ...c,
                            projectName: proj.data.name,
                            status: projClaimsById[c.txHash].status,
                        }))
                    }),
                    claimsSorted = sortBy(claims, '-datetime'),
                    claimCountsByStatus = countBy(claims, 'status')

                return {
                    claimTemplates,
                    claims: claimsSorted,
                    claimCountsByStatus,
                }
            },
        })

    return (
        <AssistantLayout>
            <MenuLayout>
                <View style={style.root}>
                    <Header>
                        <Text style={style.title} children="Claims" />
                    </Header>
                    <Loadable
                        loading={claimQuery.isLoading}
                        error={claimQuery.error}
                        data={claimQuery.data}
                        render={ClaimTabs}
                    />
                </View>
            </MenuLayout>
        </AssistantLayout>
    )
}

const ClaimTabs = ({claims, claimCountsByStatus, claimTemplates}) => {
    const nav = useNav()
    const ws = useWallet()
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
                            did={'did:ixo:' + ws.agent.did}
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
