const { ApolloServer } = require('apollo-server');

var photos = [];
var _id = 0;

const typeDefs = `
enum PhotoCategory {
  SELFIE
  PORTRAIT
  ACTION
  LANDSCAPE
  GRAPHIC
}

type Photo {
  id: ID!
  url: String!
  name: String!
  description: String
  category: PhotoCategory!
}

type Query {
  totalPhotos: Int!
  allPhotos: [Photo!]!
}

input PostPhotoInput {
  name: String!
  category: PhotoCategory=PORTRAIT
  description: String
}

type Mutation {
  postPhoto(input: PostPhotoInput!): Photo!
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
        ...args.input
      };
      photos.push(newPhoto);

      return newPhoto;
    }
  },

  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Servince running on ${url}`));
