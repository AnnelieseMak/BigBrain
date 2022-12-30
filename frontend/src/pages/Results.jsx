import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import BarChart from '../components/BarChart';
import apiCall from '../helpers/apiCall';

const Results = () => {
  const { sessionId } = useParams();
  const [gameQuestions, setGameQuestions] = React.useState([]);
  const [topScores, setTopScores] = React.useState([]);
  const [questionStats, setQuestionStats] = React.useState([]);
  const [correctData, setCorrectData] = React.useState({});
  const [responseTimeData, setResponseTimeData] = React.useState({});
  const [playerCount, setPlayerCount] = React.useState(0);
  const [graphsSet, setGraphSet] = React.useState(false);

  React.useEffect(() => {
    updateSessionResults();
  }, [gameQuestions]);

  const updateSessionResults = async () => {
    if (!gameQuestions || gameQuestions.length === 0) {
      await getSessionInfo();
    } else {
      getSessionResults();
    }
  };

  // get game session status
  const getSessionInfo = async () => {
    const response = await apiCall(
      `admin/session/${sessionId}/status`,
      'GET',
      {}
    );
    const data = await response.json();
    const info = data.results;
    const listQ = [];
    for (let i = 0; i < info.questions.length; i++) {
      const dict = {
        question: i + 1,
        time: 0,
        answerCount: 0,
        correctCount: 0,
      };
      listQ.push(dict);
    }
    setQuestionStats(listQ);
    setPlayerCount(info.players.length);
    setGameQuestions(info.questions);
  };

  // randomly generates colour for charts
  const randomColours = () => {
    const backgroundCol = [];
    const borderCol = [];
    for (let i = 0; i < gameQuestions.length; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      backgroundCol.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
      borderCol.push('rgba(' + r + ', ' + g + ', ' + b + ', 1)');
    }

    return [backgroundCol, borderCol];
  };

  const formatChartData = (stat, label, maxY, yLabel) => {
    const colour = randomColours();
    const backgroundCol = colour[0];
    const borderCol = colour[1];

    const chartDict = {
      chartData: {
        labels: questionStats.map((data) => data.question),
        datasets: [
          {
            data: questionStats.map((data) => data[stat]),
            backgroundColor: backgroundCol,
            borderColor: borderCol,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: label,
          },
        },
        scales: {
          y: {
            grid: {
              display: false,
            },
            max: maxY,
            title: {
              display: true,
              text: yLabel,
            },
          },
          x: {
            title: {
              display: true,
              text: 'QUESTION',
            },
          },
        },
      },
    };

    return chartDict;
  };

  // get game session results
  const getSessionResults = async () => {
    const response = await apiCall(
      `admin/session/${sessionId}/results`,
      'GET',
      {}
    );
    const data = await response.json();
    const players = data.results;

    const allScores = [];
    for (let i = 0; i < players.length; i++) {
      const name = players[i].name;
      const playerScore = calculateScores(players[i]);
      allScores.push([name, playerScore]);
    }
    allScores.sort((first, second) => {
      return second[1] - first[1];
    });
    const topFive = allScores.slice(0, 5);
    for (let i = 0; i < questionStats.length; i++) {
      questionStats[i].avg = Math.round(questionStats[i].time / playerCount);
      questionStats[i].percentageCorrect = Math.round(
        (questionStats[i].correctCount / playerCount) * 100
      );
    }
    const percentageCorrect = formatChartData(
      'percentageCorrect',
      'Percentage Correct',
      100,
      'percentage (%)'
    );
    const avgChartData = formatChartData(
      'avg',
      'Average Response Time',
      null,
      'seconds (s)'
    );
    setCorrectData(percentageCorrect);
    setResponseTimeData(avgChartData);
    setGraphSet(true);

    setTopScores(topFive);
  };

  // score calculations
  const calculateScores = (player) => {
    const playerAnswers = player.answers;
    let playerScore = 0;
    // looping through each QUESTION
    for (let i = 0; i < playerAnswers.length; i++) {
      if (playerAnswers[i].correct) {
        questionStats[i].correctCount += 1;
        playerScore += gameQuestions[i].points;
      }
      const timeTaken = calculateTime(
        playerAnswers[i].questionStartedAt,
        playerAnswers[i].answeredAt,
        i
      );
      if (timeTaken) {
        questionStats[i].time += timeTaken;
        questionStats[i].answerCount += 1;
      }
    }
    return playerScore;
  };

  // calculate time taken to answer a question
  const calculateTime = (startTime, answerTime, i) => {
    if (!startTime || !answerTime) {
      return null;
    }
    const qStartTime = new Date(startTime);
    const endTime = new Date(answerTime);
    const diff = (endTime - qStartTime) / 1000;
    return Math.round(diff);
  };

  return (
    <Box align={'center'} m={'14'} borderWidth={1}>
      <Heading my={6}>Results for session: {sessionId}</Heading>
      <HStack justifyContent={'center'}>
        <Box p={2}>
          TOP 5 PLAYERS and SCORES
          {topScores.map((player, index) => (
            <HStack key={index} justifyContent={'center'}>
              <Text>{player[0]}</Text>
              <Text>{player[1]}</Text>
            </HStack>
          ))}
        </Box>
        <Box w={'75%'}>
          {graphsSet && (
            <BarChart
              chartData={correctData.chartData}
              options={correctData.options}
            />
          )}
          {graphsSet && (
            <BarChart
              chartData={responseTimeData.chartData}
              options={responseTimeData.options}
            />
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default Results;
