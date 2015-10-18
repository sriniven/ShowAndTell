import React       from 'react';
import {Provider} from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import App from './components/app';

require('./styles/main.scss');

const learnPics = (state = {
    galleries: window.galleries,
    shownGallery: undefined,
    shownPicture: undefined,
    searchTerm: undefined
}, action) => {
    switch (action.type) {
        case 'SET_GALLERY':
            return Object.assign({}, state, {
                shownGallery: action.gallery
            });
        case 'SET_PICTURE':
            return Object.assign({}, state, {
                shownPicture: action.picture
            });
        case 'SET_SEARCH_TERM':
            return Object.assign({}, state, {
                searchTerm: action.searchTerm
            });
        case 'LAUNCH_QUIZ':
            const allPictures = state.galleries.map(function (g) {
                return g.pictures;
            }).reduce(function (acc, g) {
                return acc.concat(g)
            }, []);

            const getRandom = (min, max) => {
                return Math.floor(Math.random() * (max - min) + min);
            };

            const getNotExistingRandom = (min, max, existing) => {
                const random = getRandom(min, max);
                return existing.indexOf(random) > -1 ? getNotExistingRandom(min, max, existing) : random;
            };
            let allLength = allPictures.length,
                randomIndices = [],
                randomPictures = [],
                noOfQuizQuestions = 10;
            for (let i = 0; i < noOfQuizQuestions; i++) {
                const randomIndex = getNotExistingRandom(0, allLength - 1, randomIndices);
                randomIndices.push(randomIndex);
                randomPictures.push(allPictures[randomIndex]);
            }

            return Object.assign({}, state, {
                quiz: {
                    pictures: randomPictures,
                    currentIndex: 0,
                    answerStatus: 'NOT_YET',
                    score: 0,
                    showScoreboard: false
                }
            });
        case 'CLOSE_QUIZ':
            return Object.assign({}, state, {
                quiz: null
            });
        case 'SUBMIT_ANSWER':
            if (!state.quiz) return state;
            const picture = state.quiz.pictures[state.quiz.currentIndex];
            const correct = picture.title.toLowerCase() == action.answer.toLowerCase();
            return Object.assign({}, state, {
                quiz: Object.assign({}, state.quiz, {
                    answerStatus: correct ? 'CORRECT' : 'INCORRECT',
                    score: correct ? state.quiz.score + 1 : state.quiz.score
                })
            });
        case 'NEXT_QUESTION':
            if (!state.quiz) return state;
            return Object.assign({}, state, {
                quiz: Object.assign({}, state.quiz, {
                    answerStatus: 'NOT_YET',
                    currentIndex: state.quiz.currentIndex + 1,
                    showScoreboard: state.quiz.currentIndex + 1 > 9 // Show after the last question
                })
            });
        default:
            return state;
    }
};

//const reducer = combineReducers({
//    router: routerStateReducer,
//    galleries: initialState
//});

const store = createStore(learnPics);

React.render(
    <Provider store={store}>
        {() => <App />}
    </Provider>,
    document.getElementById('main')
);