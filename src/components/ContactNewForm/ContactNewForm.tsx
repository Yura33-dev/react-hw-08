import { useContext, useId } from 'react';
import { useAppDispatch, useAppSelector } from '../../helpers/hooks/reduxHooks';
import { FormikHelpers, useFormik } from 'formik';
import toast from 'react-hot-toast';
import { addContact } from '../../redux/contacts/operations';
import { selectLoading } from '../../redux/contacts/selectors';
import { ModalWindowContext } from '../../helpers/context/modal.context';
import { addContactSchema } from '../../helpers/schemasValidation/addContactSchemaValidation';
import AlertMessage from '../ui/AlertMessage/AlertMessage';

import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  InputAdornment,
  TextField,
  useMediaQuery,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { ModalConstants } from '../../helpers/constants/modalConstants';

interface IFormikValues {
  name: string;
  number: string;
}

function ContactNewForm() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoading);

  const { handleModalClose } = useContext(ModalWindowContext);

  const nameFieldId = useId();
  const numberFieldId = useId();

  const initValues: IFormikValues = { name: '', number: '' };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: addContactSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(
    contact: IFormikValues,
    actions: FormikHelpers<IFormikValues>
  ) {
    try {
      await dispatch(addContact(contact)).unwrap();
      actions.resetForm();
      toast.custom(<AlertMessage message="Contact has been added" />);
      handleModalClose(ModalConstants.New);
    } catch (error) {
      toast.custom(
        <AlertMessage
          severity="error"
          message="Something went wrong. Please, try again!"
        />
      );
    }
  }

  const isScreenXS = useMediaQuery('(max-width:600px)');
  const circularProgressProp = {
    size: isScreenXS ? 25 : 40,
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      sx={{
        mt: 4,
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id={numberFieldId}
          name="number"
          label="Phone number"
          type="text"
          value={formik.values.number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.number && Boolean(formik.errors.number)}
          helperText={formik.touched.number && formik.errors.number}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalPhoneOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <ButtonGroup
        orientation="vertical"
        disabled={isLoading}
        sx={{ gap: '10px', mt: 3 }}
      >
        <Button color="primary" variant="contained" fullWidth type="submit">
          {isLoading ? (
            <CircularProgress
              {...circularProgressProp}
              sx={{ color: 'secondary.main' }}
            />
          ) : (
            'Add contact'
          )}
        </Button>

        <Button
          variant="text"
          onClick={() => handleModalClose(ModalConstants.New)}
        >
          Back
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default ContactNewForm;
