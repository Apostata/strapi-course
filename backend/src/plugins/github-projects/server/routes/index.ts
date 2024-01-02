export default [
  {
    method: "GET",
    path: "/repos", //accessible at http://localhost:1337/github-projects/repos
    handler: "getReposController.index",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: [
              "plugin::github-projects.repos.read",
              "plugin::github-projects.projects.read",
            ],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "POST",
    path: "/project",
    handler: "projectController.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/projects",
    handler: "projectController.createMany",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "DELETE",
    path: "/project/:id",
    handler: "projectController.delete",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "DELETE",
    path: "/projects",
    handler: "projectController.deleteMany",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "GET",
    path: "/projects", //accessible at http://localhost:1337/github-projects/projects
    handler: "projectController.find",
    config: {
      auth: false,
      //prefix: false
    },
  },
  {
    method: "GET",
    path: "/project/:id", //accessible at http://localhost:1337/github-projects/project/1
    handler: "projectController.findOne",
    config: {
      auth: false,
      //prefix: false // chnahge the prefix to false to remove the /github-projects from the url = http://localhost:1337/project/1
    },
  },
];
