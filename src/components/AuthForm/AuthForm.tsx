import { useId, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../helpers/hooks/reduxHooks';
import { FormikHelpers, useFormik } from 'formik';
import { login, register } from '../../redux/auth/operations';
import { selectIsLoading } from '../../redux/auth/selectors';
import {
  loginSchema,
  registerSchema,
} from '../../helpers/schemasValidation/authSchemasValidation';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type AuthFormProps = {
  authType: string;
};

interface IFormikValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function AuthForm({ authType }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const [showPass, setShowPass] = useState<boolean>(false);
  const handleClickShowPass = () => setShowPass(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const nameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const confirmPasswordFieldId = useId();

  const initValues: IFormikValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema =
    authType === 'Register' ? registerSchema : loginSchema;

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  function handleSubmit(
    values: IFormikValues,
    actions: FormikHelpers<IFormikValues>
  ) {
    switch (authType) {
      case 'Register':
        dispatch(
          register({
            name: values.name,
            email: values.email,
            password: values.password,
          })
        );
        break;
      case 'Login':
        dispatch(login({ email: values.email, password: values.password }));
        break;
    }
    actions.resetForm();
  }

  const isScreenXS = useMediaQuery('(max-width:600px)');
  const circularProgressProp = {
    size: isScreenXS ? 25 : 40,
  };

  const tabletDesktopStyles = {
    maxWidth: { sm: '320px' },
    margin: { sm: '0 auto' },
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {authType === 'Register' && (
        <TextField
          id={nameFieldId}
          name="name"
          label="Full name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          required
          fullWidth
          sx={tabletDesktopStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      <TextField
        id={emailFieldId}
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
        required
        sx={tabletDesktopStyles}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AlternateEmailOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        id={passwordFieldId}
        name="password"
        label="Password"
        type={showPass ? 'text' : 'password'}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
        required
        sx={tabletDesktopStyles}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPass}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <LockOpenOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />

      {authType === 'Register' && (
        <TextField
          id={confirmPasswordFieldId}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          fullWidth
          required
          sx={tabletDesktopStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DoneOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        disabled={isLoading}
        sx={tabletDesktopStyles}
      >
        {isLoading ? (
          <CircularProgress
            {...circularProgressProp}
            sx={{ color: 'secondary.main' }}
          />
        ) : (
          authType
        )}
      </Button>
    </Box>
  );
}

export default AuthForm;
