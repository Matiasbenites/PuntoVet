import { LinearProgress, colors, styled } from "@mui/material"
import { useEffect, useState } from "react"


const textos = [
    '¿Qué animal es más perezoso que un gato ? ¡Dos gatos!',
    '¿Qué hace una oveja cuando está aburrida ? ¡Sale a contar coches!',
    '¿Por qué el perro fue al médico ? ¡Porque tenía un hueso roto!',
    '¿Cuál es el pez más divertido ? ¡El pez payaso!',
    '¿Por qué el pollo cruzó la carretera ? ¡Para demostrar que no era un gallina!',
    '¿Qué le dijo una pulga a la otra ? ¡Vamos a perro - copetear!',
    '¿Por qué el gato estaba tan enojado ? ¡Porque lo sacaron de su siesta!',
    '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
    '¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen "Twi-twi-ter"!',
    '¿Cuál es el animal más antiguo? ¡La cebra! Porque está en blanco y negro.',
    '¿Por qué los elefantes nunca usan el ordenador? ¡Porque tienen miedo de que les den un mouse!',
    "¿Qué le dice una iguana a su hermana gemela? ¡Eres igualita!",
    '¿Qué le dice un pez a otro pez en el gimnasio? ¡Nada, nada, solo estamos haciendo ejercicio!',
    '¿Qué le dice una mosca a otra mosca que está enojada? ¡No te mosquee!'
]


const LineaLoading = styled(LinearProgress)({
    '&.MuiLinearProgress-root': {  // Corregido: '.MuiLinearProgress-root'
        backgroundColor: '#b5b3b3'
    },
    '& .css-1oulhrb-MuiLinearProgress-bar1': {  // Corregido: '.MuiLinearProgress-bar'
        backgroundColor: '#529d53'     // Corregido: Cambié 'color' a 'backgroundColor' para el fondo de la barra de progreso
    },
    '& .css-1kx23p8-MuiLinearProgress-bar2': {  // Corregido: '.MuiLinearProgress-bar'
        backgroundColor: '#6074cf'     // Corregido: Cambié 'color' a 'backgroundColor' para el fondo de la barra de progreso
    }
});


export const LoadingPage = ({ show }) => {

    const [texto, setTexto] = useState(textos[Math.floor(Math.random() * textos.length)]);

    useEffect(() => {
        const intervalo = setInterval(() => {
            const ramdomText = textos[Math.floor(Math.random() * textos.length)];
            setTexto(ramdomText)
        }, 5000);
        return () => clearInterval(intervalo);
    }, [])

    return (
        <div className={`contenedorLoadingPage ${show ? 'show' : ''}`}>
            <div className="overlay"></div>
            <div className="content">
                <h2>Procesando venta... </h2>
                <LineaLoading sx={{ width: '80%', height: '1.5rem' }} />
                <p>{texto}</p>
            </div>
        </div>
    );
};

