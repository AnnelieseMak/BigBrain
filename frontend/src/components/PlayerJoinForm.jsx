import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import ErrorModal from '../components/ErrorModal';
import apiCall from '../helpers/apiCall';

const PlayerJoinForm = ({ sessionStatus, sessionId, success }) => {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // api call for player to join an active session
  const playerJoin = async () => {
    if (sessionStatus !== 'false') {
      setError('Session has already begun');
      return null;
    }
    const response = await apiCall(`play/join/${sessionId}`, 'POST', {
      name,
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      success(data.playerId, name);
    }
  };

  return (
    <Box>
      <Box
        py={8}
        mb={10}
        maxW='745'
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
      >
        {error && <ErrorModal message={error} />}
        <HStack mx={10} align={'flex-end'}>
          <FormControl isRequired>
            <FormLabel>Name:</FormLabel>
            <Input
              type='text'
              placeholder='Name'
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <Button
            maxW={60}
            variant='outline'
            colorScheme={'cyan'}
            mt={4}
            onClick={playerJoin}
          >
            Join Game
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

PlayerJoinForm.propTypes = {
  sessionStatus: PropTypes.string,
  sessionId: PropTypes.string,
  success: PropTypes.func,
};

export default PlayerJoinForm;
