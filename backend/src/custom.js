/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
const copy = x => JSON.parse(JSON.stringify(x));
export const quizQuestionPublicReturn = question => {
  // console.log('See question: ', question);
  const questionRet = copy(question);
  const answerRet = questionRet.answers;
  
  for (let i = 0; i < answerRet.length; i++) {
    delete answerRet[i]['isCorrect'];
  }
  // console.log('answerRet', questionRet);
  
  return questionRet;

};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let correctAnswers = [];
  // console.log('question: ', question);
  const answers = question.answers;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].isCorrect == true) {
      correctAnswers.push(answers[i].id);
    }
  }
  // console.log('correct answers: ', correctAnswers);
  return correctAnswers;

  // return [
  //   123,
  // ]; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let allAnswers = [];
  const answers = question.answers;
  for (let i = 0; i < answers.length; i++) {
    allAnswers.push(answers[i].id);
  }
  return allAnswers;
  // return [
  //   123,
  //   456,
  //   678,
  // ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  // console.log('quizQuestionGetDuration: ', question.timeLimit);
  return question.timeLimit;
  // return 10;
};
