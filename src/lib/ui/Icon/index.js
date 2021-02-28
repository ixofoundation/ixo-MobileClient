const
    React = require('react'),
    {createElement} = React

const icons = {
    arrowUp: require('./assets/arrowUp.svg').default,
    assistant: require('./assets/assistant.svg').default,
    autoRenew: require('./assets/autorenew.svg').default,
    bellOff: require('./assets/bellOff.svg').default,
    close: require('./assets/close.svg').default,
    dotsVertical: require('./assets/dotsVertical.svg').default,
    filter: require('./assets/filter.svg').default,
    linkOff: require('./assets/linkOff.svg').default,
    mainMenu: require('./assets/mainMenu.svg').default,
    menu: require('./assets/menu.svg').default,
    scan: require('./assets/scan.svg').default,
    web: require('./assets/web.svg').default,
    chevronRight: require('./assets/chevronRight.svg').default,
    chevronLeft: require('./assets/chevronLeft.svg').default,
}

const Icon = ({name, ...props}) =>
    createElement(icons[name], props)


module.exports = Icon
