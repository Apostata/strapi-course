# Content types

Content types are the data models of the application. They are created in the `Content type builder` tab.

* Collection Types: are the data models that have multiple records. Like a post, a product, a category, etc.

* Single Types: are the data models that have only one record. Like a homepage, a contact page, etc.

## Collection and Single Types fields

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

### Create type relations

After creating two or more content types you can add a relationship between them.

* One way: Content-type A *has one* Content-type B. Like a post *has one* author.
* One-to-one: Content-type A *has and belong to one* Content-type B. Like a post *has and belong to one* category.
* One-to-many: Content-type A *belongs to many* Content-type B. Like a post *belongs to many* categories.
* Many-to-one: Content-type B *has many* Content-type A. Like a category *has many* posts.
* Many-to-many: Content-type A *has and belongs to many* Content-type B. Like a post *has and belongs to many* tags.
* Many way: Content-type A *has many* Content-type B. Like a post *has many* comments.

### Components

Components are reusable data models. You can create a component and use it in multiple content types.
like a comment for a post and a comment for a product.

* 3.3.1 single component: will appear in the content type a single time but can be used in multiple content types.

* 3.3.2 reusable component: will appear in the content type multiple times and can be used in multiple content types.

### Dynamic zone

Dynamic zone is a list of components. You can create a dynamic zone and use it in multiple content types. Like an if statement, you can create a dynamic zone and add components to it.

**PS: in version 4.15.4, I'm having a error to add more than one component to dynamic zone**

**workaround:** changing the package.json to the following versions
from:

```json
"@strapi/plugin-cloud": "4.15.4",
"@strapi/plugin-i18n": "4.15.4",
"@strapi/plugin-users-permissions": "4.15.4",
"@strapi/strapi": "4.15.4",
```

to:

```json
"@strapi/plugin-cloud": "4.15.4", // removed
"@strapi/plugin-i18n": "4.14.6",
"@strapi/plugin-users-permissions": "4.14.6",
"@strapi/strapi": "4.14.6",
```

#### Using dynamic zone in Content Manager

You can use dynamic zone in content manager by adding a component field to a content type and selecting the dynamic zone option. Very simple like that.

### Create a global configuration type (Single type)

You can create a global configuration type to store global settings of the application. Like a site name, a site description, a site logo, as header, a footer, etc.

Create as a single type in content builder, and add the fields you want.

[BACK](./readme.md)