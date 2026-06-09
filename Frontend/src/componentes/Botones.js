import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const ButonAzul = styled(Button)(({ theme }) => ({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '.6rem 2rem',
  border: '1px solid',
  backgroundColor: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.light,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  '&:focus': {
    boxShadow: `0 0 0 0.2rem ${theme.palette.primary.main}33`,
  },
}));

export const ButonAmarillo = styled(Button)(({ theme }) => ({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 18,
  padding: '.6rem 2rem',
  border: 'none',
  backgroundColor: theme.palette.secondary.main,
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: theme.palette.secondary.dark,
  },
  '&:focus': {
    boxShadow: `0 0 0 0.2rem ${theme.palette.secondary.main}33`,
  },
}));

export const ButonVerde = styled(Button)(({ theme }) => ({
  height: '5rem',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 18,
  padding: '.6rem 2rem',
  border: 'none',
  backgroundColor: theme.palette.success.main,
  fontWeight: 'bold',
  borderRadius: '1.5rem',
  color: theme.palette.success.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.success.light,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: theme.palette.success.main,
  },
  '&:focus': {
    boxShadow: `0 0 0 0.2rem ${theme.palette.success.main}33`,
  },
}));