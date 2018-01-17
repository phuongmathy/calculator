import React from 'react';
import './Number.css';

class Number extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.clickHandler(this.props.type, this.props.value);
    }
    render() {
        let className = "btn btn-number " + this.props.extraClassName;
        return (
          <button value={this.props.value} className={className} onClick={this.handleClick} >{this.props.value}</button>
        );
    }
}

export default Number;
