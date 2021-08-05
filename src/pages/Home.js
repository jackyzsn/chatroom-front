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
  title0: {
    textAign: 'left',
    color: '#828282',
  },
  title1: {
    textAign: 'left',
    color: '#269CEB',
  },
  title2: {
    textAign: 'left',
    color: '#FF9D00',
  },
}));

export default function Home(props) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);

  const { innerHeight: height } = window;

  const [typedMessage, setTypedMessage] = useState('');
  const [hasUserName, setHasUserName] = useState(false);
  const clientRef = useRef(null);
  const scrollRef = useRef(null);

  const chatWindowHeight = height * 0.7;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [messages]);

  const onConnect = () => {
    console.log('connected');
  };

  const onSetUserName = (name) => {
    if (clientRef.current) {
      clientRef.current.sendMessage(
        '/app/event',
        JSON.stringify({
          type: 'event-join',
          name: name,
        })
      );
    }
  };

  const onDisconnect = () => {
    console.log('disconnected');
  };

  const sendMessage = () => {
    if (typedMessage.trim() !== '') {
      if (clientRef.current) {
        clientRef.current.sendMessage(
          '/app/user-all',
          JSON.stringify({
            type: 'message',
            name: name,
            message: typedMessage,
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
    messages.map((msg, inx) => {
      return (
        <React.Fragment>
          {msg.type === 'event-join' && (
            <div key={inx}>
              <Typography variant="h6" component="h6" className={classes.title0}>
                {msg.timestamp} : [{msg.name}] has joined the chatroom.
              </Typography>
            </div>
          )}
          {msg.type === 'event-leave' && (
            <div key={inx}>
              <Typography variant="h6" component="h6" className={classes.title0}>
                {msg.timestamp} : [{msg.name}] has left the chatroom.
              </Typography>
            </div>
          )}
          {msg.type === 'message' && (
            <div key={inx}>
              <Typography
                variant="body1"
                component="body1"
                className={name === msg.name ? classes.title1 : classes.title2}
              >
                {msg.timestamp}: [{msg.name}]: {msg.message}
              </Typography>
            </div>
          )}
        </React.Fragment>
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
                          onSetUserName(event.target.value);
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
                        onSetUserName(name);
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
                <Box
                  style={{
                    maxHeight: chatWindowHeight,
                    minHeight: chatWindowHeight,
                    overflow: 'auto',
                  }}
                >
                  {displayMessages}
                  <div ref={scrollRef} />
                </Box>
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
        onConnect={onConnect}
        onDisconnect={onDisconnect}
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
