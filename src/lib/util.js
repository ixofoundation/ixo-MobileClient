const {useContext, useState, useEffect, useCallback} = require('react'),
    {Platform, PermissionsAndroid} = require('react-native'),
    DocumentPicker = require('react-native-document-picker').default,
    {readFile} = require('react-native-fs'),
    ms = require('ms'),
    retry = require('async-retry'),
    {NavigationContext} = require('navigation-react'),
    keychain = require('react-native-keychain')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// @param allowedTypes: array of following values:
//     "allFiles" | "images" | "plainText" | "audio" | "pdf" | "zip" | "csv" |
//     "doc" | "docx" | "ppt" | "pptx" | "xls" | "xlsx"
//
const selectFile = async (
    allowedTypes = ['allFiles'],
    {multi = false} = {},
) => {
    if (typeof allowedTypes === 'string') allowedTypes = [allowedTypes]

    try {
        const doc = await DocumentPicker[multi ? 'pickMultiple' : 'pick']({
            type: allowedTypes.map((t) => DocumentPicker.types[t]),
        })

        return doc
    } catch (err) {
        if (DocumentPicker.isCancel(err)) return null
        else throw err
    }
}

const getAndroidPermission = async (permName, opts) => {
    if (Platform.OS !== 'android') return

    const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS[permName],
        opts,
    )

    if (result !== PermissionsAndroid.RESULTS.GRANTED) throw null

    return
}

const fileToDataURL = async (uri, type) =>
    'data:' + type + ';base64,' + (await readFile(uri, 'base64'))

const pollFor = ({interval = '1s', timeout = '10s', query, predicate}) =>
    retry(
        async () => {
            const resp = await query()

            if (!predicate(resp)) throw resp

            return resp
        },
        {
            minTimeout: ms(interval),
            factor: 1,
            retries: Math.min(ms(timeout) / ms(interval)),
        },
    )

const useNav = () => {
    const {stateNavigator: nav} = useContext(NavigationContext)
    return nav
}

const validatorAvatarUrl = async identity => {
    try {
        const
            kbFetch = path =>
                fetch('https://keybase.io/_/api/1.0' + path)
                    .then(resp =>
                        resp.ok ? resp.json() : Promise.reject(resp)),

            {keys: [{key_fingerprint}]}
                = await kbFetch('/key/fetch.json?pgp_key_ids=' + identity),

            {them: [{pictures: {primary: {url}}}]}
                = await kbFetch(
                    '/user/lookup.json?key_fingerprint=' + key_fingerprint)

        return url
    } catch (e) {
        return null
    }
}

const keychainStorage = {
    getItem: key =>
        keychain.getGenericPassword({service: key})
            .then(({password}) => password),

    setItem: (key, value) =>
        keychain.setGenericPassword('ixouser', value, {service: key}),
}


module.exports = {
    sleep,
    selectFile,
    getAndroidPermission,
    fileToDataURL,
    pollFor,
    useNav,
    validatorAvatarUrl,
    keychainStorage,
}
