import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Heading, Input } from '@chakra-ui/react';
import ErrorModal from '../components/ErrorModal';
import apiCall from '../helpers/apiCall';

const Play = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (code) {
      setSessionId(code);
    }
  }, []);

  // join the player into an active gave
  const playerJoin = async () => {
    const response = await apiCall(`play/join/${sessionId}`, 'POST', {
      name,
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      navigate(`/session/${sessionId}`, {
        state: { playerId: data.playerId, playerName: name },
      });
    }
  };

  // hide error message after 5 seconds of showing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // click join button, throwing error if name is not entered
  const handleClick = () => {
    if (name === '') {
      setError('Please input a name');
      return null;
    }
    playerJoin();
  };

  return (
    <Box align={'center'} mt={'14'}>
      <Box borderWidth={1} maxW='345' p={4} borderRadius={8}>
        <Heading>JOIN A GAME!</Heading>
        {error && <ErrorModal message={error} />}
        <Input
          type='text'
          textAlign={'center'}
          placeholder='Session Id'
          size={'md'}
          mt={8}
          value={code}
          onChange={(e) => {
            setSessionId(e.currentTarget.value);
          }}
        />
        <Input
          type='text'
          textAlign={'center'}
          placeholder='Name'
          size={'md'}
          mt={4}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
        <Button onClick={handleClick} width='full' mt={4}>
          Enter
        </Button>
      </Box>
    </Box>
  );
};

export default Play;
