import React, { FC, useCallback, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  BaseCheckbox,
  Typography,
  VisuallyHidden,
  Layout,
  HeaderLayout,
  ContentLayout,
  Loader,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { Pencil, Trash, Plus } from "@strapi/icons";
import { Repo } from "../../../../types";
import { useAlert } from "../../hooks/useAlert";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import BulkActions from "../BulkActions";

import { useTranlation } from "../../utils/useTranslation";

const COL_COUNT = 5;

const Repo: FC<any> = () => {
  const { t, Trans } = useTranlation();
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [isLoadgin, setIsLoading] = React.useState(false);
  const [selectedRepos, setSelectedRepos] = React.useState<Repo[]>([]);
  const { alert, showAlert, AlertComponent } = useAlert();
  const { dialog, setDialog, isVisible, setIsVisible, DialogComponent } =
    useConfirmationDialog();
  const client = useFetchClient();
  const allCheked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allCheked;
  const projectsToCreate = selectedRepos.filter(
    (item) => item.projectId === null
  );
  const projectsToDelete = selectedRepos.filter(
    (item) => item.projectId !== null
  );

  const createProject = async (repo: Repo) => {
    try {
      const response = await client.post("/github-projects/project", repo);
      const newRepos = repos.map((repo) => {
        if (repo.id.toString() === response.data.repositoryId) {
          return {
            ...repo,
            projectId: response.data.id,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      showAlert({
        title: t("actions.create", { name: t("table.project") }),
        message: t("actions.success.create", {
          name: repo.name,
          entity: t("table.project"),
        }),
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: t("actions.error.create", {
          name: t("table.project"),
          entity: t("table.project"),
        }),
        message: err.toString(),
        variant: "danger",
      });
    }
  };

  const createManyProjects = useCallback(async () => {
    try {
      const response = await client.post(
        "/github-projects/projects",
        projectsToCreate
      );
      const newRepos = repos.map((repo) => {
        const findCurrentRepo = response.data.find(
          (currRepo: Omit<Repo, "id"> & { repositoryId: string }) =>
            currRepo.repositoryId === repo.id.toString()
        );
        if (repo.id.toString() === findCurrentRepo?.repositoryId) {
          return {
            ...repo,
            projectId: findCurrentRepo.id,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      setSelectedRepos([]);
      showAlert({
        title: t("actions.create", {
          name: `${t("table.project")}s : ${response.data
            .map((repo: Omit<Repo, "name"> & { title: string }) => repo.title)
            .join(", ")}`,
        }),
        message: t("actions.success.create", {
          entity: t("table.project"),
        }),
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: t("actions.error.create", {
          entity: t("table.project"),
        }),
        message: err.toString(),
        variant: "danger",
      });
    }
  }, [repos, projectsToCreate]);

  const deleteProject = async (repo: Repo) => {
    const { projectId } = repo;
    try {
      const response = await client.del(
        `/github-projects/project/${projectId}`
      );
      const newRepos = repos.map((repo) => {
        if (repo.id.toString() === response.data.repositoryId) {
          return {
            ...repo,
            projectId: null,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      showAlert({
        title: t("actions.delete", { name: repo.name }),
        message: t("actions.success.delete", {
          entity: `${t("table.project")}`,
        }),
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: t("actions.error.delete", {
          name: repo.name,
          entity: t("table.project"),
        }),
        message: err.toString(),
        variant: "danger",
      });
    }
  };

  const deleteMany = useCallback(async () => {
    try {
      const response = await client.del("/github-projects/projects", {
        params: {
          projectIds: projectsToDelete.map((repo) => repo.projectId),
        },
      });
      const newRepos = repos.map((repo) => {
        const findCurrentRepo = response.data.find(
          (currRepo: Omit<Repo, "id"> & { repositoryId: string }) =>
            currRepo.repositoryId === repo.id.toString()
        );
        if (repo.id.toString() === findCurrentRepo?.repositoryId) {
          return {
            ...repo,
            projectId: null,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      setSelectedRepos([]);
      showAlert({
        title: t("actions.delete", {
          name: `${t("table.project")}s : ${response.data
            .map((repo: Omit<Repo, "name"> & { title: string }) => repo.title)
            .join(", ")}`,
        }),
        message: t("actions.success.delete", {
          entity: t("table.project"),
        }),
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: t("actions.error.delete", {
          entity: t("table.project"),
        }),
        message: err.toString(),
        variant: "danger",
      });
    }
  }, [repos, projectsToDelete]);

  useEffect(() => {
    setIsLoading(true);
    client
      .get("/github-projects/repos")
      .then((response: any) => {
        setRepos(response.data);
      })
      .catch((err: any) => {
        showAlert({
          title: t("actions.error.fetching", {
            entity: `${t("table.repositories")}(s)`,
          }),
          message: err.toString(),
          variant: "danger",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoadgin) {
    return (
      <Flex flexDirection="column" height="100vh" justifyContent="center">
        <Loader />
      </Flex>
    );
  }

  return (
    <Box background="neutral100">
      <Layout>
        <Box background="neutral100">
          <HeaderLayout
            title={t("home.title")}
            subtitle={
              <Flex minHeight={8}>
                {selectedRepos.length > 0 ? (
                  <>
                    {selectedRepos.length > 0 && (
                      <BulkActions<Repo>
                        selectedItems={selectedRepos}
                        text={t("bulkActions.text", {
                          projectsToCreate: projectsToCreate?.length || 0,
                          projectsToDelete: projectsToDelete?.length || 0,
                        })}
                        actions={[
                          {
                            show: projectsToCreate?.length > 0,
                            // label: `Create ${
                            //   projectsToCreate?.length || 0
                            // } project(s)`,
                            label: t("bulkActions.create", {
                              projectsToCreate: projectsToCreate?.length || 0,
                            }),
                            variant: "success-light",
                            icon: (<Plus />) as React.ReactNode,
                            function: () => createManyProjects(),
                          },
                          {
                            show: projectsToDelete?.length > 0,
                            // label: `Delete ${
                            //   projectsToDelete?.length || 0
                            // } project(s)`,
                            label: t("bulkActions.delete", {
                              projectsToDelete: projectsToDelete?.length || 0,
                            }),
                            variant: "danger-light",
                            icon: (<Trash />) as React.ReactNode,
                            function: () => {
                              setDialog({
                                ...dialog,
                                title: t("actions.delete", {
                                  name: `${t("table.project")}(s)`,
                                }),
                                description: t("actions.confirm", {
                                  name: `${projectsToDelete?.length || 0} ${t(
                                    "table.project"
                                  )}(s)`,
                                  action: t("actions.delete"),
                                }),
                                onClose: {
                                  label: t("actions.cancel"),
                                  function: () => setIsVisible(false),
                                },
                                onConfirm: {
                                  label: t("actions.delete"),
                                  function: () => {
                                    deleteMany();
                                  },
                                },
                              });
                              setIsVisible(true);
                            },
                          },
                        ]}
                      ></BulkActions>
                    )}
                    {alert && (
                      <AlertComponent
                        closeLabel="Close"
                        marginLeft={4}
                        padding={2}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Typography variant="body" textColor={"neutral600"}>
                      {t("home.description")}
                    </Typography>
                    {alert && (
                      <AlertComponent
                        closeLabel="Close"
                        marginLeft={4}
                        padding={2}
                      />
                    )}
                  </>
                )}
              </Flex>
            }
            as="h2"
            sticky={false}
          />
        </Box>

        <ContentLayout>
          <Table colCount={COL_COUNT} rowCount={repos.length}>
            <Thead>
              <Tr>
                <Th>
                  <BaseCheckbox
                    aria-label="Select all entries"
                    value={allCheked}
                    indeterminate={isIndeterminate}
                    onValueChange={(value: boolean) => {
                      if (value) {
                        const selRepos = repos.map((repo) => repo);
                        setSelectedRepos(selRepos);
                      } else {
                        setSelectedRepos([]);
                      }
                    }}
                  />
                </Th>
                <Th>
                  <Typography variant="sigma">{t("table.name")}</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {t("table.description")}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">{t("table.url")}</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>{t("table.actions")}</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {repos.map((repo) => {
                const {
                  id,
                  name,
                  shortDescription: description,
                  url,
                  projectId,
                } = repo;
                return (
                  <Tr key={`table-row-${id}`}>
                    <Td>
                      <BaseCheckbox
                        aria-label={`Select-${id}`}
                        value={selectedRepos.includes(repo)}
                        onValueChange={(value: boolean) => {
                          if (value) {
                            setSelectedRepos([...selectedRepos, repo]);
                          } else {
                            setSelectedRepos(
                              selectedRepos.filter(
                                (selectedRepo) => selectedRepo.id !== repo.id
                              )
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{name}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {description ?? t("no_description")}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        <Link href={url} isExternal>
                          {url}
                        </Link>
                      </Typography>
                    </Td>
                    <Td>
                      {projectId ? (
                        <Flex>
                          <Link
                            alt={`${t("actions.edit")} ${name}`}
                            to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}
                          >
                            <IconButton
                              onClick={() => console.log("edit")}
                              label={t("actions.edit")}
                              noBorder
                              icon={<Pencil />}
                            />
                          </Link>
                          <Box paddingLeft={1}>
                            <IconButton
                              onClick={() => {
                                setDialog({
                                  ...dialog,
                                  title: t("actions.delete", {
                                    name: t("table.project"),
                                  }),
                                  // description: `Are you sure you want to delete ${repo.name}?`,
                                  description: t("actions.confirm", {
                                    name: repo.name,
                                    action: t("actions.delete"),
                                  }),
                                  onClose: {
                                    label: t("actions.cancel"),
                                    function: () => setIsVisible(false),
                                  },
                                  onConfirm: {
                                    label: t("actions.delete"),
                                    function: () => {
                                      deleteProject(repo);
                                      setIsVisible(false);
                                    },
                                  },
                                });
                                setIsVisible(true);
                              }}
                              label={t("actions.delete")}
                              noBorder
                              icon={<Trash />}
                            />
                          </Box>
                        </Flex>
                      ) : (
                        <Flex>
                          <IconButton
                            onClick={() => createProject(repo)}
                            label={t("actions.create")}
                            noBorder
                            icon={<Plus />}
                          />
                        </Flex>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ContentLayout>
        <DialogComponent />
      </Layout>
    </Box>
  );
};

export default Repo;
