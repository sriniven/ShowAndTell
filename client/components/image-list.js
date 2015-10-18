import React from 'react';
import Thumbnail from './thumbnail';
import Modal from 'react-modal';

class ImageList extends React.Component {
    render() {
        const thumbnails = this.props.pictures.map(picture => {
            return <div className="thumbnail-container"><Thumbnail title={picture.title} image={picture.thumb} onClick={() => {this.props.onShowPicture(picture)}}/></div>;
        });

        const loadModal = () => {
            return <Modal className="modal" isOpen={true} onRequestClose={this.props.onClosePicture}>
                <div className="modal-header">
                    <h2>{this.props.shownPicture.title}</h2>
                    <button className="close-button" onClick={this.props.onClosePicture}>×</button>
                </div>
                <div className="modal-content">
                    <img className="image" src={this.props.shownPicture.url} />
                </div>
            </Modal>;
        };
        const modal = this.props.shownPicture ? loadModal() : undefined;
        return (<div className="image-list">
            <h2>
                <button className="button" onClick={this.props.onBack}>← Back</button>
                {this.props.title}
            </h2>
            <div className="thumbnail-list">
                {thumbnails}
            </div>
            {modal}
        </div>);
    }
}
export default ImageList;