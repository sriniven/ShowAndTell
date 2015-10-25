import React from 'react';
import Gallery from './gallery';
import { connect } from 'react-redux';
import Thumbnail from './thumbnail';
import { setGallery, setShownPicture, setSearchTerm, launchQuiz, closeQuiz, submitAnswer, nextQuestion } from '../actions';
import Search from './search';
import Quiz from'./quiz';

class App extends React.Component {
    render() {
        const { dispatch, galleries, shownGallery, shownPicture, searchTerm, quiz } = this.props;
        const loadAllGalleries = () => {
            const galleryNodes = galleries.map(g => {
                return <div className="thumbnail-container"><Thumbnail image={g.picture} title={g.title} onClick={() => dispatch(setGallery(g))}/></div>;
            });
            return <div className="thumbnail-list">{galleryNodes}</div>;
        };
        const loadShownGallery = () => {
            return <Gallery gallery={shownGallery}
                            onBack={() => dispatch(setGallery())}
                            shownPicture={ shownPicture }
                            onShowPicture = { (p) => dispatch(setShownPicture(p)) }
                            onClosePicture={ () => dispatch(setShownPicture()) }
                />;
        };

        const loadSearch = () => {
            return <Search searchTerm={searchTerm}
                            galleries={galleries}
                            onBack={() => dispatch(setSearchTerm(''))}
                            shownPicture={ shownPicture }
                            onShowPicture = { (p) => dispatch(setShownPicture(p)) }
                            onClosePicture={ () => dispatch(setShownPicture()) }/>
        };

        const loadQuiz = () => {
            return <Quiz {...quiz}
                onBack={() => dispatch(closeQuiz())}
                onSubmitAnswer={(ans) =>dispatch(submitAnswer(ans))}
                onNextQuestion={() => dispatch(nextQuestion())}
                />;
        };

        if(quiz) {
            return loadQuiz();
        }
        let children;
        if(searchTerm) {
            children = loadSearch();
        } else if(shownGallery) {
            children = loadShownGallery();
        } else {
            children = loadAllGalleries();
        }

        return (
            <div id="wrapper">
                <header>
                    <h1>Mudhras</h1>
                    <nav>
                        <button onClick={() => dispatch(launchQuiz())} className="button -quiz">Quiz</button>
                        <input className="search" type="text" placeholder="Search" onKeyUp={(event) => {dispatch(setSearchTerm(event.target.value))}} />
                    </nav>
                </header>
                <div className="search--mobile">
                    <input type="text" placeholder="Search" onKeyUp={(event) => {dispatch(setSearchTerm(event.target.value))}} />
                </div>
                <main>{children}</main>
            </div>
        );
    }
}
export default connect(state => state)(App);
