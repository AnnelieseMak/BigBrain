import React from 'react';
import {
  Box,
  HStack,
  Checkbox,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const EditAnswerBox = ({ text, index, updateAnswers, defaultCheck }) => {
  const [isChecked, setIsChecked] = React.useState(defaultCheck);
  const [answer, setAnswer] = React.useState(text);

  React.useEffect(() => {
    updateAnswers(index, answer, isChecked);
  }, [answer, isChecked]);

  return (
    <Box mt={4}>
      <HStack>
        <Checkbox
          defaultChecked={defaultCheck}
          onChange={(e) => {
            setIsChecked(e.target.checked);
          }}
          aria-label={`checkbox-${index}`}
        />
        <Editable defaultValue={text} minW={100}>
          <EditablePreview id={`answerPreview-${index}`} />
          <EditableInput
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            id={`answer-${index}`}
          />
        </Editable>
      </HStack>
    </Box>
  );
};

EditAnswerBox.propTypes = {
  text: PropTypes.string,
  index: PropTypes.number,
  updateAnswers: PropTypes.func,
  defaultCheck: PropTypes.bool,
};

export default EditAnswerBox;
