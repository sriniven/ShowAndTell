export default {
    setGallery: (gallery) => {
        return {type: 'SET_GALLERY', gallery};
    },

    setShownPicture: (picture) => {
        return {type: 'SET_PICTURE', picture};
    },

    setSearchTerm: (searchTerm) => {
        return {type: 'SET_SEARCH_TERM', searchTerm};
    },

    launchQuiz: () => {
        return {type: 'LAUNCH_QUIZ'};
    },

    closeQuiz: () => {
        return {type: 'CLOSE_QUIZ'};
    },

    submitAnswer: (answer) => {
        return {type: 'SUBMIT_ANSWER', answer}
    },

    nextQuestion: () => {
        return {type: 'NEXT_QUESTION'};
    }
}