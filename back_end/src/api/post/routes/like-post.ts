export default {
  routes: [
    {
      method: "PUT",
      path: "/posts/:id/like", // you can use params here like /posts/example/:id or regex /posts/example/:id(\\d+)
      handler: "api::post.post.likePost", // the custom controller action
    },
  ],
};
