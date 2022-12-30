import React from 'react';
import { Box, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ErrorModal = ({ message }) => {
  return (
    <Box my={4} name={'errorModal'}>
      <Alert status='error' borderRadius={4}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
};

ErrorModal.propTypes = {
  message: PropTypes.string,
};

export default ErrorModal;
