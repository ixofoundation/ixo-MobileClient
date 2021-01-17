const {makeBlocksyncClient, makeBlockchainClient} = require('@ixo/client-sdk')


module.exports = {
    sync: makeBlocksyncClient(process.env.BLOCKSYNC_URL),
    chain: makeBlockchainClient(process.env.BLOCKCHAIN_URL),
}
