import React from 'react';
import { shallow } from 'enzyme';
import EditAnswerBox from '../components/EditAnswerBox';
import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

describe('Edit Answer Box', () => {
  it('uses custom text', () => {
    const text = 'Custom Text';
    const editAnswerBox = shallow(<EditAnswerBox text={text}></EditAnswerBox>);
    expect(editAnswerBox.find(Editable).prop('defaultValue')).toEqual(text);
  });

  it('uses custom index on checkbox ', () => {
    const index = 1;
    const editAnswerBox = shallow(
      <EditAnswerBox index={index}></EditAnswerBox>
    );
    expect(editAnswerBox.find(Checkbox).prop('aria-label')).toEqual(
      `checkbox-${index}`
    );
  });

  it('uses custom index on editable input ', () => {
    const index = 1;
    const editAnswerBox = shallow(
      <EditAnswerBox index={index}></EditAnswerBox>
    );
    expect(editAnswerBox.find(EditableInput).prop('id')).toEqual(
      `answer-${index}`
    );
  });

  it('uses custom index on editable preview ', () => {
    const index = 1;
    const editAnswerBox = shallow(
      <EditAnswerBox index={index}></EditAnswerBox>
    );
    expect(editAnswerBox.find(EditablePreview).prop('id')).toEqual(
      `answerPreview-${index}`
    );
  });

  it('uses sets checkbox to defaultChecked', () => {
    const defaultCheck = true;
    const editAnswerBox = shallow(
      <EditAnswerBox defaultCheck={defaultCheck}></EditAnswerBox>
    );
    expect(editAnswerBox.find(Checkbox).prop('defaultChecked')).toEqual(
      defaultCheck
    );
  });
});
