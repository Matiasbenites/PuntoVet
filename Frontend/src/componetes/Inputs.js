import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const InputBlanco = styled(TextField)({
    '& .MuiInputBase-input':{
        backgroundColor: '#fff',
        borderRadius: '1.5rem'
    },
    '& label.Mui-focused': {
      color: '#FFF',
      fontWeight: 'bold',
      borderRadius: '1.5rem',
      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      width: '100%'
    },
    '& label.css-1weh54j-MuiFormLabel-root-MuiInputLabel-root':{
        color: "#DE2E03",
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#B2BAC2',
      
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E0E3E7',
        borderRadius: '1.5rem',
    },
    '&:hover fieldset': {
        borderColor: '#000',
    },
    '&.Mui-focused fieldset': {
        borderColor: '#6F7E8C',
        color: '#FFF'
      },
    },
  });