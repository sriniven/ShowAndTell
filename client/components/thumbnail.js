import React from 'react';

class Thumbnail extends React.Component {
    render() {
        return (<div className="thumbnail" onClick={this.props.onClick}>
            <div className="image" style={{backgroundImage: `url(${this.props.image})`}} title={this.props.title}></div>
            <br/>
            <span className="title">{this.props.title}</span>
        </div>);
    }
}
export default Thumbnail;