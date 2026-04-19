
const { store } = require('../models/index');


const PUBLIC_URL = process.env.PUBLIC_URL;

const setStorage = async (req, res) => {
    const { body, file } = req;
    console.log(file);
    const fileData = {
        fileName: file.filename,
        url: `${PUBLIC_URL}/${file.filename}`
    }
    const data = await store.create(fileData);
    res.send(data.url);
};

module.exports = { setStorage };    
