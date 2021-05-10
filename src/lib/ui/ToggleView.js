const React = require('react'),
    {Children, cloneElement} = React

const ToggleView = ({children, opened = [], onItemClick}) => {
    return Children.map(children, (child, index) => {
        return cloneElement(child, {
            ...child.props,
            onPress: () => onItemClick(index),
            open: opened.some((i) => i === index),
        })
    })
}

module.exports = ToggleView
