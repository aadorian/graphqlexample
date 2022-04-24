const { ApolloServer, gql } = require('apollo-server');
// https://www.apollographql.com/docs/apollo-server/getting-started/
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  #Author
type Author {
    name: String
    oid: String
}
#Licence
type Licence {
    name: String #public /restricted /open MIT
}
#Provider
type Provider {
    name:String
    rpc: String #add RPC URL
}

#interface 

interface IDataCollection{
    date: Int 
    name: String
    description: String

}
#URL 
#scalar Url
scalar Url
# Collection 
type DataCollection implements IDataCollection {
  date: Int  # extends Curare
  name: String # idem Curare
  size: Int # idem Curare (falta identificar unidades dice NUM pasaría a 32‐bit integer) (este atributo sería la suma de las collecciones? notar que podría evitarse )
  provider: Provider #extends Curare
  author: [Author] # list of authors extends unique author of Curare
  licence: Licence #extends Curare
  description: String
  releases : [Release!] #not null (conservar cardinalidad 1..n)
}
# Release
"""
Release identification of a DataCollection
"""
type Release {
    id: Url #lo extendería a una versión de gestión de versionado (no necesariamente URL)
    size : Int #idem Curare falta identicar si Kb o MB
   # publicationDate: Date # idem Curare (lo cambiaría a formato LinuxTimeDate para simplificar y constente con sistemas distribuidos de timeStamp) ver si en curar se identifica el formato de DateTime
}
# Attribute
type Attribute {
    name: String
}
# DataItem
type DataItem {
    id: Url
    name: String
    attributes: [Attribute!] # Nota: no se especifica que es la lista
}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    releases: [Release]
  }
`;

const releases = [
    {
      id: 'http://1',
      size: '1',
    },
    {
      id: 'http://1',
      size: '2',
    },
  ];
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      releases: () => releases,
    },
  };
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});