const { buildSchema } = require("graphql");
module.exports = buildSchema(`

type Event {
    _id: ID
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User {
  _id: ID
  email: String!
  password: String
  events: [Event!]
}

input EventInput {
    title: String!
    description: String!
    price: Float!
}

input UserInput {
  email: String!
  password: String!
}

type Rootquery {
    events: [Event!]!
    getUser(id: ID!): User
    users: [User!]
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    deleteEvent(id: ID!): Boolean!
}

schema {
    query: Rootquery
    mutation: RootMutation
}
`);
