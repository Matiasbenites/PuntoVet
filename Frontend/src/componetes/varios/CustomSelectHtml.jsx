


export const CustomSelectHtml = ({ options, onSelect, esilo }) => {

    const handleChange = (event) => {
        console.log('Valor seleccionado: ', event.target.value);
        onSelect(event.target.value);
    }

    return (
        <select style={esilo} onChange={handleChange}>
            {
                options.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>{option.text}</option>
                    )
                })
            }
        </select>
    )
}