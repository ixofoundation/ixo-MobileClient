const Loadable = require('$/lib/ui/Loadable')

const React = require('react'),
    {useQuery} = require('react-query'),
    {useProjects} = require('$/stores'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    {claimTemplateToFormSpec, ClaimFormSummary} = require('$/scenes/NewClaim'),
    {fromEntries} = Object

const ClaimDetail = ({projectDid, claimId}) => {
    const {listClaims, getTemplate} = useProjects(),
        claimQuery = useQuery(['claimAndFormSpec', claimId], async () => {
            const claimList = await listClaims(projectDid),
                claim = claimList.find((c) => c.txHash === claimId),
                tpl = await getTemplate(claim.claimTemplateId),
                formSpec = claimTemplateToFormSpec(tpl.data.page.content)

            return {claim, formSpec}
        })

    return (
        <AssistantLayout>
            <MenuLayout>
                <Loadable
                    loading={claimQuery.isLoading}
                    error={claimQuery.error}
                    data={claimQuery.data}
                    render={(data) => (
                        <ClaimFormSummary
                            editable={false}
                            formSpec={data.formSpec}
                            formState={fromEntries(
                                data.claim.items.map(({id, value}) => [
                                    id,
                                    value,
                                ]),
                            )}
                        />
                    )}
                />
            </MenuLayout>
        </AssistantLayout>
    )
}

module.exports = ClaimDetail
