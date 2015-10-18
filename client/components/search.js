import React from 'react';
import ImageList from './image-list';

const performSearch = (searchTerm, galleries) => {
    const searchTermL = searchTerm.toLowerCase();
    const arrOfPictures = galleries.map((g) => {
        return g.pictures.filter(p => {
            return p.title.toLowerCase().indexOf(searchTermL) > -1;
        })
    });

    //Flatten the array
    return arrOfPictures.reduce((memo, x) => memo.concat(x), []);
};

class Search extends React.Component {
    render() {
        const pictures = performSearch(this.props.searchTerm, this.props.galleries);
        return <ImageList title={`Results for "${this.props.searchTerm}"`}
                          pictures={pictures}
                          onBack={this.props.onBack}
                          shownPicture={ this.props.shownPicture }
                          onShowPicture={ this.props.onShowPicture }
                          onClosePicture={ this.props.onClosePicture }/>;
    }
}

export default Search;