const express = require("express");
const app = express();

mongoose.connect('mongodb://host.docker.internal:27017/mevn-cats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('successfully connected to mongodb!'));

app.get("/", (req, res) => {
    res.send('hello world')
});
app.listen(3000);