const
    {makeSecurePersistentStore, makePersistentStore} = require('$/lib/store')


const useId = makeSecurePersistentStore('Id', set => ({
    id: null,
    clear: () => set({id: null}),
    set,
}))


const useProjects = makePersistentStore('projects', set => ({
    items: {/* [projId]: projRecord, ... */},

    add: (projDid, projRec) => set(({items}) => { items[projDid] = projRec }),

    rm: projDid => set(({items}) => delete items[projDid]),
}))


module.exports = {
    useId,
    useProjects,
}
