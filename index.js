const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user');
require('./models/survey');

require('./services/passport');

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV == "production"){
  //Serve production assets
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT);