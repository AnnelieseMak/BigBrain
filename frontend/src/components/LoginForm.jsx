import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Box,
  Input,
  Flex,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import ErrorModal from './ErrorModal';
import apiCall from '../helpers/apiCall';

const LoginForm = ({ success }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // login apiCall
  const login = async (e) => {
    e.preventDefault();

    const response = await apiCall('admin/auth/login', 'POST', {
      email,
      password,
    });

    const data = await response.json();

    if (response.status === 400) {
      setError(data.error);
      navigate('/login');
    } else {
      success(data);
    }
  };

  return (
    <Flex align='center' justifyContent='center'>
      <Box my={4} textAlign='left'>
        <form onSubmit={login}>
          {error && <ErrorModal message={error} />}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              id='email'
              placeholder='name@email.com'
              size={'md'}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              id='password'
              placeholder='****'
              size={'md'}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
              }}
            />
          </FormControl>
          <Button
            variant='outline'
            colorScheme={'cyan'}
            width='full'
            mt={4}
            type='submit'
            id='loginButton'
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

LoginForm.propTypes = {
  success: PropTypes.func,
};

export default LoginForm;
