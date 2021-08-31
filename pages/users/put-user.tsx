import {
  Heading,
  Button,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  token: string;
  username: string;
  newToken: string;
  thanksCode?: string;
};

const putUser = async (
  username: string,
  token: string,
  body: Record<string, any>
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}`,

    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-USER-TOKEN": token,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    // TODO: define custom error
    const error = new Error("API request failed");
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function PutUser() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      token: "",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, ...body } = getValues();
    try {
      const response = await putUser(username, token, body);
      console.log(response);
      setResponse(response);
      setError(null);
    } catch (error) {
      setResponse(null);
      setError(error);
    }
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        PUT - /v1/users/&lt;username&gt;
      </Heading>

      <chakra.p py="4">
        Updates the authentication token for the specified user.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Input name="token" required register={register} errors={errors} />
          {/* TODO: add validation rule: [ -~]{8,128} */}
          <Input name="newToken" required register={register} errors={errors} />
          <Input name="thanksCode" register={register} errors={errors} />
          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Execute
          </Button>
        </Stack>
      </form>
      <Heading size="md" pt="12" pb="4">
        Response
      </Heading>
      <Stack spacing={4}>
        {response && (
          <Code display="block" whiteSpace="pre">
            {JSON.stringify(response, null, 2)}
          </Code>
        )}
        {error && (
          <>
            <Alert status="error">
              <AlertIcon />
              {error.status}
            </Alert>
            <Code colorScheme="red" display="block" whiteSpace="pre">
              {JSON.stringify(error.info, null, 2)}
            </Code>
          </>
        )}
      </Stack>
    </Layout>
  );
}
