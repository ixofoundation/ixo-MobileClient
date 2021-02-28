const
    React = require('react'),
    {useState} = React,
    {View, Text, TouchableHighlight, Modal} = require('react-native'),
    {get, keyBy, sortBy, filter} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Heading, Button, EntityFilter, Icon} = require('$/lib/ui')


const filterSpec = [{
    type: 'option',
    id: 'sortBy',
    title: 'Sort by',
    opts: [{
        value: 'title',
        title: 'Title',
    }, {
        value: 'startDate',
        title: 'Start Date',
    }],
}, {
    type: 'dateRange',
    id: 'dateRange',
    title: 'Date',
}]

const ClaimForms = ({projectDid}) => {
    const
        project = useProjects().items[projectDid],
        claimTemplates = get(project, 'data.entityClaims.items', []),
        claimTemplatesByDid = keyBy(claimTemplates, '@id'),
        [filterWidgetShown, toggleFilterWidget] = useState(false),
        [filters, setFilters] = useState({}),
        [focusedTplDid, setFocusedTpl] = useState(),
        tplFilter = t =>
            !filters.dateRange
                ? true
                : (
                    t.startDate >= filters.dateRange[0]
                    && t.endDate <= filters.dateRange[1]
                ),

        claimTemplatesFiltered =
            sortBy(filter(claimTemplates, tplFilter), filters.sortBy)

    return <MenuLayout><AssistantLayout>
        <Heading children='Available Claim Forms' />

        <Button
            text='Filter'
            type='outlined'
            prefix={<Icon name='filter' fill='#83D9F2' />}
            onPress={() => toggleFilterWidget(true)}
            style={{marginBottom: 20}}
        />

        {claimTemplatesFiltered.map(tpl =>
            <TouchableHighlight
                key={tpl['@id']}
                onPress={() => setFocusedTpl(tpl['@id'])}
            >
                <View>
                    <Text children={tpl.title} style={{fontWeight: 'bold'}} />
                    <Text children={tpl.description} />
                </View>
            </TouchableHighlight>,
        )}

        <Modal
            visible={filterWidgetShown}
            onRequestClose={() => toggleFilterWidget(false)}
            children={
                <EntityFilter
                    spec={filterSpec}
                    onCancel={() => toggleFilterWidget(false)}
                    onChange={filters => {
                        setFilters(filters)
                        toggleFilterWidget(false)
                    }}
                    initialValue={filters}
                />
            }
        />

        <Modal
            visible={!!focusedTplDid}
            onRequestClose={() => setFocusedTpl(null)}
            transparent
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                justifyContent: 'center',
            }}>
                <Text
                    children={
                        focusedTplDid &&
                            claimTemplatesByDid[focusedTplDid].title}

                    style={{padding: 10, backgroundColor: 'yellow'}}
                />

                <Button
                    text='Add to My Claim Forms List'
                    type='contained'
                    onPress={() => {}}
                />

                <Button
                    text='View Claim Activity'
                    type='contained'
                    onPress={() => {}}
                />

                <Button
                    text='Archive Claims'
                    type='contained'
                    onPress={() => {}}
                />

                <Button
                    text='Turn on Claim Notifications'
                    type='contained'
                    onPress={() => {}}
                />

                <Button
                    text='View Claim Form Template'
                    type='contained'
                    onPress={() => {}}
                />

                <Button
                    text='Make Claim'
                    type='contained'
                    onPress={() => {}}
                />
            </View>
        </Modal>
    </AssistantLayout></MenuLayout>
}


module.exports = ClaimForms
