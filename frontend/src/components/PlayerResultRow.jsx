import React from 'react';
import { Box, HStack, Divider, Icon, VStack, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

const PlayerResultRow = ({ index, r, questionPoints }) => {
  const questionIsFound = questionPoints[index];

  return (
    <Box>
      <HStack key={index} justify={'space-between'} h={40} px={10}>
        <Text fontWeight={'bold'}>Question {index + 1}</Text>
        <VStack textAlign={'center'}>
          <Text>Time Taken (seconds)</Text>
          <Text>{r.timeTaken ? `${r.timeTaken}` : ' No Attempt'}</Text>
        </VStack>
        <VStack textAlign={'center'}>
          <Icon as={r.correct ? CheckIcon : CloseIcon} boxSize={7} m={2} />
          <Text display={!questionIsFound ? 'block' : ' none'}>unknown</Text>
          <Text display={questionIsFound ? 'block' : ' none'}>
            {questionPoints[index]}{' '}
            {questionPoints[index] === 1 ? 'Point' : 'Points'}
          </Text>
        </VStack>
      </HStack>
      <Divider my={1} w={'100%'} />
    </Box>
  );
};

PlayerResultRow.propTypes = {
  index: PropTypes.number,
  r: PropTypes.object,
  questionPoints: PropTypes.array,
};

export default PlayerResultRow;
