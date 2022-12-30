import React from 'react';
import {
  Box,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';
import ErrorModal from './ErrorModal';
import PropTypes from 'prop-types';
import apiCall from '../helpers/apiCall';
import EditAnswerBox from './EditAnswerBox';
import { fileToDataUrl } from '../helpers/fileToDataUrl';

const CreateQuestionForm = ({ gameId, update }) => {
  const [question, setQuestion] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [media, setMedia] = React.useState('');
  const [answers, setAnswers] = React.useState([
    {
      id: 1,
      answer: 'Click here to edit',
      isCorrect: false,
    },
    {
      id: 2,
      answer: 'Click here to edit',
      isCorrect: false,
    },
  ]);

  const [error, setError] = React.useState('');

  const getGameInfo = async () => {
    const response = await apiCall(`admin/quiz/${gameId}`, 'GET', {});
    const data = await response.json();
    if (!response.ok) {
      // Game no longer exists
      return false;
    } else {
      return data;
    }
  };

  const updateGame = async (e) => {
    e.preventDefault();

    setError('');

    // checks if youtube link includes youtube.com
    if (
      !media.includes('youtube.com') &&
      !media.includes('youtu.be') &&
      !media.includes('data:image') &&
      media !== ''
    ) {
      setError(
        'Invalid Youtube Link - Correct Format: https://www.youtube.com/watch?v=<video_id>'
      );
      return;
    }

    // check there is at least 1 correct answer;
    const hasCorrectAnswer = answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) {
      setError('Question must have at least 1 correct answer');
      return;
    }

    const gameInfo = await getGameInfo();
    if (!gameInfo) {
      return;
    }

    gameInfo.questions.push({
      id: gameInfo.questions.length + 1,
      question: question,
      type: checkQuestionType(),
      timeLimit: parseInt(timeLimit),
      points: parseInt(points),
      media: media,
      answers: answers,
    });

    const body = {
      questions: gameInfo.questions,
      name: gameInfo.name,
      thumbnail: gameInfo.thumbnail,
    };

    const response = await apiCall(`admin/quiz/${gameId}`, 'PUT', body);
    if (!response.ok) {
      // Game no longer exists
      return false;
    }
    update();
  };

  const checkQuestionType = () => {
    const numCorrect = answers.filter((answer) => answer.isCorrect).length;
    return numCorrect === 1 ? 'single' : 'multiple';
  };

  const updateAnswers = (index, answer, check) => {
    const list = [...answers];
    list[index].isCorrect = check;
    list[index].answer = answer;
    setAnswers(list);
  };

  const addAnswers = () => {
    const list = [...answers];
    if (list.length < 6) {
      list.push({
        id: list.length + 1,
        answer: 'Click here to edit',
        isCorrect: false,
      });
    }
    setAnswers(list);
  };

  const removeAnswers = () => {
    const list = [...answers];
    if (list.length > 2) {
      list.pop();
    }
    setAnswers(list);
  };

  return (
    <Box
      py={8}
      maxW='745'
      mt={4}
      borderWidth={1}
      borderRadius={8}
      boxShadow='lg'
    >
      <form onSubmit={updateGame}>
        {error && <ErrorModal message={error} />}
        <Box mx={10}>
          <FormControl isRequired>
            <FormLabel>Create a New Question:</FormLabel>
            <Input
              type='text'
              placeholder='E.g Why did the chicken cross the road?'
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              id='questionString'
            />
          </FormControl>
          <HStack mt={2} align={'flex-end'}>
            <FormControl isRequired>
              <FormLabel>Point Value:</FormLabel>
              <Input
                type='number'
                placeholder='E.g 10'
                onChange={(e) => {
                  setPoints(e.target.value);
                }}
                id='pointValue'
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Time Limit (Seconds):</FormLabel>
              <Input
                type='number'
                placeholder='E.g 60'
                onChange={(e) => {
                  setTimeLimit(e.target.value);
                }}
                id='timeLimit'
              />
            </FormControl>
            <Button
              maxW={60}
              minW={40}
              variant='outline'
              colorScheme={'cyan'}
              mt={4}
              type='submit'
              id='createQuestionButton'
            >
              Create Question
            </Button>
          </HStack>
          <FormControl mt={2}>
            <FormLabel>Image:</FormLabel>
            <Input
              type='file'
              accept='image/jpeg, image/png, image/jpg'
              onChange={(e) => {
                fileToDataUrl(e.target.files[0]).then((dataUrl) => {
                  setMedia(dataUrl);
                });
              }}
              id={'editQuestionThumbnailUpload'}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Or Youtube Link:</FormLabel>
            <Input
              type='text'
              placeholder='E.g https://www.youtube.com/watch?v=iik25wqIuFo'
              onChange={(e) => {
                setMedia(e.target.value);
                if (
                  e.target.value.includes('youtube.com') ||
                  e.target.value.includes('youtu.be') ||
                  e.target.value === ''
                ) {
                  setError('');
                }
              }}
            />
          </FormControl>
          <HStack mt={4} justifyContent={'space-between'}>
            <Text align={'center'}>Answers (Check the correct answers):</Text>
            <HStack>
              <Button
                maxW={40}
                minW={30}
                variant='outline'
                colorScheme={'cyan'}
                onClick={addAnswers}
                id={'addAnswer'}
              >
                Add
              </Button>
              <Button
                maxW={40}
                minW={30}
                variant='outline'
                colorScheme={'red'}
                onClick={removeAnswers}
                id={'removeAnswer'}
              >
                Remove
              </Button>
            </HStack>
          </HStack>
          <VStack>
            {answers.map((ans, index) => {
              return (
                <EditAnswerBox
                  key={index}
                  index={index}
                  text={ans.answer}
                  defaultCheck={false}
                  updateAnswers={updateAnswers}
                ></EditAnswerBox>
              );
            })}
          </VStack>
        </Box>
      </form>
    </Box>
  );
};

CreateQuestionForm.propTypes = {
  gameId: PropTypes.string,
  update: PropTypes.func,
};

export default CreateQuestionForm;
