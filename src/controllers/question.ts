import express from 'express';

import questiondb from '../db/questions';
import Question from '../models/Question';

const router = express();

// GET /question/
// Get all questions
router.get('/', (req, res) => {
  questiondb.getAllQuestions()
    .then((questions) => {
      return res.status(200).send(questions);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
});

// GET /question/questionID
// Get a question by it's ID
router.get('/:questionID', (req, res) => {
  questiondb.findQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      return res.status(200).send(question);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
})

// POST /quesiton/
// Create a new question
router.post('/', (req, res) => {
  const { text, incorrectAnswers, correctAnswers, points } = req.body;

  const newQuestion = new Question(text, incorrectAnswers, correctAnswers, points);

  questiondb.saveNewQuestion(newQuestion)
    .then((question) => {
      return res.status(200).send(question);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

router.put('/:questionID', (req, res) => {
  questiondb.findQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      const { text, incorrectAnswers, correctAnswers, points } = req.body;

      const newQuestion = new Question(question.text, question.incorrectAnswers, question.correctAnswers, question.points);

      if (text) newQuestion.text = text;
      if (incorrectAnswers) newQuestion.incorrectAnswers = incorrectAnswers;
      if (correctAnswers) newQuestion.correctAnswers = correctAnswers;
      if (points) newQuestion.points = points;

      questiondb.updateQuestionById(req.params.questionID, newQuestion)
        .then((preUpdatedQuestion) => {
          if (!preUpdatedQuestion)
            return res.status(404).send('Not Found');

          return res.status(200).send(preUpdatedQuestion);
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

router.delete('/:questionID', (req, res) => {
  questiondb.removeQuestionById(req.params.questionID)
    .then((question) => {
      if (!question)
        return res.status(404).send('Not Found');

      return res.status(200).send(question);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
})

export default router;