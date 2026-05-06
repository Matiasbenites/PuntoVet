import { CompareArrows, Today } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { DateField, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useEffect, useState } from "react";





export const FiltroCalendario = ({ onUseFecha }) => {

    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(dayjs());
    const [error, setError] = useState('');

    const onChangeDate1 = (date) => {
        if (date && date > fechaFin) {
            setError('Fecha Invalida');
            console.log('Fecha Fin: ', fechaFin, 'Fecha Inicio: ', date);
            return
        } else {
            setFechaInicio(date);
            setError('');
        }
    };
    const onChangeDate2 = (date) => setFechaFin(date);


    useEffect(() => {
        if (fechaInicio && fechaFin && fechaInicio >= fechaFin) {
            setError('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        } else {
            setError('');
            if (fechaInicio) {
                const fechaInicioFormateada = dayjs(fechaInicio).format('DD/MM/YYYY');
                const fechaFinFormateada = dayjs(fechaFin).format('DD/MM/YYYY');
                onUseFecha(fechaInicioFormateada, fechaFinFormateada);
            }
        }
    }, [fechaFin, fechaInicio])

    return (
        <Grid position={'relative'}>
            <Grid container justifyContent={'center'} alignItems={'center'} sx={{ gap: '1rem' }} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: '18rem' }}
                        value={fechaInicio}
                        format="DD/MM/YYYY"
                        onChange={onChangeDate1}
                        maxDate={dayjs()}
                    />
                    <CompareArrows />
                    <DatePicker
                        sx={{ width: '18rem' }}
                        value={fechaFin}
                        format="DD/MM/YYYY"
                        onChange={onChangeDate2}
                    />
                </LocalizationProvider>
            </Grid>
            {(error.length > 0) ? <Typography position={'absolute'} color={'red'} variant="caption">{error}</Typography> : null}
        </Grid>

    )
}