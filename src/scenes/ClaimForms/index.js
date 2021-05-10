const React = require('react'),
    {useState, useContext} = React,
    {View, Text, StyleSheet} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {get, keyBy, sortBy, filter} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Modal, Header, Button, EntityFilter, Icon} = require('$/lib/ui'),
    ClaimTplListHeader = require('./ClaimTplListHeader'),
    ClaimTpl = require('./ClaimTpl'),
    ClaimTplActions = require('./ClaimTplActions'),
    {spacing, fontSizes} = require('$/theme')

const {inspect} = require('util')

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
    const {stateNavigator: nav} = useContext(NavigationContext),
        project = useProjects().items[projectDid],
        claimTemplates = get(project, 'data.entityClaims.items', []),
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
                <View style={style.root}>
                    <ClaimTplListHeader
                        title="Available Claim Forms"
                        onFilterPress={() => toggleFilterWidget(true)}
                    />

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
                </View>
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
