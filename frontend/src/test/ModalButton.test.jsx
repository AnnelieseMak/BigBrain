import React from 'react';
import { mount } from 'enzyme';
import ModalButton from '../components/ModalButton';
import { BrowserRouter } from 'react-router-dom';

describe('Modal Button', () => {
  it('uses custom button', () => {
    const buttonName = 'Custom Text';
    const modal = mount(
      <BrowserRouter>
        <ModalButton buttonName={buttonName}></ModalButton>
      </BrowserRouter>
    );
    const b = modal.find({ name: `${buttonName}` }).find('ButtonContent');
    expect(b.text()).toEqual(`${buttonName}`);
  });

  it('opens start modal', () => {
    const buttonName = 'Start';
    const modal = mount(
      <BrowserRouter>
        <ModalButton buttonName={buttonName}></ModalButton>
      </BrowserRouter>
    );
    const b = modal.find('button').simulate('click');
    expect(b.text()).toEqual(`${buttonName}`);
  });
});
