import React, { FC, useEffect } from "react";
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
  HeaderLayout,
  Loader,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { Pencil, Trash, Plus } from "@strapi/icons";
import { Repo } from "../../../types";
import { useAlert } from "../hooks/useAlert";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";

const COL_COUNT = 5;

const Repo: FC<any> = () => {
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [isLoadgin, setIsLoading] = React.useState(false);
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const { alert, showAlert, AlertComponent } = useAlert();
  const { dialog, setDialog, isVisible, setIsVisible, DialogComponent } =
    useConfirmationDialog();
  const client = useFetchClient();
  const allCheked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allCheked;

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
        title: "Project created",
        message: "Project created successfully",
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: "Error creating project",
        message: err.message,
        variant: "danger",
      });
    }
  };

  const deleteProject = async (repo: Repo) => {
    const { projectId } = repo;
    try {
      const response = await client.del(
        `/github-projects/project/${projectId}`
      );
      console.log(response);
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
        title: "Project deleted",
        message: "Project deleted successfully",
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: "Error deleting project",
        message: err.message,
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    client
      .get("/github-projects/repos")
      .then((response: any) => {
        setRepos(response.data);
      })
      .catch((err: any) => {
        showAlert({
          title: "Error fetching repositories",
          message: err.message,
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
    <>
      <Flex justifyContent="flex-start">
        <HeaderLayout title="Repositories" subtitle="your git repos" as="h2" />
        {alert && (
          <div>
            <AlertComponent closeLabel="Close" />
          </div>
        )}
      </Flex>
      <Box padding={8} background="neutral100">
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
                      const selRepos = repos.map((repo) => repo.id);
                      setSelectedRepos(selRepos);
                    } else {
                      setSelectedRepos([]);
                    }
                  }}
                />
              </Th>
              <Th>
                <Typography variant="sigma">Name</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Description</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Url</Typography>
              </Th>
              <Th>
                <VisuallyHidden>Actions</VisuallyHidden>
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
                      aria-label={`Select ${id}`}
                      value={selectedRepos.includes(id)}
                      onValueChange={(value: boolean) => {
                        if (value) {
                          setSelectedRepos([...selectedRepos, id]);
                        } else {
                          setSelectedRepos(
                            selectedRepos.filter((repoId) => repoId !== id)
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
                      {description ?? "no description"}
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
                          alt={`Edit ${name}`}
                          to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}
                        >
                          <IconButton
                            onClick={() => console.log("edit")}
                            label="Edit"
                            noBorder
                            icon={<Pencil />}
                          />
                        </Link>
                        <Box paddingLeft={1}>
                          <IconButton
                            onClick={() => {
                              setDialog({
                                ...dialog,
                                title: "Delete project",
                                description: `Are you sure you want to delete ${repo.name}?`,
                                onClose: {
                                  label: "Cancel",
                                  function: () => setIsVisible(false),
                                },
                                onConfirm: {
                                  label: "Delete",
                                  function: () => {
                                    deleteProject(repo);
                                    setIsVisible(false);
                                  },
                                },
                              });
                              setIsVisible(true);
                            }}
                            label="Delete"
                            noBorder
                            icon={<Trash />}
                          />
                        </Box>
                      </Flex>
                    ) : (
                      <Flex>
                        <IconButton
                          onClick={() => createProject(repo)}
                          label="Add"
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
      </Box>
      <DialogComponent />
    </>
  );
};

export default Repo;
