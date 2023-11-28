# Routes

By default when you create a Model, Strapi will create an api with the same name and a single endpoint `/api/{model-name}`.
Each route as Policies, middlewares and controllers.

[Routes documentation](https://docs.strapi.io/dev-docs/backend-customization/routes)

## Customizing or Creating Existing Route

example:

```ts
module.exports = createCoreRouter("api::tag;tag",{
	//custom options
	prefix: "", //default is "/{model-name}" but you can change it to "something" then the route will be "/something/tags"
	only:["find", "findOne"], //default is all actions, but you can specify which actions you want to use in this sample get and get one
	except:["create", "update", "delete"], //default is none, but you can specify which actions you want to exclude in this sample create, update and delete
	// you will use only or except
	config:{
		find:{
			auth:false, //default is true, but you can disable authentication for this action, false means that you can access this action without being logged in
			policies:[], //default is none, but you can specify which policies you want to use
			middlewares:[], //default is none, but you can specify which middlewares you want to use
		},
		findOne:{
			...
		},
		create:{
			...
		},
		update:{
			...
		},
		delete:{
			...
		},
	}
})
```

### Customizing

You can customize an existing route by creating a file in the `./src/api/{model-name}/routes/{model-name}.ts` file.

### Creating

Creating custom routers consists in creating a file that exports an array of objects, each object being a route with the following parameters:

| Parameter | Description                                                                                                | Type   |
| --------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| method    | The HTTP method (GET, POST, PUT, DELETE and PATCH)                                                         | string |
| path      | Path to reach, starting with a forward-leading slash (e.g. /articles)                                      | string |
| handler   | Function to execute when the route is reached.  Should follow this syntax: `<controllerName>.<actionName>` | string |
| config    | configuration to handle, policies, middlewares and public availability                                     | object |

example:

```ts
export default {
  routes: [
    {
      method: "GET",
      path: "/posts/example", // you can use params here like /posts/example/:id or regex /posts/example/:id(\\d+)
      handler: "myCustomController.example",
      config: {
        // some config
      },
    },
  ],
};

```

### Listing routes at terminal

You can list all routes at terminal using the command `yarn strapi routes:list` or `npm run strapi routes:list`, this will return something like this:

```bash
┌────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
│ Method             │ Path                                                                            │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|ACL|BIND|CHE… │ /_health                                                                        │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|GET           │ /uploads/(.*)                                                                   │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|GET           │ /admin/:path*                                                                   │
...
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|ACL|BIND|CHE… │ /graphql                                                                        │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|GET           │ /api/blog                                                                       │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ PUT                │ /api/blog                                                                       │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ DELETE             │ /api/blog                                                                       │
...
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ HEAD|GET           │ /users-permissions/routes                                                       │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘
```

[Back](./Customizing_strapi.md)