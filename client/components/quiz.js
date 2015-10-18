import React from 'react';

class Quiz extends React.Component {
    render() {
        const picture = this.props.pictures[this.props.currentIndex];
        const isAnswered = this.props.answerStatus !== 'NOT_YET';
        let resultNode;
        if (this.props.answerStatus == 'CORRECT') {
            resultNode = <p className="success">You're right!</p>;
        } else if (this.props.answerStatus == 'INCORRECT') {
            resultNode = <p className="error">Oops! You're wrong. The correct answer is {picture.title}</p>;
        }
        const handleSubmit = () => {
            var answerField = React.findDOMNode(this.refs.answerField);
            this.props.onSubmitAnswer(answerField.value);
        };
        const handleNextQuestion = () => {
            var answerField = React.findDOMNode(this.refs.answerField);
            answerField.value = "";
            this.props.onNextQuestion();
        };

        let children;
        if (!this.props.showScoreboard) {
            children = [<h2>Question {this.props.currentIndex + 1}</h2>,
                <div className="images-preloader">
                    {this.props.pictures.map((picture) => <img src={picture.url} />)}
                </div>,
                <p><img className="quiz-image" src={picture.url} /></p>,

                <p><input type="text" ref="answerField" disabled={isAnswered}/>
                    {(() => {
                        if (!isAnswered) {
                            return <button className="button"
                                           onClick={handleSubmit}>
                                Submit
                            </button>
                        }
                    })()}</p>,
                <p>{resultNode}
                    {(() => {
                        if (isAnswered) {
                            return <button className="button"
                                           onClick={handleNextQuestion}>
                                → Next Question
                            </button>
                        }
                    })()}</p>]
        } else {
            children = [
                <h2>Congratulations!</h2>,
                <p>
                    You've completed the quiz
                    <br/>
                    You've scored
                </p>,
                <h3 className="score">{this.props.score}/10</h3>,
                <button className="button" onClick={this.props.onBack}>← Back to Gallery</button>
            ]
        }

        return <div id="wrapper">
            <header className="-quiz">
                <button className="button" onClick={this.props.onBack}>← Back</button>
                <h1>Quiz</h1>
            </header>
            <main className="quiz">
                {children}
            </main>
        </div>;
    }
}

export default Quiz;