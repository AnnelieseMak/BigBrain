import React from 'react';
import {
  Box,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import ErrorModal from './ErrorModal';
import apiCall from '../helpers/apiCall';

const CreateGameForm = () => {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  // createGame apiCall
  const createGame = async () => {
    const response = await apiCall('admin/quiz/new', 'POST', {
      name,
    });

    const data = await response.json();

    if (response.status === 400) {
      setError(data.error);
    } else {
      console.log('created game');
    }
  };

  return (
    <Box py={8} maxW='745' borderWidth={1} borderRadius={8} boxShadow='lg'>
      <form onSubmit={createGame}>
        {error && <ErrorModal message={error} />}
        <HStack mx={10} align={'flex-end'}>
          <FormControl isRequired>
            <FormLabel>Create a New Game:</FormLabel>
            <Input
              type='text'
              id='gameName'
              placeholder='Game name'
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </FormControl>
          <Button
            maxW={60}
            minW={40}
            variant='outline'
            colorScheme={'cyan'}
            mt={4}
            type='submit'
            id='createGameButton'
          >
            Create Game
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default CreateGameForm;
