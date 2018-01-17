import React from 'react';
import './Panel.css';
import Number from './Number'
import Input from './Input'
import calculate from './../logic/calculate'
import axios from 'axios';
import config from './../config'

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {total: null, next: null, operator: null, needCallApi: false}
    }
    handleClick(type, buttonValue) {
        var result = calculate(this.state, type, buttonValue);
        var _this = this;
        if(result.needCallApi === true) {
            axios({
                method: 'post',
                url: config.server + '/calculate',
                data: {a: this.state.total ,b: this.state.next, operate: this.state.operator}
            })
            .then(function (response) {
                _this.setState({total: response.data.result, needCallApi: false, next: result.next, operator: result.operator});
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else {
            _this.setState(result);
        }
    }
    render() {
        return (
            <div className="main">
                 <div className="rows">
                    <Input value={this.state.next || this.state.total || '0'} />
                 </div>
                 <div className="rows">
                     <Number value="C" label="C" extraClassName="btn-clear" type="clear" clickHandler={this.handleClick}/>
                     <Number value="+" label="+" extraClassName="btn-operator" type="operator" clickHandler={this.handleClick}/>
                 </div>
                 <div className="rows">
                     <Number value="7" label="7" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="8" label="8" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="9" label="9" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="-" label="-" extraClassName="btn-operator" type="operator" clickHandler={this.handleClick}/>
                 </div>
                 <div className="rows">
                     <Number value="4" label="4" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="5" label="5" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="6" label="6" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="*" label="x" extraClassName="btn-operator" type="operator" clickHandler={this.handleClick}/>
                 </div>
                 <div className="rows">
                     <Number value="1" label="1" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="2" label="2" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="3" label="3" extraClassName="" type="number" clickHandler={this.handleClick}/>
                     <Number value="/" label="÷" extraClassName="btn-operator" type="operator" clickHandler={this.handleClick}/>
                 </div>
                 <div className="rows">
                     <Number value="0" label="0" extraClassName="btn-zero" type="number" clickHandler={this.handleClick}/>
                     <Number value="." label="." extraClassName="btn-dot" type="dot" clickHandler={this.handleClick}/>
                     <Number value="=" label="=" extraClassName="btn-equal" type="equal" clickHandler={this.handleClick}/>
                 </div>
             </div>
        );
    }
}

export default Panel;
