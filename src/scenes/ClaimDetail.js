const
    React = require('react'),
    {ActivityIndicator} = require('react-native'),
    {useQuery} = require('react-query'),
    {useProjects} = require('$/stores'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    {claimTemplateToFormSpec, ClaimFormSummary} = require('$/scenes/NewClaim'),
    {fromEntries} = Object


const ClaimDetail = ({projectDid, claimId}) => {
    const
        {listClaims, getTemplate} = useProjects(),

        claimQuery =
            useQuery(['claimAndFormSpec', claimId], async () => {
                const
                    claimList = await listClaims(projectDid),
                    claim = claimList.find(c => c.txHash === claimId),
                    tpl = await getTemplate(claim.claimTemplateId),
                    formSpec = claimTemplateToFormSpec(tpl.data.page.content)

                return {claim, formSpec}
            })

    return <AssistantLayout><MenuLayout>
        {!claimQuery.isSuccess
            ? <ActivityIndicator color='black' size='large' />

            : <ClaimFormSummary
                editable={false}
                formSpec={claimQuery.data.formSpec}
                formState={fromEntries(
                    claimQuery.data.claim.items
                        .map(({id, value}) => [
                            id,
                            value,
                        ]),
                )}
            />}
    </MenuLayout></AssistantLayout>
}


module.exports = ClaimDetail
