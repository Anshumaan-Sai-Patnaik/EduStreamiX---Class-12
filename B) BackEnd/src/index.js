require("dotenv").config({ path: "../../.env" });
const app = require('./app');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`);
});