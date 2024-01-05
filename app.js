const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require("express-graphql");
const dbConnect = require("./config/dbConnect");
const resolvers = require("./graphql/resolvers/index");
const schema = require("./graphql/schema/index");
const { authenticateUser } = require("./middleware/auth");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
dbConnect();

app.use(authenticateUser);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listing to port ${PORT}`);
});
