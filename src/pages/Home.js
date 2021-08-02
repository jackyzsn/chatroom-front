import React, { useRef, useEffect, useState } from 'react';
import {
  Typography,
  useScrollTrigger,
  Zoom,
  Fab,
  Container,
  CssBaseline,
  Grid,
  Box,
  TextField,
  Button,
} from '@material-ui/core';
import SockJsClient from 'react-stomp';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  carouselBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bottom: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  rootExpanded: {
    flexGrow: 1,
  },
  title1: {
    textAign: 'left',
    color: '#269CEB',
    marginTop: '0px',
    float: 'left',
    clear: 'both',
  },
  title2: {
    textAign: 'left',
    color: '#FF9D00',
    marginTop: '0px',
    float: 'left',
    clear: 'both',
  },
}));

export default function Home(props) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);

  const [typedMessage, setTypedMessage] = useState('');
  const [hasUserName, setHasUserName] = useState(false);
  const clientRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (typedMessage.trim() !== '') {
      if (clientRef.current) {
        clientRef.current.sendMessage(
          '/app/user-all',
          JSON.stringify({
            name: name,
            message: typedMessage,
            timestamp: moment().format(),
          })
        );
        setTypedMessage('');
      } else {
        console.log('!!!! no current ref !!!!');
      }
    }
  };

  const displayMessages =
    messages &&
    messages.map((msg) => {
      return (
        <div>
          {name === msg.name ? (
            <div>
              <p className={classes.title1}>{msg.name} : </p>
              <br />
              <p>
                {msg.timestamp}: {msg.message}
              </p>
            </div>
          ) : (
            <div>
              <p className={classes.title2}>{msg.name} : </p>
              <br />
              <p>
                {msg.timestamp}: {msg.message}
              </p>
            </div>
          )}
        </div>
      );
    });

  function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    return (
      <Zoom in={trigger}>
        <div onClick={handleClick} role="presentation" className={classes.bottom}>
          {children}
        </div>
      </Zoom>
    );
  }

  return (
    <div>
      <div id="back-to-top-anchor"></div>
      <Container component="main" maxWidth="md">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={5} mb={2}>
              <Typography variant="h1" component="h1" color="textPrimary">
                Mouse Chatroom
              </Typography>
            </Box>
          </Grid>
          {!hasUserName && (
            <Container component="main" maxWidth="md">
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item xs={10}>
                  <Box display="flex" justifyContent="center" mt={5} mb={2}>
                    <TextField
                      id="outlined-basic"
                      label="Enter your user name"
                      variant="outlined"
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          setHasUserName(true);
                        }
                      }}
                      autoFocus
                      value={name}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box display="flex" justifyContent="center" mt={5} mb={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={name.trim() === ''}
                      onClick={() => {
                        setHasUserName(true);
                      }}
                      fullWidth
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          )}

          {hasUserName && (
            <React.Fragment>
              <Container component="main" maxWidth="md">
                <Grid item xs={12}>
                  <Box style={{ maxHeight: '60vh', minHeight: '60vh', overflow: 'auto' }}>
                    {displayMessages}
                    <div ref={scrollRef}></div>
                  </Box>
                </Grid>
              </Container>
              <Grid item xs={10}>
                <Box display="flex" justifyContent="center" mt={5} mb={2}>
                  <TextField
                    id="outlined-basic"
                    label="Enter Message to Send"
                    variant="outlined"
                    onChange={(event) => {
                      setTypedMessage(event.target.value);
                    }}
                    value={typedMessage}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                    autoFocus
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box display="flex" justifyContent="center" mt={5} mb={2}>
                  <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
                    Send
                  </Button>
                </Box>
              </Grid>
            </React.Fragment>
          )}
        </Grid>

        <CssBaseline />
      </Container>
      <SockJsClient
        url="/websocket-chat/"
        topics={['/topic/user']}
        onConnect={() => {
          console.log('connected');
        }}
        onDisconnect={() => {
          console.log('Disconnected');
        }}
        onMessage={(msg) => {
          var wrkMessages = messages;
          wrkMessages.push(msg);

          setMessages([...wrkMessages]);
        }}
        ref={clientRef}
      />

      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
}
