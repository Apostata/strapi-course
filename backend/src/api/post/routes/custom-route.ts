export default {
  routes: [
    {
      method: "GET",
      path: "/posts/example", // you can use params here like /posts/example/:id or regex /posts/example/:id(\\d+)
      handler: "api::post.post.exampleAction", // the custom controller action
      config: {
        // some config
      },
    },
  ],
};
