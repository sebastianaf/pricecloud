import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

import Text from '@/components/Text';
import Label from '@/components/Label';
import { useAuth } from '../../../../contexts/AuthContext';
import { protect } from '../../../../helper/protect';
import { AwsCredentialsType } from '../../../../types/aws-credentials.type';
import useCredentials from '../../../../hooks/useCredentials';

function AmazonWebServicesSettingsTab() {
  const { isLoading, setCredentials, credentials } = useCredentials();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showAccessId, setShowAccessId] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm<AwsCredentialsType>();

  const handleEdit = () => {
    if (isEditable) {
      onSubmit();
    } else {
      setIsEditable(!isEditable);
    }
  };

  const onSubmit = handleSubmit(async (data: AwsCredentialsType) => {
    setIsEditable(false);
    setCredentials({
      awsAccessId: data.accessId,
      awsSecretKey: data.secretKey
    });
    reset();
  });

  const handleClickShowAccessId = () => {
    setShowAccessId(!showAccessId);
  };

  const handleMouseDownAccessId = (event: any) => {
    event.preventDefault();
  };

  const handleClickShowSecretKey = () => {
    setShowSecretKey(!showSecretKey);
  };
  const handleMouseDownSecretKey = (event: any) => {
    event.preventDefault();
  };

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              gap={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Credenciales de acceso
                </Typography>
                <Typography variant="subtitle2">
                  Asegurate de agregar los permisos AmazonS3FullAccess y
                  AmazonEC2FullAccess.
                </Typography>
              </Box>
              <Button
                variant={'outlined'}
                color={isEditable ? 'success' : 'info'}
                startIcon={
                  isEditable ? <CheckCircleIcon /> : <EditTwoToneIcon />
                }
                onClick={handleEdit}
                disabled={isLoading}
              >
                {isEditable ? (
                  isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Guardar'
                  )
                ) : (
                  'Editar'
                )}
              </Button>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      ID de acceso:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{ maxWidth: { xs: 'auto', sm: 300, md: 500 } }}>
                      {isEditable ? (
                        <TextField
                          id="accessId"
                          variant="outlined"
                          fullWidth
                          type={showAccessId ? 'text' : 'password'}
                          {...register('accessId', {
                            required: {
                              value: true,
                              message: 'Por favor indique su id de acceso'
                            }
                          })}
                          helperText={errors?.accessId?.message}
                          error={!!errors?.accessId?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowAccessId}
                                  onMouseDown={handleMouseDownAccessId}
                                  edge="end"
                                >
                                  {showAccessId ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ) : credentials ? (
                        credentials?.awsAccessId ? (
                          <Label color="success">
                            <DoneTwoToneIcon fontSize="medium" />
                            <b>Configurado</b>
                          </Label>
                        ) : (
                          <Label color="black">
                            <InfoOutlined fontSize="medium" />
                            <b>Sin configurar</b>
                          </Label>
                        )
                      ) : (
                        <CircularProgress size={16} />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Clave de acceso:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{ maxWidth: { xs: 'auto', sm: 300, md: 500 } }}>
                      {isEditable ? (
                        <TextField
                          id="secretKey"
                          variant="outlined"
                          fullWidth
                          type={showSecretKey ? 'text' : 'password'}
                          {...register('secretKey', {
                            required: {
                              value: true,
                              message: 'Por favor indique su clave de acceso'
                            }
                          })}
                          helperText={errors?.secretKey?.message}
                          error={!!errors?.secretKey?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowSecretKey}
                                  onMouseDown={handleMouseDownSecretKey}
                                  edge="end"
                                >
                                  {showSecretKey ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ) : credentials ? (
                        credentials?.awsSecretKey ? (
                          <Label color="success">
                            <DoneTwoToneIcon fontSize="medium" />
                            <b>Configurado</b>
                          </Label>
                        ) : (
                          <Label color="black">
                            <InfoOutlined fontSize="medium" />
                            <b>Sin configurar</b>
                          </Label>
                        )
                      ) : (
                        <CircularProgress size={16} />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}

export default protect(AmazonWebServicesSettingsTab);
