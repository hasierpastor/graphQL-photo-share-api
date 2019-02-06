const { ApolloServer } = require('apollo-server');

var photos = [];
var _id = 0;

const typeDefs = `
type Photo {
  id: ID!
  url: String!
  name: String!
  description: String
}
type Query {
  totalPhotos: Int!
  allPhotos: [Photo!]!
}
type Mutation {
  postPhoto(name: String! description: String): Photo!
}
`;

const resolvers = {
  //resolver for total photos => return length of photo array
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  //mutation resolver for posting a photo => returns true
  //parent parameter refers to parent object - int this case a Mutation.
  //Always the first argument for a mutation.
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args
      };
      photos.push(newPhoto);

      return newPhoto;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Servince running on ${url}`));
