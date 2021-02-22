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

module.exports =  {
    spacing,
    shadow,
    colors,
}