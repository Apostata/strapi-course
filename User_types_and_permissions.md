# Users types and permissions

The application has three types of users:

**SUPER-AMDIN** : This user is YOU, the developer. That defines data models and configure application settings.
strapi areas: Content type builder, plugins, settings, users and permissions

**EDITOR** : This user is the content editor. That creates and edits it's own contents and AUTHORS contents. Supervises all AUTHORS.
strapi areas: Content manager.

**AUTHOR** : This user is the content author. That creates and edits it's own contents.
strapi areas: Content manager.

**APP USER** : This user is the application user. That consumes the application contents.
strapi areas: Frontend app.

## admin user and app user

Admin users are created in the admin panel at `Settings/users` tab, App users are created in the `Content type builder/users` tab.

[BACK](./readme.md)