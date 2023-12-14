# Lifecycle Hooks

Are functions that get triggered when a specific when Strapi querries as called.
You can create a hook inside the `./src/api/{model-name}/content-type/{model-name}/lifecycles.ts` file.
Means to do something internal when some event happens.

## Available trigger events

- `beforeCreate`
- `beforeCreateMany`
- `afterCreate`
- `afterCreateMany`
- `beforeUpdate`
- `beforeUpdateMany`
- `afterUpdate`
- `afterUpdateMany`
- `beforeDelete`
- `beforeDeleteMany`
- `afterDelete`
- `afterDeleteMany`
- `beforeCount`
- `afterCount`
- `beforeFindOne`
- `afterFindOne`
- `beforeFindMany`
- `afterFindMany`


## Lifecycle hooks Event object

The event object is the object that is passed to the lifecycle hook function, and it contains the following properties:

| key    | type           | description                                                                                                                                         |
| ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| action | string         | Lifecycle event that has been triggered (from the list below)                                                                                       |
| model  | string[] (uid) | An array of uids of the content-types whose events will be listened to. If this argument is not supplied, events are listened on all content-types. |
| params | object         | acepts the folowing parameters:  `data`, `select`, `where`, `orderBy`, `limit`, `offset`, `populate`                                                |
| result | object         | Optional, only available with afterXXX events. Contains the result of the action.                                                                   |
| state  | object         | Query state, can be used to share state between beforeXXX and afterXXX events of a query.                                                           |

## Samples issue to use lifecycle hooks

### 1.Post doesn't return authors**
Reason: The `author`, that is a `ADMIN USER`, is private by default, for security reasons.

Solution: 
1. Create a new `AUTHOR` type, duplicating the `ADMIN USER` type, and set it as public, keeping relation between `ADMIN 
USER`  and `AUTHOR` types.

2. Create Automatic `AUTHOR` for every `Admin User` that you want to be public.

3. Automatically assign `AUTHOR` to `POST`.

#### Creating new `AUTHOR` type

Create the `AUTHOR` type at `Content-Type-Builder` via admin panel, with the same public fields as `ADMIN USER` type, like firstName, lastName, userName and email. Then add another relation field, called `admin_user`, with the `ADMIN USER` type relation using the `one to one` relation type.
Then in Post type, add a new relation field, called `author`, with the `AUTHOR` type relation using the `one to many` relation type.

#### Creating Automatic `AUTHOR` for every `Admin User` creation

**Declarative** - lifecycle hooks for content types that you created, at `./src/api/{model-name}/content-type/{model-name}/lifecycles.ts` file.

**Programmatic** - for other cases, at `./src/index.ts` file.

**NOTE: you must restart the server after that**


In this case we will use the **Programmatic** approach because, we will add a lifecycle hook at the instance of `ADMIN USER` type, that was created by the system.
So we will create automatically an `AUTHOR` instance when one `ADMIN USER` is created.

At `./src/index.ts` file, on `bootstrap` function add the following code:

```ts
...

bootstrap({strapi}:{strapi:Strapi}){

	strapi.db.lifecycles.subscribe({ // subscription to db event afterCreate an ADMIN USER
      models: ["admin::user"], // model name, can be an array of models
      afterCreate: async (event: any) => { // event action
        const {
          result: {
            id,
            firstname,
            lastname,
            username,
            email,
            createdAt,
            updatedAt,
          },
        } = event;
        await strapi.service("api::author.author").create({
          data: {
            id,
            firstname,
            lastname,
            username,
            email,
            createdAt,
            updatedAt,
            admin_user: [id],
          },
        });
      },
    });
}

```

##### Upudate or create `AUTHOR` if not exists when `ADMIN USER` is updated

in the same file, add the following code:

```ts
bootstrap({strapi}:{strapi:Strapi}){

	strapi.db.lifecycles.subscribe({ 
    models: ["admin::user"],
  ...

    afterUpdate: async (event: any) => {
      const {
        result: { id, firstname, lastname, username, email, updatedAt },
      } = event;
      const filteredAuthors = await strapi.entityService.findMany(
        "api::author.author",
        {
          populate: ["admin_user"],
          filters: {
            admin_user: {
              id,
            },
          },
        }
      );

      if (filteredAuthors?.[0]?.id) {
        await strapi.service("api::author.author").update(id, {
          data: {
            firstname,
            lastname,
            username,
            email,
            updatedAt,
          },
        });
      } else {
        await strapi.service("api::author.author").create({
          data: {
            id,
            firstname,
            lastname,
            username,
            email,
            updatedAt,
            admin_user: [id],
          },
        });
      }
    },
  });
}
```

##### Delete `AUTHOR` if `ADMIN USER` is deleted(Extra)

in the same file, add the following code:

```ts
bootstrap({strapi}:{strapi:Strapi}){

	strapi.db.lifecycles.subscribe({ 
    models: ["admin::user"],
    ...
    afterDelete: async (event: any) => {
        const {
          result: { id },
        } = event;
        await strapi.service("api::author.author").delete(id);
      }
  });
}
```	

#### Automatically assign `AUTHOR` to `POST` 

Now we will create a lifecycle hook at the instance of `POST` type, that was not created by the system. so we will use de **Declarative** approach.

[LifiCycle Hooks documentation](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks)