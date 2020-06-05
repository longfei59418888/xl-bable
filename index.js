import React from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.scss'
import classnames from 'classnames'

class Main extends React.Component {

    state = {
        focus: false,
        value: ''
    }

    componentWillMount() {
        const {defaultValue} = this.props
        this.setState({
            value: defaultValue || ''
        })
        document.getElementsByTagName("html")[0].classList.add('xl-common-input-document');
    }

    componentDidMount() {
        const {onFocus, onBlur, onPaste} = this
        let timeOut = false
        this.input.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (timeOut) return;
            timeOut = true
            setTimeout(() => {
                timeOut = false
            }, 250)
            const {focus} = this.state
            if (focus) return
            onFocus(e)
            this.showKeyBox()
            document.addEventListener('click', onBlur)
            document.addEventListener('paste', onPaste)
        })


    }

    componentWillUnmount() {
        document.getElementsByTagName("html")[0].classList.remove('xl-common-input-document');
    }

    get value() {
        const {value} = this.state
        return value
    }

    onPaste = (e) => {
        const {onPaste} = this.props
        let {value} = this.state
        e.preventDefault()
        e.stopPropagation()
        if (!(e.clipboardData && e.clipboardData.items)) return;
        const {items = []} = e.clipboardData
        Object.keys(items).forEach(key => {
            const item = items[key];
            if (item.kind === 'string' && item.type === "text/plain") {
                item.getAsString((str) => {
                    if (onPaste) str = onPaste(str)
                    value = value + str
                    this.setState({
                        value
                    })
                })
            }
        })
    }

    showKeyBox = () => {
        const modalContainer = document.createElement('div');
        this.modalContainer = modalContainer
        modalContainer.setAttribute('class', 'xl-common-input-types-key-box');
        document.body.appendChild(modalContainer)
        const _this = this
        const Com = (
            <div className='key-box'>
                <p onClick={(e) => _this.onKeyUp('', e)}><span>-</span></p>
                <p onClick={(e) => _this.onKeyUp('1', e)}><span>1</span></p>
                <p onClick={(e) => _this.onKeyUp('2', e)}><span>2</span></p>
                <p onClick={(e) => _this.onKeyUp('3', e)}><span>3</span></p>
                <p onClick={(e) => _this.onKeyUp('del', e)}><img style={{width: 25}} src={require('./delete.svg')}/>
                </p>
                <p onClick={(e) => _this.onKeyUp('', e)}><span>@</span></p>
                <p onClick={(e) => _this.onKeyUp('4', e)}><span>4</span></p>
                <p onClick={(e) => _this.onKeyUp('5', e)}><span>5</span></p>
                <p onClick={(e) => _this.onKeyUp('6', e)}><span>6</span></p>
                <p onClick={(e) => _this.onKeyUp('.', e)}><span style={{fontSize: 20}}>.</span></p>
                <p onClick={(e) => _this.onKeyUp('', e)}><span>#</span></p>
                <p onClick={(e) => _this.onKeyUp('7', e)}><span>7</span></p>
                <p onClick={(e) => _this.onKeyUp('8', e)}><span>8</span></p>
                <p onClick={(e) => _this.onKeyUp('9', e)}><span>9</span></p>
                <p><span onClick={(e) => _this.onKeyUp('enter', e)}>跳转</span></p>
                <p onClick={(e) => _this.onKeyUp('', e)}><span>?!$</span></p>
                <p onClick={(e) => _this.onKeyUp('clear', e)}><img style={{width: 20}} src={require('./back.svg')}/></p>
                <p onClick={(e) => _this.onKeyUp('0', e)}><span>0</span></p>
                <p onClick={(e) => _this.onKeyUp('', e)}><img style={{width: 25}} src={require('./space.svg')} alt=""/>
                </p>
            </div>
        )
        render(Com, modalContainer, () => {
            setTimeout(() => modalContainer.classList.add("action"), 50)
        })
    }
    close = () => {
        const {modalContainer} = this
        modalContainer.classList.remove('action');
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(modalContainer)
            modalContainer.parentNode.removeChild(modalContainer)
        }, 250)
    }
    onChange = (value) => {
        const {onChange, proxy} = this.props
        if (proxy) {
            value = proxy(value)
        }
        this.setState({
            value
        })
        if (onChange) onChange(value)
    }
    onEnter = (e) => {
        const {onEnter} = this.props
        this.onBlur(e)
        if (onEnter) onEnter(this.value)
    }
    onKeyUp = (key, e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault()
        e.stopPropagation()
        if (!key) return
        const {onKeyUp, type = 'cash', length} = this.props
        let {value} = this.state
        switch (key) {
            case 'del':
                if (value.length > 0) value = value.substring(0, value.length - 1)
                break;
            case 'enter':
                this.onEnter(e)
                break;
            case 'clear':
                value = ''
                break;
            case '.':
                if (type === 'cash' && value.indexOf('.') === -1 && value.length > 0) value += key
                break;
            default:
                if (!length || length > value.length) value = `${value}${key}`
                break;
        }
        if (onKeyUp) onKeyUp(key)
        this.onChange(value)
    }
    onBlur = (e) => {
        const {onBlur} = this.props
        const {target} = e
        this.setState({
            focus: false
        })
        document.removeEventListener('click', this.onBlur)
        document.removeEventListener('onPaste', this.onPaste)
        this.close()
        document.getElementsByTagName("html")[0].style.top = 0;
        if (onBlur) onBlur(this.value, target)
    }
    onFocus = (e) => {
        const {onFocus} = this.props
        const {target} = e
        const Rect = target.getBoundingClientRect()
        const {y, height} = Rect
        const top = (window.innerHeight - 200) - y - height
        if (top < 0) document.getElementsByTagName("html")[0].style.top = `${top - 15}px`;
        this.setState({
            focus: true
        })
        if (onFocus) onFocus(this.value, target)
    }

    render() {
        const {
            className,
            placeholder,
            style
        } = this.props
        const {focus, value} = this.state
        return (
            <div className='xl-common-input-types-box'>
                <div
                    ref={(input) => {
                        this.input = input
                    }}
                    className={classnames('xl-common-input', className, focus ? "" : "hide")}
                    style={style}
                >
                    <span style={{position: 'relative', zIndex: 8}}>{value}</span>
                    {(value + '').length > 0 ? "" :
                        <span style={style} className='xl-common-input-placeholder'>{placeholder}</span>}
                </div>
                <input type="hidden"/>
            </div>
        )
    }
}

export default Main
