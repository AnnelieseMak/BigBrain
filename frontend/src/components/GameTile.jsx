import React from 'react';
import PropTypes from 'prop-types';
import {
  Center,
  Stack,
  Flex,
  Image,
  Heading,
  Button,
  HStack,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import ErrorModal from './ErrorModal';
import apiCall from '../helpers/apiCall';
import { useNavigate } from 'react-router-dom';
import ModalButton from './ModalButton';

const GameTile = ({
  id,
  name,
  length,
  thumbnail,
  timeLimit,
  sessions,
  updateList,
}) => {
  const [sessionId, setSessionId] = React.useState(0);
  const [prevSessionId, setPrevSessionId] = React.useState(0);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const response = await getQuizStatus();
    const data = await response.json();
    if (data.active) {
      setSessionId(data.active);
    }
  };

  if (!timeLimit) {
    timeLimit = 0;
  }

  // api call to start game
  const startGame = async () => {
    const response = await apiCall(`admin/quiz/${id}/start`, 'POST', {});
    if (!response.ok) {
      const errorMsg = await response.json();
      setError(errorMsg.error);
      return [400, errorMsg.error];
    } else {
      const response = await getQuizStatus();
      if (!response.ok) {
        setError(response.error);
        return [400, response.error];
      } else {
        const data = await response.json();
        setSessionId(data.active);
        return [200, data.active];
      }
    }
  };

  const getQuizStatus = async () => {
    const response = await apiCall(`admin/quiz/${id}`, 'GET', {});
    return response;
  };

  // api call to stop a game
  const stopGame = async () => {
    const response = await apiCall(`admin/quiz/${id}/end`, 'POST', {});
    if (!response.ok) {
      const errorMsg = await response.json();
      setError(errorMsg.error);
      return [400, errorMsg.error];
    }
    setPrevSessionId(sessionId);
    setSessionId(0);
    return [200, sessionId];
  };

  // api call to delete a game
  const deleteGame = async () => {
    if (sessionId !== 0) {
      setError('Session still active');
      return null;
    }
    const response = await apiCall(`admin/quiz/${id}`, 'DELETE', {});
    updateList();
    if (!response.ok) {
      const errorMsg = await response.json();
      return [400, errorMsg.error];
    }
    return [200, null];
  };

  const getSessionStatus = async () => {
    const response = await apiCall(
      `admin/session/${sessionId}/status`,
      'GET',
      {}
    );
    const data = await response.json();
    if (!data.results.active) {
      setPrevSessionId(sessionId);
      setSessionId(0);
    }

    return data.results.active;
  };

  // advances the game
  const advanceQuestion = async () => {
    await apiCall(`admin/quiz/${id}/advance`, 'POST', {});
    getSessionStatus();
  };

  // hides error after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <Center py={6} id={`${name}`}>
      <Stack
        borderWidth='1px'
        borderRadius='lg'
        w={'90%'}
        h={'90%'}
        minH={100}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        padding={4}
      >
        <Flex flex={1} bg='blue.200' justify={'center'}>
          {thumbnail
            ? (<Image objectFit='cover' boxSize='100%' src={thumbnail} />)
            : (<Center name={'noImage'} >No Image</Center>)}
        </Flex>
        <Stack
          flex={1}
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          p={1}
          pt={2}
        >
          {error && <ErrorModal message={error} />}
          <Heading fontSize={'2xl'} fontFamily={'body'} name={'gameName'}>
            {name}
          </Heading>
          <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}
            name={'timeLimit'}
          >
            Time Limit: {timeLimit} {timeLimit === 1 ? 'second' : 'seconds'}
          </Text>
          <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
              name={'gameIdBadge'}
            >
              GAME ID: {id}
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
              name={'lengthBadge'}
            >
              {length} Questions
            </Badge>
          </Stack>
          {sessionId && (
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
            >
              CURRENT ACTIVE SESSION: {sessionId}
            </Badge>
          )}
          <HStack
            width={'100%'}
            pt={4}
            px={2}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <ModalButton
              bg={'blue.500'}
              buttonName={'Start'}
              apiCall={startGame}
              sessionId={sessionId}
              content={`Session Id: ${sessionId}`}
              w={'50%'}
            />
            <Button
              bg={'red.500'}
              w={'50%'}
              name={'deleteGameButton'}
              onClick={deleteGame}
            >
              Delete
            </Button>
          </HStack>

          <HStack
            width={'100%'}
            px={2}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Button
              w={'50%'}
              name={'editGameButton'}
              onClick={() => {
                navigate(`/edit/${id}`);
              }}
            >
              Edit
            </Button>
            <ModalButton
              buttonName={'Stop'}
              apiCall={stopGame}
              sessionId={prevSessionId}
              content={'Would you like to view the results?'}
              w={'50%'}
            />
          </HStack>
          {sessionId && (
            <Button px={4} w={'50%'} onClick={advanceQuestion}>
              Advance
            </Button>
          )}
          {prevSessionId && (
            <ModalButton
              buttonName={'Results'}
              sessionId={prevSessionId}
              content={'Would you like to view the results?'}
              w={'50%'}
            />
          )}
        </Stack>
      </Stack>
    </Center>
  );
};

GameTile.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  length: PropTypes.number,
  thumbnail: PropTypes.string,
  timeLimit: PropTypes.number,
  sessions: PropTypes.array,
  updateList: PropTypes.func,
};

export default GameTile;
