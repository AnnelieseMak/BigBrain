/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Box,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import apiCall from '../helpers/apiCall';
import QuestionTile from '../components/QuestionTile';
import CreateQuestionForm from '../components/CreateQuestionForm';
import { fileToDataUrl } from '../helpers/fileToDataUrl';

const EditGame = () => {
  const { gameId } = useParams();
  const [questions, setQuestions] = React.useState([]);
  const [updateList, setUpdateList] = React.useState(false);

  const [gameName, setGameName] = React.useState('');
  const [gameThumbnail, setGameThumbnail] = React.useState('');

  const navigate = useNavigate();

  React.useEffect(() => {
    getGameInfo().then((data) => {
      setQuestions(data.questions);
      setGameName(data.name);
      setGameThumbnail(data.thumbnail);
      setUpdateList(false);
    });
  }, [updateList]);

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

    const gameInfo = await getGameInfo();
    if (!gameInfo) {
      return;
    }

    const body = {
      questions: gameInfo.questions,
      name: gameName,
      thumbnail: `${gameThumbnail === '' ? gameInfo.thumbnail : gameThumbnail}`,
    };

    const response = await apiCall(`admin/quiz/${gameId}`, 'PUT', body);
    const data = await response.json();
    if (!response.ok) {
      // Game no longer exists
      return false;
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Box align={'center'} mt={'10'}>
      <Box
        mt={4}
        py={8}
        maxW='745'
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
      >
        <Heading>Update Game Info</Heading>
        <form onSubmit={updateGame}>
          <Box mx={10}>
            <HStack my={2} align={'flex-end'}>
              <FormControl isRequired>
                <FormLabel>Game Name</FormLabel>
                <Input
                  type='text'
                  placeholder='E.g COMP6080'
                  defaultValue={gameName}
                  onChange={(e) => {
                    setGameName(e.target.value);
                  }}
                  id={'editGameName'}
                />
              </FormControl>
              <Button
                maxW={60}
                minW={40}
                variant='outline'
                colorScheme={'cyan'}
                mt={4}
                type='submit'
                id='updateGameButton'
              >
                Update Game Info
              </Button>
            </HStack>
            <FormControl mt={2}>
              <FormLabel>Thumbnail:</FormLabel>
              <Input
                type='file'
                accept='image/jpeg, image/png, image/jpg'
                onChange={(e) => {
                  fileToDataUrl(e.target.files[0]).then((dataUrl) => {
                    setGameThumbnail(dataUrl);
                  });
                }}
                id={'editGameThumbnailUpload'}
              />
            </FormControl>
          </Box>
        </form>
      </Box>
      <Divider my={4} maxW='745' />
      <CreateQuestionForm gameId={gameId} update={setUpdateList} />
      <Divider my={4} maxW='745' />
      <Box
        mt={4}
        py={8}
        maxW='745'
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
      >
        <Heading my={8}>Edit Questions</Heading>
        {questions.map((question, index) => {
          return (
            <QuestionTile
              question={question}
              gameId={gameId}
              key={index}
              update={setUpdateList}
            ></QuestionTile>
          );
        })}
      </Box>
    </Box>
  );
};

export default EditGame;
