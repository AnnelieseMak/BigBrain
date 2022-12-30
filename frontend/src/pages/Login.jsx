import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';

import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Box align={'center'} mt={'14'}>
      <Box py={8} maxW='345' borderWidth={1} borderRadius={8} boxShadow='lg'>
        <Heading mt={2}>Login</Heading>
        <LoginForm
          success={(data) => {
            // save auth token
            sessionStorage.setItem('authToken', data.token);
            navigate('/dashboard');
          }}
        />
      </Box>
    </Box>
  );
};

export default Login;
