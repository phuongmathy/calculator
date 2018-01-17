import React from 'react';
import './Input.css';

class Input extends React.Component {
    render() {
        return (
          <div className="btn btn-number btn-result">{this.props.value}</div>
        );
    }
}

export default Input;
