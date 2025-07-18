import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useMutationState } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@shared/types";

import { usePatchUser } from "./hooks/usePatchUser";
import { useUser } from "./hooks/useUser";
import { UserAppointments } from "./UserAppointments";

import { useLoginData } from "@/auth/AuthContext";
import { KeyFactories } from "@/react-query/key-factories";

export const UserProfile = () => {
  const { userId } = useLoginData();
  const { user } = useUser();
  const patchUser = usePatchUser();
  const navigate = useNavigate();

  useEffect(() => {
    // use login data for redirect, for base app that doesn't
    //   retrieve user data from the server yet
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  const { generateUpdatedUserKey } = KeyFactories;
  const pendingData = useMutationState({
    filters: {
      mutationKey: generateUpdatedUserKey(),
      status: "pending",
    },
    select: (mutation) => mutation.state.variables,
  });
  const pendingUser = (pendingData?.[0] as User) ?? null;

  const formElements = ["name", "address", "phone"];
  interface FormValues {
    name: string;
    address: string;
    phone: string;
  }

  return (
    <Flex minH="84vh" textAlign="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <UserAppointments />
        <Stack textAlign="center">
          <Heading>Information for {pendingUser?.name ?? user?.name}</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: pendingUser?.name ?? user?.name ?? "",
              address: pendingUser?.address ?? user?.address ?? "",
              phone: pendingUser?.phone ?? user?.phone ?? "",
            }}
            onSubmit={(values: FormValues) => {
              patchUser({ ...user, ...values });
            }}
          >
            <Form>
              {formElements.map((element) => (
                <FormControl key={element} id={element}>
                  <FormLabel>{element}</FormLabel>
                  <Field name={element} as={Input} />
                </FormControl>
              ))}
              <Button mt={6} type="submit">
                Update
              </Button>
            </Form>
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
};
