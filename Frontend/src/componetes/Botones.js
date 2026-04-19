import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const ButonAzul = styled(Button)({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '.6rem 2rem',
  border: '1px solid',
  backgroundColor: '#3B57BC',
  borderColor: '#0063cc',
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: '#FFF',
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});



export const ButonAmarillo = styled(Button)({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 18,
  padding: '.6rem 2rem',
  border: 'none',
  backgroundColor: '#F3BA4A',
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: '#000',
  '&:hover': {
    backgroundColor: '#dd9c30',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    border: 'none'
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});


export const ButonVerde = styled(Button)({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 18,
  padding: '.6rem 2rem',
  border: 'none',
  backgroundColor: '#3BBC57',
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: '#000',
  '&:hover': {
    backgroundColor: '#73d288',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    border: 'none'
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});