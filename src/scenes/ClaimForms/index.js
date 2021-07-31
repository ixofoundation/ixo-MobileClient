const React = require('react'),
    {useState, useContext} = React,
    {ScrollView, StyleSheet, SafeAreaView} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {get, keyBy, sortBy, filter} = require('lodash-es'),
    {useQuery} = require('react-query'),
    {getClient} = require('$/ixoCli'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Modal, EntityFilter} = require('$/lib/ui'),
    ClaimTplListHeader = require('./ClaimTplListHeader'),
    ClaimTpl = require('./ClaimTpl'),
    ClaimTplActions = require('./ClaimTplActions'),
    {fontSizes} = require('$/theme')

const filterSpec = [
    {
        type: 'option',
        id: 'sortBy',
        title: 'Sort by',
        opts: [
            {
                value: 'title',
                title: 'Title',
            },
            {
                value: 'startDate',
                title: 'Start Date',
            },
        ],
    },
    {
        type: 'dateRange',
        id: 'dateRange',
        title: 'Date',
    },
]

const ClaimForms = ({projectDid}) => {
    const
        {stateNavigator: nav} = useContext(NavigationContext),

        ixoCli = getClient(),

        projectQuery = useQuery({
            queryKey: ['project', projectDid],
            queryFn: () => ixoCli.getProject(projectDid),
        }),

        claimTemplates =
            projectQuery.isSuccess
                ? get(projectQuery.data, 'data.entityClaims.items', [])
                : [],
        claimTemplatesByDid = keyBy(claimTemplates, '@id'),

        [filterWidgetShown, toggleFilterWidget] = useState(false),
        [filters, setFilters] = useState({}),
        [focusedTplDid, setFocusedTpl] = useState(),

        tplFilter = (t) =>
            !filters.dateRange
                ? true
                : t.startDate >= filters.dateRange[0] &&
                  t.endDate <= filters.dateRange[1],

        claimTemplatesFiltered = sortBy(
            filter(claimTemplates, tplFilter),
            filters.sortBy,
        )

    return (
        <MenuLayout>
            <AssistantLayout>
                <SafeAreaView style={style.root}>
                    <ClaimTplListHeader
                        title="Available Claim Forms"
                        onFilterPress={() => toggleFilterWidget(true)}
                    />
                    <ScrollView>
                        {claimTemplatesFiltered.map((tpl) => (
                            <ClaimTpl
                                key={'claim-' + tpl['@id']}
                                name={tpl.title}
                                description={tpl.description}
                                startDate={tpl.startDate}
                                endDate={tpl.endDate}
                                onPress={() => setFocusedTpl(tpl['@id'])}
                            />
                        ))}
                    </ScrollView>

                    <Modal
                        visible={filterWidgetShown}
                        onRequestClose={() => toggleFilterWidget(false)}
                        children={
                            <EntityFilter
                                spec={filterSpec}
                                onCancel={() => toggleFilterWidget(false)}
                                onChange={(filters) => {
                                    setFilters(filters)
                                    toggleFilterWidget(false)
                                }}
                                initialValue={filters}
                            />
                        }
                    />

                    <Modal visible={!!focusedTplDid} transparent>
                        <ClaimTplActions
                            onClose={() => setFocusedTpl(null)}
                            onNavigate={(...args) => {
                                setFocusedTpl(null)
                                nav.navigate(...args)
                            }}
                            projectDid={projectDid}
                            claimTpl={claimTemplatesByDid[focusedTplDid]}
                        />
                    </Modal>
                </SafeAreaView>
            </AssistantLayout>
        </MenuLayout>
    )
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#022231',
        flex: 1,
    },
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
})

module.exports = ClaimForms
