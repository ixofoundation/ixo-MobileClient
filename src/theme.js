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
    elevation: 10,
})

const colors = {
    primary: {
        darkBlue: '#002233',
        lightBlue: '#00D2FF',
        darkRed: '#A11C43',
        lightRed: '#E2223B',
    },
    secondary: '',
    background: '',
    white: 'white',
    black: '',
}

const fontSizes = {
    h1: 25,
    h2: 18,
    h3: 48,
    h4: 34,
    h5: 24,
    h6: 20,
    p1: 16,
    p2: 14,
    button: 14,
    caption: 12,
    overline: 10,
    body: 16,
    smallBody: 12,
    meta: 11,
    numbersLarge: 29,
}

module.exports = {
    spacing,
    shadow,
    colors,
    fontSizes,
}
