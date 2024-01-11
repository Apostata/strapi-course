# Deploying Strapi to Render.com

## Create a new Postgres database

Very intuitive, just follow the steps. In this case we will use the free plan and the `connection string` that we will store in `.env` file as `DATABASE_URL`.

Then we will install `npm i pg pg-connection-string`

now we can create a `./config/env/production/database.js` file with the following content:

```ts
import { parse } from "pg-connection-string";
export default ({ env }) => {
  const { host, port, database, user, password } = parse(env("DATABASE_URL"));
  return {
    connection: {
      client: "postgres",
      connection: {
        host,
        port,
        database,
        user,
        password,
        // schema: env('DATABASE_SCHEMA', 'public'), // Not required
        // ssl: {
        //   rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
        // },
      },
      debug: false,
    },
  };
};
```

## Configuring the Server

* Setting the plublic url
* On `server.ts` we can set the URL to strapi server
* When our admin panel is on the same server, this URL we1ll be setting as root of the admi panel url (to which we'll add something like "/dashboard" as we did in develoment).
* When our admin panel is on a different server, this URL will be used this URL to reach the api
The only thing that we will need to change is the serverUrl. Render.com will set and inject the `RENDER_EXTERNAL_URL` environment variable to the URL of our service.

so we can create a `./config/env/production/server.js` file with the following content:

```ts
export default ({ env }) => ({
  url: env("RENDER_EXTERNAL_URL", ""),
});

```

## Configuring the admin panel
If our admin panel is in the same server, we can skip this step. If not, we will need to set the admin panel URL. We can do this by creating a `./config/env/production/admin.js` file with the following content:

```ts
export default ({ env }) => ({
 
  url: "{URL_TO_EXTERNAL_SERVER}/dashboard", // change the admin panel url
});

```

**Update your git repo**

## Creating a web service in Render.com

Create a web service in Render.com and set the following environment variables:
Build command: `yarn && NODE_ENV=production yarn build`
Start command: `yarn start`

## Configure custom domain in Render.com

Render.com automatic provide a SSL certificate for our domain.

1. Go to your Dashboard > settings and add your custom domain.
2. Make sure to add the DSN informed to your DNS provider.
3. At `./config/env/production/server.js` set the `url` to your custom domain. in `.env` file set the `PUBLIC_URL` to your custom domain, then update your environment variables in Render.com, removing the `RENDER_EXTERNAL_URL` and adding the `PUBLIC_URL` variable.


[Render.com deploy strapi docs](https://docs.render.com/deploy-strapi)

