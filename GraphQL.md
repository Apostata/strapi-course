# GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## GraphQL vs REST

REST APIs are all about resources. You send a request to an endpoint, and you get back a representation of a resource. GraphQL is all about the data. You send a query specifying what data you want, and you get back a JSON object containing that data.

## Install GraphQL plugin

```bash
npm run strapi install graphql
```

or

```bash
yarn strapi install graphql
```

then restart the server. The GraphQL playground is available at `http://localhost:1337/graphql`.

sample query to get all posts titles only:

```graphql
query Posts {
  posts {
    data {
      attributes {
        title
      }
    }
  }
}
```
the result will be something like this:

```json
{
  "data": {
	"posts": {
	  "data": [
		{
		  "attributes": {
			"title": "Post 1"
		  }
		},
		{
		  "attributes": {
			"title": "Post 2"
		  }
		},
	  ]
	}
  }
}
```
**NOTE: in version 4.16.6, I'm not able to get the type "blocks"(example:rich text) with graphql. With version 4.15.4 is working**

### Query parameters 

get collection of posts with pagination:

```graphql
query Posts {
  posts {
    data {
      attributes {
        title
        slug
        content
        cover {
          data {
            attributes {
              url
            }
          }
        }
        tags {
          data {
            attributes {
              name
            }
          }
        }
        seo {
          title
          description
        }
      }
    }
    meta {
      pagination {
        pageSize
        page
        pageCount
        total
      }
    }
  }
}
```

As you can see, relational types are not returned by default. You need to specify the fields you want to return. like `cover` and `tags` in the example above.

get single post by id:

```graphql
query Posts {
  post(id:1) {
    data {
      id
      attributes {
        title
        slug
        content
        cover {
          data {
            attributes {
              url
            }
          }
        }
        tags {
          data {
            attributes {
              name
            }
          }
        }
        seo {
          title
          description
        }
      }
    }
  }
}
```

## Authentication



[GraphQL api docs](https://docs.strapi.io/dev-docs/api/graphql)

[Extending GraphQL API](Extending_GraphQL_API.md)


[BACK](./readme.md)