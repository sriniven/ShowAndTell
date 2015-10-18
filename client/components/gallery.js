import React from 'react';
import ImageList from './image-list';

class Gallery extends React.Component {
    render() {
        return (<div id="gallery">
            <ImageList title={this.props.gallery.title}
                       pictures={this.props.gallery.pictures}
                       onBack={this.props.onBack}
                       shownPicture={ this.props.shownPicture }
                       onShowPicture = { this.props.onShowPicture }
                       onClosePicture={ this.props.onClosePicture }/>
        </div>);
    }
}
export default Gallery;