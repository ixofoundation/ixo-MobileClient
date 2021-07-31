const React = require('react'),
    {useQuery} = require('react-query'),
    {getClient} = require('$/ixoCli'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    Loadable = require('$/lib/ui/Loadable'),
    {claimTemplateToFormSpec, ClaimFormSummary} = require('$/scenes/NewClaim'),
    {fromEntries} = Object


const ClaimDetail = ({projectDid, claimId}) => {
    const
        ixoCli = getClient(),

        claimsQuery = useQuery({
            queryKey: ['claims', {projectDid}],
            queryFn: () => ixoCli.listClaims(projectDid),
        }),

        claim =
            claimsQuery.isSuccess &&
                claimsQuery.data.find(c => c.txHash === claimId),

        tplQuery = useQuery({
            enabled: Boolean(claim),
            queryKey: ['template', claim.claimTemplateId],
            queryFn: () => ixoCli.getTemplate(claim.claimTemplateId),
        }),

        formSpec =
            tplQuery.isSuccess &&
                claimTemplateToFormSpec(tplQuery.data.data.page.content)

    return (
        <AssistantLayout>
            <MenuLayout>
                <Loadable
                    loading={claimsQuery.isLoading || tplQuery.isLoading}
                    error={claimsQuery.error || tplQuery.error}
                    data={{claim, formSpec}}
                    render={({claim, formSpec}) => (
                        <ClaimFormSummary
                            editable={false}
                            formSpec={formSpec}
                            formState={fromEntries(
                                claim.items.map(({id, value}) => [id, value]))}
                        />
                    )}
                />
            </MenuLayout>
        </AssistantLayout>
    )
}


module.exports = ClaimDetail
