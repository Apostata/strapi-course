# Deployment to production

For the sake of study, we will use 
[Render.com](https://render.com/) as a cloud provider to deploy the strapi app
[Cloudnary](https://cloudinary.com/) for image storage
[Gmail SMTP](https://www.google.com/intl/pt-BR/gmail/about/) but Recomended other alternatives like [Amazon SES](https://aws.amazon.com/pt/ses/) or [SendGrid](https://sendgrid.com/)

**Create a repo in github for the project**

## Environment Configurations

* Default configuration files inside `./config` folder
* We can create a `./config/env/{environment}` folder to override the default configurations and add environment specific configurations

## Configuring the project on Render.com
[Deploy strapi on Render.com](./Deploy_render.com.md)

## Configuring the project SMTP
[Configure email SMTP](./Configure_email_plugin.md)

## Configuring the project Media Provider
[Configure Media Provider](./External_media_provider.md)


## Deploying the admin panel as a static site(another architecture)

At `./config/env/production/admin.js` :

```ts
export default ({ env }) => ({
  url: env("PUBLIC_ADMIN_URL", "/dashboard"), //absolute url to the admin panel, second parameter is the default value(fallback to same server)
  serveAdminPanel: env("PUBLIC_ADMIN_URL") == undefined, //if the admin panel is in the same server, we can serve it from the same server
});
```
### Configure the static site
in Render.com, create a static site, then set the following environment variables:
Build command: `yarn && NODE_ENV=production yarn build`
Start command: `yarn start`
Public directory: `/build`
Create a secret file `.env` with your environment variables, then update your environment variables in Render.com. Make sure to only mantain the enviroment variables that are only for frontend. Databases and other backend variables should be set in the backend service.

By accessing some internal admin panel routes by address bar in the browser, you will get a 404. Because of the react-router
#### Fixing the 404 error
To fix this, got to your render.com static site, and add a `rewrite rule` to redirect all requests to `/dashboard`:
`source: /* -> destination: /index.html`


## Making render.com deployment reusable
[Reusable render.com deployment](https://docs.render.com/infrastructure-as-code)