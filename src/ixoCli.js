// Singleton ixo client

const {makeClient} = require('@ixo/client-sdk')


let client

const setClient = signer => {
    client = makeClient(signer, {dashifyUrls: true})

    return client
}

const getClient = () => client

setClient()


module.exports = {setClient, getClient}
