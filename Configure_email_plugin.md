# Configure the email plugin

In this tutorial we will use `NodeMailer` as the email provider. We will use `Gmail SMTP` as the email service provider.

Install the plugin: `npm i strapi-plugin-email-nodemailer`	

configure the plugin: `./config/env/production/plugins.js`

```ts
module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
		secure: true, //form gmail
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'hello@example.com',
        defaultReplyTo: 'hello@example.com',
      },
    },
  },
  // ...
});
```
Put the following variables in the `.env` file and be sure to put then in your cloud provider `environment variables`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME={YOUR_GMAIL_USERNAME}
SMTP_PASSWORD={YOUR_GMAIL_PASSWORD OR APP_PASSWORD}
```

**NOTE: if you are using gmail, and have a 2 factor authentication, you will need to create a app password on google account**
