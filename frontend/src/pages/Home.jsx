import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';

const Home = () => {
  return (
    <Box align={'center'}>
      <Heading my={4} size={'2xl'}>
        BigBrain
      </Heading>
      <Box my={2}>
        <Text fontSize='xl'>
          An innovative lightweight quiz platform for millenials that will
          revolutionise the secondary and tertiary education market for years.
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
