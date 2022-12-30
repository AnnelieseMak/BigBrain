import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Badge, useColorModeValue, HStack } from '@chakra-ui/react';

import Lobby from '../components/Lobby';
import PlayerResults from '../components/PlayerResults';
import Question from '../components/Question';
import apiCall from '../helpers/apiCall';

const Game = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const playerName = location.state.playerName;
  const playerId = location.state.playerId;
  const [questionPoints, setQuestionPoints] = React.useState([]);
  const [sessionStatus, setSessionStatus] = React.useState('false');
  let sessionPoll = '';
  let questionPoll = '';
  const [question, setQuestion] = React.useState({});

  // start polling session status when player joins game
  // false = lobby, true = questions, stopped = ended
  React.useEffect(() => {
    sessionPoll = setInterval(async () => {
      await getSessionStatus();
    }, 1000);
    return () => clearInterval(sessionPoll);
  }, [sessionStatus]);

  const getSessionStatus = async () => {
    const response = await apiCall(`play/${playerId}/status`, 'GET', {});
    const data = await response.json();
    if (data.error) {
      setSessionStatus('stopped');
      clearInterval(sessionPoll);
      clearInterval(questionPoll);
    } else {
      if (data.started.toString() !== sessionStatus) {
        setSessionStatus(data.started.toString());
      }
    }
  };

  // polling to check question position
  React.useEffect(() => {
    if (sessionStatus === 'true') {
      questionPoll = setInterval(async () => {
        await getQuestion();
      }, 1000);
      return () => clearInterval(questionPoll);
    }
  }, [sessionStatus, question]);

  // get game's current question
  const getQuestion = async () => {
    const response = await apiCall(`play/${playerId}/question`, 'GET', {});
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const currQuestion = data.question;
    if (currQuestion === null || question.id !== currQuestion.id) {
      setQuestionPoints((questionPoints) => [
        ...questionPoints,
        currQuestion.points,
      ]);
      setQuestion(currQuestion);
    }
  };

  return (
    <Box align={'center'}>
      <Box
        mt={4}
        pt={6}
        pb={4}
        maxW={'90%'}
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
      >
        <Box minH={400}>
          {sessionStatus === 'false' && <Lobby />}
          {sessionStatus === 'true' && question
            ? (<Question question={question} playerId={playerId} />)
            : null}
          {sessionStatus === 'stopped' && (
            <PlayerResults
              playerId={playerId}
              questionPoints={questionPoints}
            />
          )}
        </Box>
        <HStack justifyContent={'center'}>
          <Badge
            px={2}
            pt={5}
            bg={useColorModeValue('gray.50', 'gray.800')}
            fontWeight={'400'}
            name={'gameIdBadge'}
          >
            Session: {sessionId}
          </Badge>
          <Badge
            px={2}
            pt={5}
            bg={useColorModeValue('gray.50', 'gray.800')}
            fontWeight={'400'}
            name={'gameIdBadge'}
          >
            Your name: {playerName}
          </Badge>
        </HStack>
      </Box>
    </Box>
  );
};

Game.propTypes = {
  playerId: PropTypes.array,
};

export default Game;
