const {makeSecurePersistentStore} = require('$/lib/store')


const useId = makeSecurePersistentStore('Id', set => ({
    id: null,
    set,
}))


module.exports = {
    useId,
}
