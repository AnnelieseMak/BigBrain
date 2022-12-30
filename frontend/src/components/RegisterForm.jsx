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

const RegisterForm = ({ success }) => {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // register apiCall
  const register = async (e) => {
    e.preventDefault();

    const response = await apiCall('admin/auth/register', 'POST', {
      email,
      password,
      name,
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      navigate('/register');
    } else {
      success(data);
    }
  };

  return (
    <Flex align='center' justifyContent='center'>
      <Box my={4} textAlign='left'>
        <form onSubmit={register}>
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
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              id='name'
              placeholder='John Smith'
              size={'md'}
              onChange={(e) => {
                setName(e.currentTarget.value);
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
            id='registerButton'
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

RegisterForm.propTypes = {
  success: PropTypes.func,
};

export default RegisterForm;
