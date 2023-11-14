# Strapi Course

## 1.1. Create a new project

```bash
npx create-strapi-app@latest {{PROJECT_NAME}} --quickstart
```

or

```bash
yarn create strapi-app {{PROJECT_NAME}} --quickstart
```

## 1.2. Using Typescript

```bash
npx create-strapi-app@latest {{PROJECT_NAME}} --quickstart --typescript
```

or

```bash
yarn create strapi-app {{PROJECT_NAME}} --quickstart --typescript
```

## 1.3 Convert an existing project to Typescript

Add tsconfig.json in the root of the project, with the following code (from the docs [Add TypeScript support to an existing Strapi project](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#typescript) ):

* 1.3.1. Add tsconfig to root folder

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

* 1.3.2. Add tsconfig to admin folder

```json
{
  "extends": "@strapi/typescript-utils/tsconfigs/admin",
  "include": ["../plugins/**/admin/src/**/*", "./"],
  "exclude": ["node_modules/", "build/", "dist/", "**/*.test.ts"]
}
```

* 1.3.3. Remove .eslintrc and eslintignore from root folder

* 1.3.4. Add ".." `filename` in `sqlite` configuration on config/database.js:
  
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
* 1.3.5 Using typescript types

at the `index.ts` in root folder add the following code:

```ts
import { Strapi } from "@strapi/strapi";

export default {
  register({ strapi }: { strapi: Strapi }) {
    // ...
  },
};
```

* 1.3.6 Dynamic generate content types in ts:

```bash
npm run strapi ts:generate-types --debug #optional flag to display additional logging
```

* 1.3.8 configuring tsconfig.json to exclude types/generated:
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

* 1.3.8. Rebuild and restart server
`npm run build`
`npm run develop`

## 2. users types and permissions

The application has three types of users:

**SUPER-AMDIN** : This user is YOU, the developer. That defines data models and configure application settings.
strapi areas: Content type builder, plugins, settings, users and permissions

**EDITOR** : This user is the content editor. That creates and edits it's own contents and AUTHORS contents. Supervises all AUTHORS.
strapi areas: Content manager.

**AUTHOR** : This user is the content author. That creates and edits it's own contents.
strapi areas: Content manager.

**APP USER** : This user is the application user. That consumes the application contents.
strapi areas: Frontend app.

### admin user and app user

Admin users are created in the admin panel at `Settings/users` tab, App users are created in the `Content type builder/users` tab.

## 3. Content types

Content types are the data models of the application. They are created in the `Content type builder` tab.

* Collection Types: are the data models that have multiple records. Like a post, a product, a category, etc.

* Single Types: are the data models that have only one record. Like a homepage, a contact page, etc.

### 3.1. Collection Types

* Text: A short text field. Like a title, a name, etc.
* Rich Text: A long text field. Like a description, a content, etc. With a rich text editor.
* Number: A number field. Like a price, a quantity, etc.
* Date: A date field. Like a date of birth, a date of publication, etc. (By default strapi allready has 3 dates, create date, update date and publish date)
* Boolean: A boolean field.
* Relation: A relation field. Like a category, a tag, etc. a mor complex type
* Email: An email field.
* Password: A password field.
* Enumeration: An enumeration field. Like a status, a type, etc. A list of options.
* Media: A media field. Like an image, a video, etc.
* JSON: A JSON field. Like a settings, a configuration, etc. A JSON object.
* UID: A UID field. Like a slug, a reference, etc. A unique identifier. (by default strapi allready has an id field)
* Component: A component field. Like a header, a footer, etc. A reusable component.
* Dynamic zone: A dynamic zone field. Like a page builder, a content builder, etc. A dynamic list of components.

### 3.2. Create type relations

After creating two or more content types you can add a relationship bettween them.

* One way: Content-type A *has one* Content-type B. Like a post *has one* author.
* One-to-one: Content-type A *has and belong to one* Content-type B. Like a post *has and belong to one* category.
* One-to-many: Content-type A *belongs to many* Content-type B. Like a post *belongs to many* categories.
* Many-to-one: Content-type B *has many* Content-type A. Like a category *has many* posts.
* Many-to-many: Content-type A *has and belongs to many* Content-type B. Like a post *has and belongs to many* tags.
* Many way: Content-type A *has many* Content-type B. Like a post *has many* comments.

### 3.3 Components

Components are reusable data models. You can create a component and use it in multiple content types.
like a comment for a post and a comment for a product.

* 3.3.1 single component: will appear in the content type a single time but can be used in multiple content types.

* 3.3.2 reusable component: will appear in the content type multiple times and can be used in multiple content types.