const BASE_MEASURE = 8

const spacing = (n) => n * BASE_MEASURE

const shadow = () => ({
    shadowColor: 'rgb(212, 221, 232)',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 1,
})

const colors = {
    primary: '',
    secondary: '',
    background: '',
    white: '',
    black: '',
}

const fontSizes = {
    h1: 96,
    h2: 60,
    h3: 48,
    h4: 34,
    h5: 24,
    h6: 20,
    p1: 16,
    p2: 14,
    button: 14,
    caption: 12,
    overline: 10,
}

module.exports =  {
    spacing,
    shadow,
    colors,
    fontSizes,
}