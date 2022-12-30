import React from 'react';
import { mount } from 'enzyme';
import GameTile from '../components/GameTile';
import { Center } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Game Tile', () => {
  it('uses custom id', () => {
    const id = 2;
    const gameTile = mount(
      <BrowserRouter>
        <GameTile id={id}></GameTile>
      </BrowserRouter>
    );
    const badge = gameTile.find({ name: 'gameIdBadge' }).find('span');
    expect(badge.text()).toEqual(`GAME ID: ${id}`);
  });

  it('uses custom name', () => {
    const name = 'Custom Text';
    const gameTile = mount(
      <BrowserRouter>
        <GameTile name={name}></GameTile>
      </BrowserRouter>
    );
    const heading = gameTile.find({ name: 'gameName' }).find('h2');
    expect(heading.text()).toEqual(`${name}`);
  });

  it('uses custom number of questions', () => {
    const length = 6;
    const gameTile = mount(
      <BrowserRouter>
        <GameTile length={length}></GameTile>
      </BrowserRouter>
    );
    const badge = gameTile.find({ name: 'lengthBadge' }).find('span');
    expect(badge.text()).toEqual(`${length} Questions`);
  });

  it('uses custom thumbnail', () => {
    const thumbnail =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const gameTile = mount(
      <BrowserRouter>
        <GameTile thumbnail={thumbnail}></GameTile>
      </BrowserRouter>
    );
    expect(gameTile.find({ src: `${thumbnail}` }).find('img'));
  });

  it('uses no image when no thumbnail', () => {
    const gameTile = mount(
      <BrowserRouter>
        <GameTile></GameTile>
      </BrowserRouter>
    );
    const game = gameTile.find(Center).find('.css-gmuwbf');
    expect(game.text()).toEqual('No Image');
  });

  it('uses custom time limit', () => {
    const timeLimit = 60;
    const gameTile = mount(
      <BrowserRouter>
        <GameTile timeLimit={timeLimit}></GameTile>
      </BrowserRouter>
    );
    const text = gameTile.find('p').find({ name: 'timeLimit' });
    expect(text.text()).toEqual(`Time Limit: ${timeLimit} seconds`);
  });
});
