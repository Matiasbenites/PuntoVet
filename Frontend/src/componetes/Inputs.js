import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const InputBlanco = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: '#fff',
        borderRadius: '1.5rem'
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      borderRadius: '1.5rem',
      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      width: '100%'
    },
    '& label.MuiFormLabel-root': {
        color: theme.palette.text.secondary,
        fontWeight: 'bold',
        fontSize: '1.6rem'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primary.light,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E0E3E7',
        borderRadius: '1.5rem',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }));