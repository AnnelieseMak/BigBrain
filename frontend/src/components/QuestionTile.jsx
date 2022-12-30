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
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import apiCall from '../helpers/apiCall';
import { useNavigate } from 'react-router-dom';

const QuestionTile = ({ question, gameId, update }) => {
  const navigate = useNavigate();

  const thumbnail = question.media;
  const isLink = thumbnail && thumbnail.includes('http');
  // get video id from url
  const re = '[\\?&]v=([^&#]*)';
  const thumbnailUrl =
    isLink &&
    `https://i.ytimg.com/vi/${thumbnail.match(re)[1]}/maxresdefault.jpg`;

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

  const deleteQuestion = async () => {
    const gameInfo = await getGameInfo();

    if (!gameInfo) {
      return;
    }

    gameInfo.questions = gameInfo.questions.filter((q) => q.id !== question.id);

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

    update(true);
  };

  return (
    <Center py={6}>
      <Stack
        borderWidth='1px'
        borderRadius='lg'
        w={{ sm: '100%', md: '540px' }}
        height={{ sm: '476px', md: '20rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        padding={4}
      >
        <Flex display={thumbnail ? 'block' : 'none'} flex={1} bg='blue.200' justify={'center'}>
          {isLink
            ? <Link name={'thumbnailLink'} href={thumbnail} ><Image name='thumbnail' objectFit='cover' boxSize='100%' src={thumbnailUrl} /></Link>
            : <Image name='thumbnail' objectFit='cover' boxSize='100%' src={thumbnail} />}
        </Flex>
        <Stack
          flex={1}
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          p={1}
          pt={2}
        >
          <Heading fontSize={'2xl'} fontFamily={'body'} name={'questionString'}>
            {question.question}
          </Heading>
          <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}
            name={'timeLimit'}
          >
            Time Limit: {question.timeLimit}{' '}
            {question.timeLimit === 1 ? 'second' : 'seconds'}
          </Text>
          <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
            >
              Question ID: {question.id}
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
            >
              Type: {question.type} choice
            </Badge>
          </Stack>

          <HStack
            width={'100%'}
            pt={4}
            px={2}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Button
              w={'50%'}
              onClick={() => {
                navigate(`/edit/${gameId}/${question.id}`);
              }}
              name={'editQuestion'}
            >
              Edit
            </Button>
            <Button bg={'red.500'} w={'50%'} onClick={deleteQuestion}>
              Delete
            </Button>
          </HStack>
        </Stack>
      </Stack>
    </Center>
  );
};

QuestionTile.propTypes = {
  question: PropTypes.object,
  gameId: PropTypes.string,
  update: PropTypes.func,
};

export default QuestionTile;
