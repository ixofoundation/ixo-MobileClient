const
    {Platform, PermissionsAndroid} = require('react-native'),
    DocumentPicker = require('react-native-document-picker').default

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


module.exports = {
    sleep,
    selectFile,
    getAndroidPermission,
}
