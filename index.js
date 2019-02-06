const { ApolloServer } = require('apollo-server');

let users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' }
];

let photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake'
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt'
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt'
  }
];

let _id = 0;

const typeDefs = `
enum PhotoCategory {
  SELFIE
  PORTRAIT
  ACTION
  LANDSCAPE
  GRAPHIC
}

type User {
  githubLogin: ID!
  name: String
  avatar: String
  postedPhotos: [Photo!]!
}

type Photo {
  id: ID!
  url: String!
  name: String!
  description: String
  category: PhotoCategory!
  postedBy: User!
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
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(user => user.githubLogin === parent.githubUser);
    }
  },

  User: {
    postedPhotos: parent => {
      return photos.filter(photo => photo.githubUser === parent.githubLogin);
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
