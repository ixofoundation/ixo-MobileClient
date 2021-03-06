const
    React = require('react'),
    {Text, Pressable, StyleSheet, View} = require('react-native'),
    theme = require('$/theme')



const colorTypes = {
    primary: 'primary',
    secondary: 'secondary',
}

const containerTypes = {
    contained: 'contained',
    outlined: 'outlined',
    text: 'text',
}

const sizes = {
    md: 'md',
    sm: 'sm',
    lg: 'lg',
}

const Button = ({
    text, 
    size = 'md', 
    color = 'primary',
    type = 'text',
    onPress,
    prefix,
    suffix,
    style: overrideStyles, 
    textStyle,
    ...props
}) => {

    const btnStyle = StyleSheet.compose(
        [
            buttonStyles.root, 
            buttonStyles[sizes[size] || sizes.md],
            buttonStyles[colorTypes[color] || colorTypes.primary],
            buttonStyles[containerTypes[type] || containerTypes.text],
            overrideStyles,
        ],
    )
    const txtStyle = StyleSheet.compose(
        [
            textStyles.root, 
            textStyles[sizes[size] || sizes.md],
            textStyles[type + '_' + color] || 
                textStyles[colorTypes[color] || colorTypes.primary],
            textStyle,
        ],
    )
    
    return <Pressable
        onPress={onPress}
        style={btnStyle}
        children={
            <View style={textStyles.content}>
                {prefix}
                <Text style={txtStyle} children={text} />
                {suffix}
            </View>
        }
        {...props}
    />
}


const buttonStyles = StyleSheet.create({
    root: {
        borderRadius: 4,
    },
    sm: {
        padding: theme.spacing(.5),
    },
    md: {
        padding: theme.spacing(1),
    },
    lg: {
        padding: theme.spacing(1.5),
    },
    contained: {
        borderWidth: 0,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
    },
    text: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    primary: {
        backgroundColor: '#83D9F2',
        borderColor: '#83D9F2',
    },
    secondary: {
        backgroundColor: '#002D42',
        borderColor: '#002D42',
    },
})

const textStyles = StyleSheet.create({
    root: {
        marginHorizontal: theme.spacing(1),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sm: {
        fontSize: theme.fontSizes.button - 4,
    },
    md: {
        fontSize: theme.fontSizes.button,
    },
    lg: {
        fontSize: theme.fontSizes.button + 4,
    },
    primary: {
        color: 'black',
    },
    secondary: {
        color: 'white',
    },
    outlined_primary: {
        color: '#83D9F2',
    },
    outlined_secondary: {
        color: '#002D42',
    },
})

module.exports = Button
