# Strapi api

[Strapi API docs](https://docs.strapi.io/dev-docs/api/rest)

## Base endpoints

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| GET    | /api/:pluralApiId             | Get list of entries |
| GET    | /api/:pluralApiId/:documentId | Get single entry    |
| POST   | /api/:pluralApiId             | Create entry        |
| PUT    | /api/:pluralApiId/:documentId | Update entry        |
| DELETE | /api/:pluralApiId/:documentId | Delete entry        |

## Allow api access

By default the api is not accessible to the public. You need to allow access to the api.

* Public access to api
  * Got to `admin panel -> Settings -> Users & Permissions Plugin -> Roles -> Public -> Permissions -> Application -> Select the api you want to allow access` to, and check the permissions you want to allow. Then save.
  * The api is now accessible to the public.
  
* Authenticate access to api
  * Got to `admin panel -> Settings -> Users & Permissions Plugin -> Roles -> Authenticated -> Permissions -> Application -> Select the api you want to allow access` to, and check the permissions you want to allow. Then save.

### Register an user

* POST /auth/local/register
  * Body(json)
  * username
  * email
  * password

### Authenticate an user

* POST /auth/local
  * Body(json)
  * identifier
  * password

### API token

Strapi Allows you to generate an API token for a other apps ou third part server or service. This token can be used to authenticate the user in the api by a manually generated token.

## Single type endpoints

| Method | Endpoint                  | Description      |
| ------ | ------------------------- | ---------------- |
| GET    | /api/:singularApiId       | Get single entry |
| POST   | Cannot be created via api | -                |
| PUT    | /api/:singularApiId       | Update entry     |
| DELETE | /api/:singularApiId       | Delete entry     |

## API parameters

| Parameter        | type          | Description                                                        |
| ---------------- | ------------- | ------------------------------------------------------------------ |
| sort             | string/Array  | Sort results                                                       |
| filters          | object        | Filter results                                                     |
| populate         | string/object | Populate relations, components or dynamic zones                    |
| fields           | Array         | Select fields to display                                           |
| pagination       | object        | Paginate results                                                   |
| publicationState | string        | Display draft or published entries: accept only draft or published |
| locale           | string/array  | Select one or multiple locales                                     |

[Api parameters Docs](https://docs.strapi.io/dev-docs/api/rest/parameters)


### Sort

Add `sort` parameter to the query string. and the value is a string or an array of strings.

* single sort:
`GET /api/:pluralApiId?sort=field:asc`

* multiple sort:
`GET /api/:pluralApiId?sort[0]=field:asc&sort[1]=field2:desc`

### Filters

Add `filters` parameter to the query string. and the value is an object.

| Operator     | description                  |
| ------------ | ---------------------------- |
| $eq          | equal                        |
| $eqi         | equal case insensitive       |
| $ne          | not equal                    |
| $nei         | not equal case insensitive   |
| $gt          | greater than                 |
| $gte         | greater than or equal        |
| $lt          | less than                    |
| $lte         | less than or equal           |
| $in          | in                           |
| $notIn       | not in                       |
| $contains    | contains                     |
| $notContains | not contains                 |
| $null        | is null                      |
| $notNull     | is not null                  |
| $between     | between                      |
| $startswith  | starts with                  |
| $startswithi | starts with case insensitive |
| $endswith    | ends with                    |
| $endswithi   | ends with case insensitive   |
| $or          | or                           |
| $and         | and                          |
| $not         | not                          |


### Populate

Add `populate` parameter to the query string. and the value is a string or an object. The value is the name of the relation, component, media or dynamic zone.
populate will bring the extra fields requested and that the user has permission.
**NOTE: populate will only bring the extra fields that the user has permission**

sample: `{{url}}/api/posts?populate[0]=tags` or `{{url}}/api/posts?populate[0]=tags&populate[1]=cover`

### Fields

Add `fields` parameter to the query string. and the value is an array of strings. The value is the name of the fields to display. This will bring only the fields that arr requested, plus ID.

sample: `{{url}}/api/posts?fields[0]=title` or `{{url}}/api/posts?fields[0]=title&fields[1]=content`

### Pagination

Add `pagination` parameter to the query string. and the value is an object.

sample: `{{url}}/api/posts?pagination[page]=2&pagination[pageSize]=1`. this will bring the second page with one entry per page.
the default value is `page=1` and `pageSize=25`.

### Publication state

Add `publicationState` parameter to the query string. and the value is a string. The value is the state of the entry to display. The value can be `live` or `preview`.

sample: `{{url}}/api/posts?publicationState=preview`. this will bring both published and preview entries.
the default value is `live`.

### Api documentation
[Api docs](https://market.strapi.io/plugins/@strapi-plugin-documentation)


[BACK](./readme.md)