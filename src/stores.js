const {makeSecurePersistentStore} = require('$/lib/store')


const useId = makeSecurePersistentStore('Id', set => ({
    id: null,
    clear: () => set({id: null}),
    set,
}))


module.exports = {
    useId,
}
