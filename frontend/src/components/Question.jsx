import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  AspectRatio,
  SimpleGrid,
  Center,
  Icon,
  HStack,
  VStack,
  Text,
  Badge,
  Image,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import apiCall from '../helpers/apiCall';

const Question = ({ question, playerId }) => {
  if (Object.keys(question).length === 0) {
    return null;
  }

  const [currAnswerIds, setCurrAnswerIds] = React.useState([]);
  const [currQuestion, setCurrQuestion] = React.useState(-1);
  const [timeLimit, setTimeLimit] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState([]);
  let countDown = '';

  React.useEffect(() => {
    if (timeLimit > 0) {
      countDown = setInterval(() => {
        setTimeLimit((s) => s - 1);
      }, 1000);
      return () => clearInterval(countDown);
    } else {
      const delay = setTimeout(() => {
        getAnswer();
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [timeLimit]);

  if (currQuestion !== question.id) {
    setCurrQuestion(question.id);
    setCurrAnswerIds([]);
    setCorrectAnswers([]);
    clearInterval(countDown);
    const currTime = new Date();
    const endTime = new Date(question.isoTimeLastQuestionStarted);
    endTime.setSeconds(endTime.getSeconds() + question.timeLimit);
    const timer = -((currTime - endTime) / 1000);
    let flooredTimer = Math.floor(timer);
    if (flooredTimer < 0) {
      flooredTimer = 0;
    }
    setTimeLimit(flooredTimer);
  }

  // api call to add player's answer
  const playerAnswer = async (answerIds) => {
    const response = await apiCall(`play/${playerId}/answer`, 'PUT', {
      answerIds,
    });
    if (response.ok) {
      setCurrAnswerIds(answerIds);
    }
  };

  const getAnswer = async () => {
    const response = await apiCall(`play/${playerId}/answer`, 'GET', {});
    const data = await response.json();
    setCorrectAnswers(data.answerIds);
  };

  // selecting/deselecting answers
  const handleClick = async (qid) => {
    if (timeLimit === 0) {
      return null;
    }
    let currIds = [qid];
    // multiple answers
    if (question.type === 'multiple') {
      currIds = [...currAnswerIds];
      const index = currIds.indexOf(qid);
      // is currently a selected answer
      if (index !== -1) {
        currIds.splice(index, 1);
      } else {
        currIds.push(qid);
      }
    }

    await playerAnswer(currIds);
  };

  const selectedAnswerColour = useColorModeValue('gray.200', 'gray.700');

  const isYoutubeLink = question.media && question.media.includes('https');
  const re = '[\\?&]v=([^&#]*)';
  const embedLink =
    isYoutubeLink &&
    `https://www.youtube.com/embed/${question.media.match(re)[1]}`;

  return (
    <Box>
      <Text fontSize={'36px'} fontWeight={'bold'} mb={2}>
        Question: {question.question}
      </Text>
      <Divider my={4} w={'100%'} />
      <HStack p={2} justify={'space-between'}>
        <VStack flex={1} maxW={'15%'}>
          <Badge
            px={2}
            pt={2}
            bg={useColorModeValue('gray.50', 'gray.800')}
            fontWeight={'400'}
            name={'gameIdBadge'}
          >
            Time Limit: {timeLimit}
          </Badge>
          <Badge
            px={2}
            pt={2}
            bg={useColorModeValue('gray.50', 'gray.800')}
            fontWeight={'400'}
            name={'gameIdBadge'}
          >
            Type of question: <br /> {question.type}
          </Badge>
          <Badge
            px={2}
            pt={2}
            bg={useColorModeValue('gray.50', 'gray.800')}
            fontWeight={'400'}
            name={'gameIdBadge'}
          >
            Points: {question.points}
          </Badge>
        </VStack>
        <AspectRatio minW={[150, 250, 450, 650]} maxW={1600} ratio={16 / 9}>
        {isYoutubeLink
          ? (<iframe
                title='Youtube Video'
                src={`${embedLink}`}
                allowFullScreen
              />)
          : (<Image
                src={question.media}
                alt='Image'
                objectFit='cover'
              />)}
        </AspectRatio>
        <Box flex={1}></Box>
      </HStack>
      <Divider my={4} w={'100%'} />
      <Box minH={200}>
        <SimpleGrid columns={2} minH={200} justify={'center'} mt={2}>
          {question.answers.map((q) => (
            <Center key={q.id}>
              <HStack
                align={'center'}
                w={'90%'}
                h={'90%'}
                p={5}
                justify={'space-between'}
                borderWidth={1}
                onClick={() => {
                  handleClick(q.id);
                }}
                bgColor={
                  currAnswerIds.includes(q.id)
                    ? selectedAnswerColour
                    : 'transparent'
                }
              >
                <Text>{q.answer}</Text>
                {correctAnswers.includes(q.id) && (
                  <Icon as={CheckIcon} boxSize={7} m={2} />
                )}
              </HStack>
            </Center>
          ))}
        </SimpleGrid>
        <Divider my={4} w={'100%'} />
      </Box>
    </Box>
  );
};

Question.propTypes = {
  question: PropTypes.object,
  playerId: PropTypes.number,
};

export default Question;
