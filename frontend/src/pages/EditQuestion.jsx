import React from 'react';
import {
  Box,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import apiCall from '../helpers/apiCall';
import ErrorModal from '../components/ErrorModal';
import EditAnswerBox from '../components/EditAnswerBox';
import { fileToDataUrl } from '../helpers/fileToDataUrl';

const EditQuestion = () => {
  const { gameId, questionId } = useParams();
  const [error, setError] = React.useState('');

  const [question, setQuestion] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [media, setMedia] = React.useState('');
  const [answers, setAnswers] = React.useState([]);

  React.useEffect(() => {
    getQuestionInfo();
  }, []);

  const navigate = useNavigate();

  const getQuestionInfo = async () => {
    const gameInfo = await getGameInfo();
    const questionInfo = gameInfo.questions.find(
      (question) => question.id === parseInt(questionId)
    );

    if (!questionInfo) {
      return;
    }
    setQuestion(questionInfo.question);
    setTimeLimit(questionInfo.timeLimit);
    setPoints(questionInfo.points);
    setMedia(questionInfo.media);
    setAnswers(questionInfo.answers);
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
      setError('Invalid Youtube Link');
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

    const newQuestion = {
      id: parseInt(questionId),
      question: question,
      type: checkQuestionType(),
      timeLimit: parseInt(timeLimit),
      points: parseInt(points),
      media: media,
      answers: answers,
    };

    const body = {
      questions: gameInfo.questions.map((question) =>
        question.id === parseInt(questionId) ? newQuestion : question
      ),
      name: gameInfo.name,
      thumbnail: gameInfo.thumbnail,
    };

    const response = await apiCall(`admin/quiz/${gameId}`, 'PUT', body);
    if (response.ok) {
      navigate(`/edit/${gameId}/`);
    }
  };

  return (
    <Box align={'center'} mt={'10'}>
      <Box ml={2} mb={1} align={'left'} maxW='745'>
        <Button
          onClick={() => {
            navigate(`/edit/${gameId}/`);
          }}
        >
          Go Back
        </Button>
      </Box>
      <Box py={8} maxW='745' borderWidth={1} borderRadius={8} boxShadow='lg'>
        <Heading mb={2}>Edit Question</Heading>
        <form onSubmit={updateGame}>
          {error && <ErrorModal message={error} />}
          <Box mx={10}>
            <FormControl isRequired>
              <FormLabel>Question:</FormLabel>
              <Input
                type='text'
                placeholder='E.g Why did the chicken cross the road?'
                defaultValue={question}
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
                  defaultValue={parseInt(points)}
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
                  defaultValue={parseInt(timeLimit)}
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
                id='updateQuestion'
              >
                Update Question
              </Button>
            </HStack>
            <HStack align={'flex-end'}>
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
              <Button
                maxW={60}
                minW={40}
                variant='outline'
                colorScheme={'red'}
                mt={4}
                onClick={() => {
                  setMedia('');
                }}
              >
                Clear Media
              </Button>
            </HStack>

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
                id='youtubeLink'
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
                >
                  Add
                </Button>
                <Button
                  maxW={40}
                  minW={30}
                  variant='outline'
                  colorScheme={'red'}
                  onClick={removeAnswers}
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
                    defaultCheck={ans.isCorrect}
                    updateAnswers={updateAnswers}
                  ></EditAnswerBox>
                );
              })}
            </VStack>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditQuestion;
