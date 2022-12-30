import React from 'react';
import {
  Box,
  Divider,
  Heading,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import Snake from './Snake';

const Lobby = () => {
  return (
    <Box align={'center'} mt={'10'}>
      <Box
        mt={4}
        py={8}
        maxW='745'
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
        bg={useColorModeValue('white', 'gray.900')}
      >
        <Heading mb={5}>LOBBY</Heading>
        <Divider my={4} maxW={745} />
        <Box minH={256} mx={5}>
          <Snake />
        </Box>
        <Box borderWidth={1} textAlign={'left'}>
          <Text>
            <Icon as={InfoOutlineIcon} boxSize={6} m={2} />
            Waiting for players...
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Lobby;
