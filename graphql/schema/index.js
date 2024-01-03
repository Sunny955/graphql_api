const { buildSchema } = require("graphql");
module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

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

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
    bookings: [Booking!]
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    deleteEvent(id: ID!): Boolean!
    bookEvent(id: ID!): Booking!
    cancelBooking(id: ID!): Event!
    login(email: String!, password: String!): AuthData
}

schema {
    query: Rootquery
    mutation: RootMutation
}
`);
