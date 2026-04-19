import { Close } from "@mui/icons-material";
import { Button, IconButton, Snackbar } from "@mui/material"
import { useState } from "react";




const useSnackbarSimple = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpen = (message) => {
        setOpen(true);
        setMessage(message);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const ComponenteSnackbar = () => (

        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={
                <>
                    <Button color="secondary" size="small" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </>
            }
        />
    )

    return { handleOpen, ComponenteSnackbar }
}

export default useSnackbarSimple;