# Webhooks

Webhooks are a way for one application to provide other applications with real-time information. A webhook delivers data to other applications as it happens, meaning you get data immediately. Unlike typical APIs where you would need to poll for data very frequently in order to get it real-time. This makes webhooks much more efficient for both provider and consumer.

* are not especific to single content type
* They can be created from the admin panel
* They can be configured from the `./config/server.ts`
* They always occur after the action is completed

[Webhooks documentation](https://docs.strapi.io/dev-docs/backend-customization/webhooks)