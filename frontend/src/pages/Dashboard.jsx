/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Heading } from '@chakra-ui/react';
import apiCall from '../helpers/apiCall';
import CreateGameForm from '../components/CreateGameForm';
import GameTile from '../components/GameTile';

const Dashboard = () => {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem('authToken');
  const [games, setGames] = React.useState([]);
  const [updateList, setUpdateList] = React.useState(false);

  React.useEffect(() => {
    if (!authToken) {
      navigate('/login');
    } else {
      getList();
    }
  }, [authToken, updateList]);

  const totalTime = (questions) => {
    return questions.reduce((acc, question) => {
      return acc + question.timeLimit;
    }, 0);
  };

  // get list of games
  const getList = async () => {
    const response = await apiCall('admin/quiz', 'GET', {});
    if (response.ok) {
      const data = await response.json();
      const gameInfo = [];
      for (let i = 0; i < data.quizzes.length; i++) {
        const info = await getGameInfo(data.quizzes[i].id);
        info.id = data.quizzes[i].id;
        info.timeLimit = totalTime(info.questions);
        gameInfo.push(info);
      }
      setUpdateList(false);
      setGames(gameInfo);
    }
  };

  const getGameInfo = async (gameId) => {
    const response = await apiCall(`admin/quiz/${gameId}`, 'GET', {});
    const data = await response.json();
    if (!response.ok) {
      // Game no longer exists
      return false;
    } else {
      return data;
    }
  };

  return (
    <Box align={'center'} mt={'10'}>
      <CreateGameForm />
      <Divider my={4} maxW='745' />
      <Box
        mt={4}
        py={8}
        maxW='745'
        borderWidth={1}
        borderRadius={8}
        boxShadow='lg'
      >
        <Heading my={8}>Dashboard</Heading>
        {games.map((game) => {
          return (
            <GameTile
              key={game.id}
              id={game.id}
              name={game.name}
              length={game.questions.length}
              thumbnail={game.thumbnail}
              timeLimit={game.timeLimit}
              sessions={game.oldSessions}
              updateList={setUpdateList}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Dashboard;
