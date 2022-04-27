import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "react-query"
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { useRouter } from "next/router";
import { withSRRAuth } from "../../utils/withSRRAuth";
import { useState } from "react";

type CreateUserFormData = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  word_secret: string;
}

const createUserFormSchema = yup.object().shape({
  username: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatório").min(6, "No mínimo 6 caracteres"),
  password_confirmation: yup.string().oneOf([
    null, yup.ref("password")
  ], "As senhas precisam ser iguais"),
  word_secret: yup.string().required("Palavra secreta obrigatório"),
})

export default function CreateUser() {

  const router = useRouter();

  const createUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.post("/client", user).catch((error: any) => {
      return error.response;
    })
    return response;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const [err, setErr] = useState({ status: "", message: "", open: false });

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    const response = await createUser.mutateAsync(values);

    const { status, message } = response.data

    setErr({ status, message, open: true });

    if (status === 'success') {
      router.push('/users')
    }
  }

  const { errors } = formState



  return (
    <Box>
      <Header />
      <Flex
        w="100%"
        my="6"
        maxWidth={1480}
        mx="auto"
        px="6"
      >
        <Sidebar />

        <Box
          flex='1'
          as="form"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">Criar usuário</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="username"
                label="Nome Completo"
                error={errors.username}
                {...register('username')}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                {...register('email')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={errors.password}
                {...register('password')}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação de senha"
                error={errors.password_confirmation}
                {...register('password_confirmation')}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="word_secret"
                type="password"
                label="Palavra secreta"
                error={errors.word_secret}
                {...register('word_secret')}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}>Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
      {!!err.status && (err.status !== "success" ?
        <Alert
          status='error'
          variant='solid'
          width={["80"]}
          pos="absolute" bottom="5" left="5"
        >
          <AlertIcon />
          <AlertTitle textColor="white">{err.status}</AlertTitle>
          <AlertDescription textColor="white">{err.message}</AlertDescription>
        </Alert> :
        <Alert
          status='success'
          variant='solid'
          width={["80"]}
          pos="absolute" bottom="5" left="5"
        >
          <AlertIcon />
          <AlertTitle textColor="white">{err.status}</AlertTitle>
          <AlertDescription textColor="white">{err.message}</AlertDescription>
        </Alert>
      )}
    </Box>
  );
}

export const getServerSideProps = withSRRAuth(async (ctx) => {
  return {
    props: {}
  }
})