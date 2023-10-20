import { Typography, Button, Grid } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';

function PageHeader() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (!user) {
      const handleGetUser = async () => await getUser();
      handleGetUser();
    }
  }, []);

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="subtitle2">
          {user ? `${user?.firstName}, ` : `Hi, `} these are your recent
          transactions
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create transaction
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
