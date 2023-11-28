# Strapi Course

## Create a new project

```bash
npx create-strapi-app@latest {{PROJECT_NAME}} --quickstart
```

or

```bash
yarn create strapi-app {{PROJECT_NAME}} --quickstart
```

## Using Typescript

```bash
npx create-strapi-app@latest {{PROJECT_NAME}} --quickstart --typescript
```

or

```bash
yarn create strapi-app {{PROJECT_NAME}} --quickstart --typescript
```

## Convert an existing project to Typescript

Add tsconfig.json in the root of the project, with the following code (from the docs [Add TypeScript support to an existing Strapi project](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#typescript) ):

* 1. Add tsconfig to root folder

```json
{
  "extends": "@strapi/typescript-utils/tsconfigs/server",
  "compilerOptions": {
 "outDir": "dist",
 "rootDir": "."
  },
  "include": ["./", "src/**/*.json"],
  "exclude": [
 "node_modules/",
 "build/",
 "dist/",
 ".cache/",
 ".tmp/",
 "src/admin/",
 "**/*.test.ts",
 "src/plugins/**"
  ]
}
```

* 2. Add tsconfig to admin folder

```json
{
  "extends": "@strapi/typescript-utils/tsconfigs/admin",
  "include": ["../plugins/**/admin/src/**/*", "./"],
  "exclude": ["node_modules/", "build/", "dist/", "**/*.test.ts"]
}
```

* 3. Remove .eslintrc and eslintignore from root folder

* 4. Add ".." `filename` in `sqlite` configuration on config/database.js:
  
```js

  ...
   sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..", //add this
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
    },

...

```

* 5. Using typescript types

at the `index.ts` in root folder add the following code:

```ts
import { Strapi } from "@strapi/strapi";

export default {
  register({ strapi }: { strapi: Strapi }) {
    // ...
  },
};
```

* 6. Dynamic generate content types in ts:

```bash
npm run strapi ts:generate-types --debug #optional flag to display additional logging
```

* 7. configuring tsconfig.json to exclude types/generated:

```json
  // ...
  "exclude": [
    "node_modules/",
    "build/",
    "dist/",
    ".cache/",
    ".tmp/",
    "src/admin/",
    "**/*.test.ts",
    "src/plugins/**",
    "types/generated/**" //add this
  ]
  // ...
```

**PS: If you still having issues [Fix build issues with the Generated Types](https://docs.strapi.io/dev-docs/typescript#generate-typings-for-project-schemas)**

* 8. Rebuild and restart server
`npm run build`
`npm run develop`

## User Types and Permissions

[User types and permissions](./User_types_and_permissions.md)

## Content types

[Content types](./Content_types.md)

## Strapi Rest API

[Strapi Rest API](./Strapi-api.md)

## Strapi GraphQL API

[Strapi GraphQL API](./Strapi-graphql.md)

## Customizing Strapi

[Customizing Strapi](./Customizing_strapi.md)

## Premium posts (example)

[Premium posts](./PremiumPosts.md)

## Post Likes (example)

[Post Likes](./PostLikes.md)

[Link to Error handling](https://docs.strapi.io/dev-docs/error-handling)