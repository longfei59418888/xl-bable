
import React from 'react';
import { getStoreDispatch, getStoreState } from 'src/store';
import './index.scss';
import { SET_GLOBAL_PAGE_SLIDE_CLASS } from '../../constants/actions';

const mask = document.querySelector('#mask');
export const disableOption = () => {
    mask.style.display = 'block';
};
export const clearOption = () => {
    mask.style.display = 'none';
};
class Page extends React.Component {
    static state = {
        childrens: null,
    };

    constructor() {
        super();
        this.preChildren = null;
        this.nextChildren = null;
    }

    componentWillMount() {
        this.getChildrens(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getChildrens(nextProps);
    }

    componentDidUpdate() {
        if (this.nextChildren) {
            setTimeout(() => { document.querySelector('.page-action-box').classList.add('action'); }, 50);
            setTimeout(() => {
                clearOption();
                document.querySelector('.page-action-box').classList.remove('action');
                this.getChildrens(this.nextChildren);
                getStoreDispatch({
                    type: SET_GLOBAL_PAGE_SLIDE_CLASS,
                    data: 0,
                });
            }, 300);
        }
    }

    getChildrens = (props) => {
        disableOption();
        const { children } = props;
        const { global } = getStoreState() || {};
        const { pageSlideClass } = global;
        let { preChildren } = this;
        let [nextChildren] = React.Children.map(children, item => item);
        let childrens = [nextChildren];
        if (preChildren && nextChildren.key !== preChildren.key && pageSlideClass !== 'page-none') {
            this.nextChildren = props;
            if (pageSlideClass === 'page-left') {
                preChildren = React.cloneElement(preChildren, {
                    className: 'page-left-pre',
                });
                nextChildren = React.cloneElement(nextChildren, {
                    className: 'page-left-next',
                });
                childrens = [preChildren, nextChildren];
            } else if (pageSlideClass === 'page-right') {
                preChildren = React.cloneElement(preChildren, {
                    className: 'page-right-pre',
                });
                nextChildren = React.cloneElement(nextChildren, {
                    className: 'page-right-next',
                });
                childrens = [nextChildren, preChildren];
            }
        } else {
            this.nextChildren = null;
            clearOption();
        }
        this.preChildren = nextChildren;
        this.setState({
            childrens: React.createElement('div', {
                className: 'page-action-box',
            }, childrens),
        });
    };


    render() {
        const { childrens } = this.state;
        return childrens;
    }
}

export default Page;
