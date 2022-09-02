import React, { useEffect } from 'react';
import { Button, Grid, RadioGroup, Radio, FormControlLabel, Container, CircularProgress } from '@material-ui/core';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import ResultsBar from './components/ResultsBar';

const SOCKET_URL = "http://" + window.location.hostname + ":8082/ws"
const votingAPI_URL = "http://" + window.location.hostname + ":8080"
var stompClient = null;

function App() {
  const [selected, setSelected] = React.useState(null);
  const [results, setResults] = React.useState('');
  const [poll, setPoll] = React.useState('');
  const [hasVoted, setHasVoted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [totalVotes, setTotalVotes] = React.useState(0);

  const connect = () => {
    let sock = new SockJS(SOCKET_URL)
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    stompClient.subscribe('/topic/poll', onPollReceived)
    stompClient.subscribe('/topic/results', onResultsReceived)
    stompClient.send("/app/getPoll", {});
  }

  const onError = (err) => {
    console.log(err);
  }

  const onResultsReceived = (results) => {
    const resultsParsed = JSON.parse(results.body)
    setResults(resultsParsed);
    let votes = 0;
    for (let i = 0; i < resultsParsed.length; i++) {
      votes += parseInt(resultsParsed[i].votes);
    }
    setTotalVotes(votes);
  }

  const onPollReceived = (poll) => {
    setPoll(JSON.parse(poll.body));
  }

  const handleChange = (event) => {
    setSelected(parseInt(event.target.value));
  }

  function percentage(votes, totalVotes) {
    let answer = (votes * 100) / totalVotes
    console.log(votes)
    return (votes * 100) / totalVotes
  }

  const sendVote = () => {
    if (selected !== null) {
      setLoading(true);
      let vote = {
        "pollId": poll.id,
        "choiceId": selected
      }
      axios.post(votingAPI_URL + "/vote", vote).then(res => {
        if (res.data === "Vote submitted") {
          setTimeout(function(){
            stompClient.send("/app/getResults", {}, poll.id);
            setHasVoted(true);
            setLoading(false)
          }, 1000);
        }
      })
    }
  }

  useEffect(() => {
    connect();
  }, [])


  return (
    <div>
      <Container maxWidth="sm">
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems='center'
        justifyContent='center'
        >
        
        <Grid item>
          <h1>{poll.question}</h1>
        </Grid>


        {loading &&
        <Grid item><CircularProgress /></Grid>
        }


        {hasVoted &&
        <Container>
          {Array.from(results)?.map((result, index) => (
            <ResultsBar key={index} title={result.text} votes={parseInt(result.votes)} value={percentage(result.votes, totalVotes)} />
          ))}
        </Container>
        }

        {!hasVoted && !loading &&
        <Grid container
          spacing={1}
          direction="column"
          alignItems='center'
          justifyContent='center'
          >
          <Grid item>
          <RadioGroup value={selected} onChange={handleChange}>
            {poll.choices?.map((choice, index) => (
              <FormControlLabel key={index} value={choice.id} control={<Radio color='primary' />} label={choice.text} />
            ))}
          </RadioGroup>
          </Grid>

          <Grid item>
            <Button variant="contained" color="primary" onClick={sendVote}>Submit</Button>
          </Grid>
        </Grid>
        }
      </Grid>
      </Container>
    </div>
    
  );
}

export default App;
