import React from 'react';

class Thumbnail extends React.Component {
    render() {
        return (<a href="#" className="thumbnail" onClick={this.props.onClick}>
            <p className="image" style={{backgroundImage: `url('${this.props.image}')`}} title={this.props.title}></p>
            <p className="title">{this.props.title}</p>
        </a>);
    }
}
export default Thumbnail;