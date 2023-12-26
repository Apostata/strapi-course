import { Strapi } from "@strapi/strapi";
import { request } from "@octokit/request";
import axios from "axios";
import markdownIt from "markdown-it";
import { Repo } from "../../types";
const md = markdownIt();
const { GITHUB_TOKEN } = process.env;

export default ({ strapi }: { strapi: Strapi }) => ({
  getRepoProject: async (repo: Repo) => {
    const { id } = repo;
    const projects = await strapi.entityService?.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );
    const projectId =
      (projects as Repo[])?.length > 0 ? projects?.[0]?.id : null;

    return projectId;
  },

  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${GITHUB_TOKEN}`,
      },
      type: "public",
    });

    const repos = Promise.all(
      result?.data?.map(async (repo) => {
        const { id, name, description, html_url, owner, default_branch } = repo;

        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let longDescription;
        try {
          longDescription = md
            .render((await axios.get(readmeUrl))?.data)
            ?.replace(/\n/g, "<br />");
        } catch (e) {
          longDescription = description || "# without readme";
        }
        const repository = {
          id,
          name,
          shortDescription: description,
          longDescription,
          url: html_url,
        };

        const projectId = await strapi
          .plugin("github-projects")
          .service("getReposService")
          .getRepoProject(repository);
        return {
          ...repository,
          projectId,
        };
      })
    );

    return repos;
  },
});
