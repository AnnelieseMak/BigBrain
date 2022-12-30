import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import PlayerResultRow from './PlayerResultRow';
import apiCall from '../helpers/apiCall';

const PlayerResults = ({ playerId, questionPoints }) => {
  const [results, setResults] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [gameProgress, setGameProgress] = React.useState('complete');

  React.useEffect(() => {
    setScore(0);
    setTotalPoints(0);
    getResults();
  }, []);

  const getResults = async () => {
    const response = await apiCall(`play/${playerId}/results`, 'GET', {});
    const data = await response.json();
    if (!response.ok) {
      setGameProgress('lobbyStop');
      return null;
    }

    for (let i = 0; i < data.length; i++) {
      if (!questionPoints[i]) {
        setGameProgress('earlyStop');
      }
      if (data[i].correct) {
        setScore((s) => s + questionPoints[i]);
      }
      setTotalPoints((s) => s + questionPoints[i]);
      data[i].timeTaken = calculateTime(
        data[i].questionStartedAt,
        data[i].answeredAt
      );
    }
    setResults(data);
  };

  const calculateTime = (startTime, answerTime) => {
    if (!startTime || !answerTime) {
      return null;
    }
    const qStartTime = new Date(startTime);
    const endTime = new Date(answerTime);
    const diff = (endTime - qStartTime) / 1000;
    return Math.round(diff);
  };

  return (
    <Box maxW={745}>
      <Heading mt={5} mb={5}>
        Results
      </Heading>
      {results.map((r, index) => (
        <PlayerResultRow
          key={index}
          index={index}
          r={r}
          questionPoints={questionPoints}
        />
      ))}
      <HStack
        display={gameProgress === 'lobbyStop' ? 'none' : 'block'}
        p={5}
        justify={'space-between'}
        align={'flex-end'}
      >
        <Text>Total Points:</Text>
        <Text
          fontSize={32}
          display={gameProgress === 'complete' ? 'block' : 'none'}
        >
          {score} / {totalPoints}
        </Text>
        <Text display={gameProgress === 'earlyStop' ? 'block' : 'none'}>
          session incomplete
        </Text>
      </HStack>
      <Text
        fontSize={32}
        mt={14}
        display={gameProgress === 'lobbyStop' ? 'block' : 'none'}
      >
        Session Closed
      </Text>
    </Box>
  );
};

PlayerResults.propTypes = {
  playerId: PropTypes.number,
  questionPoints: PropTypes.array,
};

export default PlayerResults;
