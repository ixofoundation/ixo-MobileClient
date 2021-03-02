const
    React = require('react'),
    {useCallback} = React,
    {View} = require('react-native'),
    FileViewer = require('react-native-file-viewer').default,
    {selectFile} = require('$/lib/util'),
    Button = require('./Button')


const DocumentInput = ({value, onChange}) => {
    const selectImage = useCallback(async () => {
        const file = await selectFile('allFiles')

        if (file)
            onChange(file)
    })

    return <View>
        {value &&
            <Button
                type='contained'
                text={value.name + ': ' + value.type}
                onPress={() => FileViewer.open(value.uri)}
            />}

        <Button
            type='contained'
            text='Select Document'
            onPress={selectImage}
        />
    </View>
}


module.exports = DocumentInput
