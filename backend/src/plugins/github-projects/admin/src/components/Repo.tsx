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
  Alert,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { Pencil, Trash, Plus } from "@strapi/icons";
import { Repo } from "../../../types";

const COL_COUNT = 5;

const Repo: FC<any> = () => {
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [isLoadgin, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const client = useFetchClient();
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const allCheked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allCheked;

  const createProject = async (repo: Repo) => {
    console.log("create project", repo);
    const response = await client.post("/github-projects/project", repo);
    console.log(response);
  };

  useEffect(() => {
    setIsLoading(true);
    client
      .get("/github-projects/repos")
      .then((response: any) => {
        setRepos(response.data);
      })
      .catch((err: any) => {
        setError(err);
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

  if (error) {
    return (
      <Box padding={8} background="neutral100">
        <Alert
          closeLabel="Close alert"
          title="Error fetching repositories"
          variant="danger"
        >
          {(error as any).toString()}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <HeaderLayout title="Repositories" subtitle="your git repos" as="h2" />

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
                            onClick={() => console.log("delete")}
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
    </>
  );
};

export default Repo;
