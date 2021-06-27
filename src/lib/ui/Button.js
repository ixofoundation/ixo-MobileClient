const React = require('react'),
    {Text, Pressable, StyleSheet, View} = require('react-native'),
    {memoize} = require('lodash-es'),
    theme = require('$/theme')

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
    children,
    ...props
}) => {
    const s = style({size, type, color})
    return (
        <Pressable
            onPress={onPress}
            style={StyleSheet.compose(s.button, overrideStyles)}
            children={
                <View style={s.textWrapper}>
                    {prefix}
                    {text && (
                        <Text
                            style={StyleSheet.compose(s.text, textStyle)}
                            children={text}
                        />
                    )}
                    {children}
                    {suffix}
                </View>
            }
            {...props}
        />
    )
}

const style = memoize(({size, type, color}) =>
    StyleSheet.create({
        button: {
            borderWidth: {contained: 0, outlined: 1, text: 0}[type],
            borderColor: {primary: '#83D9F2', secondary: '#002D42'}[color],
            padding: theme.spacing({sm: 0.5, md: 1, lg: 1.5}[size]),
            borderRadius: type === 'outlined' ? 8 : 4,
            backgroundColor:
                type !== 'contained'
                    ? 'transparent'
                    : {primary: '#83D9F2', secondary: '#002D42'}[color],
            justifyContent: 'center',
        },

        textWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        text: {
            marginHorizontal: theme.spacing(1),
            fontSize: theme.fontSizes.button + {sm: -4, md: 0, lg: 4}[size],
            color: {
                contained_primary: 'black',
                contained_secondary: 'white',
                text_primary: 'black',
                text_secondary: 'white',
                outlined_primary: '#83D9F2',
                outlined_secondary: '#002D42',
            }[type + '_' + color],
        },
    }),
)

module.exports = Button
