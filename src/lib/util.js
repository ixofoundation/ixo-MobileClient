const
    {Platform, PermissionsAndroid} = require('react-native'),
    DocumentPicker = require('react-native-document-picker').default,
    {readFile} = require('react-native-fs'),
    ms = require('ms'),
    retry = require('async-retry')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


// @param allowedTypes: array of following values:
//     "allFiles" | "images" | "plainText" | "audio" | "pdf" | "zip" | "csv" |
//     "doc" | "docx" | "ppt" | "pptx" | "xls" | "xlsx"
//
const selectFile = async (allowedTypes = ['allFiles'], {multi = false} = {}) =>{
    if (typeof allowedTypes=== 'string')
        allowedTypes = [allowedTypes]

    try {
        const doc = await DocumentPicker[multi ? 'pickMultiple' : 'pick']({
            type: allowedTypes.map(t => DocumentPicker.types[t]),
        })

        return doc

    } catch (err) {
        if (DocumentPicker.isCancel(err))
            return null
        else
            throw err
    }
}


const getAndroidPermission = async (permName, opts) => {
    if (Platform.OS !== 'android')
        return

    const result =
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS[permName],
            opts,
        )

    if (result !== PermissionsAndroid.RESULTS.GRANTED)
        throw null

    return
}


const fileToDataURL = async (uri, type) =>
    'data:' + type + ';base64,' + (await readFile(uri, 'base64'))


const pollFor = ({interval = '1s', timeout = '10s', query, predicate}) =>
    retry(async () => {
        const resp = await query()

        if (!predicate(resp))
            throw resp

        return resp
    }, {
        minTimeout: ms(interval),
        factor: 1,
        retries: Math.min(ms(timeout) / ms(interval)),
    })


module.exports = {
    sleep,
    selectFile,
    getAndroidPermission,
    fileToDataURL,
    pollFor,
}
