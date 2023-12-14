export default {
  beforeCreate: async (event: any) => {
    const { params } = event;
    const id = params?.data?.createdBy;
    const authors = await strapi.entityService.findMany("api::author.author", {
      filters: {
        admin_user: {
          id,
        },
      },
    });
    if (authors?.[0]?.id) {
      params.data.authors.connect = [
        ...params.data.authors.connect,
        authors[0].id,
      ];
    }
  },
};
