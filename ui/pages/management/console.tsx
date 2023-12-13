import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { SendSharp } from '@mui/icons-material';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { protect } from '../../src/helper/protect';
import { SocketEventType } from '../../src/types/socket-event.type';

function Console() {
  const socket = io(`wss://${process.env.NEXT_PUBLIC_API_HOST}/price`);

  const { user, getUser } = useAuth();
  const [output, setOutput] = useState(``);
  const [inputValue, setInputValue] = useState('');
  const outputEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on(SocketEventType.console, (message) => {
      console.log(message);
      setOutput((prevString) => `${prevString}\n${message}`);
    });

    return () => {
      socket.off(SocketEventType.console);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  const handleSendCommand = () => {
    socket.emit(SocketEventType.console, inputValue);
    setInputValue('');
  };

  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <Typography variant="h3" component="h3" gutterBottom>
          Consola
        </Typography>
        <Typography variant="subtitle2">
          {user ? `${user?.firstName}, ` : `Hola, `} aquí puedes administrar la
          base de datos de precios.
        </Typography>
      </PageTitleWrapper>
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
      >
        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: '40vh',
                maxHeight: '40vh',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 1,
                mt: 1
              }}
            >
              <Box
                sx={{
                  p: 1,
                  flexGrow: 1,
                  borderRadius: 1,
                  bgcolor: 'black',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap', // Asegura que el texto se ajuste dentro del Box
                  wordBreak: 'break-word' // Permite la ruptura de palabras para evitar overflow horizontal
                }}
                display={output.length === 0 && 'flex'}
                justifyContent={output.length === 0 && 'center'}
                alignItems={output.length === 0 && 'center'}
              >
                {output.length > 0 ? (
                  <>
                    <pre>{output}</pre>
                    <div ref={outputEndRef} />{' '}
                  </>
                ) : (
                  <CircularProgress size={48} />
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'none',
                boxShadow: 1,
                borderRadius: 1,
                border: `none`,
                p: 0,
                mt: 2
              }}
            >
              <TextField
                variant="outlined"
                sx={{
                  bgcolor: 'black',
                  borderRadius: 1,
                  flexGrow: 1,
                  p: 0
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendCommand();
                  }
                }}
              ></TextField>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2, gap: 1 }}
                onClick={handleSendCommand}
              >
                Enviar <SendSharp />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Console.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default protect(Console);
