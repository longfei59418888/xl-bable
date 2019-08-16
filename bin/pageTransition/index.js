import React from 'react'
import {polyfill} from 'react-lifecycles-compat';
import './index.scss'

let direction = 'none'

export const setDirection = (dir) => direction = dir

let mask = null
export const disable = (clear = false) => {
    if (clear) {
        mask.parentNode.removeChild(mask)
        mask = null
        return
    }
    mask = document.createElement('div')
    mask.classList.add('xl-page-transition-mask')
    document.body.appendChild(mask)
}

export const BoxPage = (props) => {
    const {
        children,
        compontent = 'div'
    } = props
    return React.createElement(compontent, props, children)
}


class Page extends React.Component {

    constructor() {
        super();
        this.preChildren = null;
        this.nextChildren = null;
        this.state = {
            childrens: null,
        };
    }

    componentWillMount() {
        this.getChildrens(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getChildrens(nextProps);
    }

    componentDidUpdate() {
        if (this.nextChildren) {
            setTimeout(() => {
                document.querySelector('#xl-page-transition-action-box').classList.add('action');
            }, 50);
            setTimeout(() => {
                document.querySelector('#xl-page-transition-action-box').classList.remove('action');
                this.getChildrens(this.nextChildren);
                direction = 'none'
            }, 300);
        }
    }

    getChildrens = (props) => {
        const {children} = props;
        let {preChildren} = this;
        let [nextChildren] = React.Children.map(children, item => item);
        let childrens = [nextChildren];
        if (preChildren && nextChildren.key !== preChildren.key && direction !== 'none') {
            this.nextChildren = props;
            if (direction === 'left') {
                preChildren = React.cloneElement(preChildren, {
                    className: 'xl-page-transition-left-pre xl-page-transition',
                });
                nextChildren = React.cloneElement(nextChildren, {
                    className: 'xl-page-transition-left-next xl-page-transition',
                });
                childrens = [preChildren, nextChildren];
            } else if (direction === 'right') {
                preChildren = React.cloneElement(preChildren, {
                    className: 'xl-page-transition-right-pre xl-page-transition',
                });
                nextChildren = React.cloneElement(nextChildren, {
                    className: 'xl-page-transition-right-next xl-page-transition',
                });
                childrens = [nextChildren, preChildren];
            }
        } else {
            this.nextChildren = null;
        }
        this.preChildren = nextChildren;
        this.setState({
            childrens: React.createElement('div', {
                id: 'xl-page-transition-action-box',
            }, childrens),
        });
    };

    render() {
        const {childrens} = this.state;
        return childrens;
    }
}

polyfill(Page)
export default Page
