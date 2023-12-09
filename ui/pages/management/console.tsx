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
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import io from 'socket.io-client';

import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { protect } from '../../src/helper/protect';

function Console() {
  const socket = io('ws://localhost:4000/cmd');

  const { user, getUser } = useAuth();
  const [output, setOutput] = useState(``);

  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  useEffect(() => {
    socket.connect();

    socket.send('ls');

    socket.on('message', (message) => {
      setOutput(`${output}\n${message}`);
    });

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, []);

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
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                minHeight: '300px',
                maxHeight: '300px ',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
                mt: 3
              }}
            >
              <Box
                sx={{
                  p: 1,
                  flexGrow: 1,
                  borderRadius: 1,
                  bgcolor: 'black',
                  overflow: 'auto'
                }}
                display={output.length === 0 && 'flex'}
                justifyContent={output.length === 0 && 'center'}
                alignItems={output.length === 0 && 'center'}
              >
                {output.length > 0 ? output : <CircularProgress size={48} />}
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
              ></TextField>
              <NextLink href="#">
                <Button variant="contained" size="small" sx={{ ml: 2, gap: 1 }}>
                  Enviar <SendSharp />
                </Button>
              </NextLink>
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
