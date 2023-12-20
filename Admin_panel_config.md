# Customizing admin panel

Run `strapi develop --watch-amdin` or `npm run develop -- --watch-admin` to start the admin panel in development mode. This will allow you to make changes to the admin panel and see them reflected in real time.

## Changing the admin panel URL

By default, the admin panel is available at `http://localhost:1337/admin`. You can change the admin panel URL by editing the `./config/admin.ts` file.

```ts
export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
  url: "/dashboard", // changed the admin panel url from /admin to /dashboard
});

```

## Changing the admin server configuration

You can change the admin server configuration by editing the `./config/server.ts` file.

```ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

```	

[Customizing admin panel](https://docs.strapi.io/dev-docs/admin-panel-customization)
[Admin panel available options](https://docs.strapi.io/dev-docs/configurations/admin-panel)

## Customizing admin panel UI

You can customize the admin panel UI by editing the `./src/admin/app.tsx` if it exists, if not, create a copy of `./src/admin/app.example.tsx` and rename it to `app.tsx` file.

```js
export default {
  config: {
    locales: [
		//...list of locales
    ],
  },
  bootstrap(app: any) {
    console.log(app);
  },
};


```
You can customize admin panel adding flavicon, colors, logo, etc. [Customizing admin panel UI](https://docs.strapi.io/dev-docs/admin-panel-customization)

here is a example of a custom admin panel UI:
```ts

import Favicon from "./extensions/favicon.png";
export default {
  config: {
    locales: [
      "en",
      "pt-BR",
      
    ],
    head: {
      favicon: Favicon,
    },
    tutorials: false,
    theme: {
      colors: {
        //light Theme
        buttonPrimary500: "#f00", //button hover
        buttonPrimary600: "#d9822f", //button
        primary500: "#f00", // secondary
        primary600: "#d9822f", // primary, active
        primary700: "#328048", //tertiary, calltoaction
      },
    },
    translations: {
      "pt-BR": {
        titleTemplate: "Painel Administrativo",
        "Auth.form.welcome.title": "Bem-vindo ao Painel Administrativo",
        "Auth.form.welcome.subtitle": "Faça login para continuar",
        "app.components.LeftMenu.navbrand.title": "Painel Administrativo",
        "global.localeToggle.label": "Idioma",
      },
      en: {
        titleTemplate: "Admin Panel",
        "Auth.form.welcome.title": "Welcome to the Admin Panel",
        "Auth.form.welcome.subtitle": "Login to continue",
        "app.components.LeftMenu.navbrand.title": "Admin Panel",
        "global.localeToggle.label": "Language",
      },
    },
  },
  bootstrap(app: any) {
    document.title = "admin panel";
    console.log(app);
  },
};

```

[Strapi Design system storybook](https://design-system-git-main-strapijs.vercel.app/?path=/docs/design-system-primitives-combobox--docs)