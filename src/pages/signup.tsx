import { Flex, Button, Stack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { Input } from '../components/Form/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { api } from '../services/apiClient';
import { queryClient } from '../services/queryClient';
import { withSRRGuest } from '../utils/withSRRGuest';
import { useState } from 'react';

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  word_secret: string;
}

const signUpFormSchema = yup.object().shape({
  username: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatório").min(6, "No mínimo 6 caracteres"),
  password_confirmation: yup.string().oneOf([
    null, yup.ref("password")
  ], "As senhas precisam ser iguais"),
  word_secret: yup.string().required("Palavra secreta obrigatório"),
})


export default function SignUp() {

  const router = useRouter();

  const createUser = useMutation(async (user: SignUpFormData) => {
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
    resolver: yupResolver(signUpFormSchema)
  })

  const [err, setErr] = useState({ status: "", message: "", open: false });

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    const response = await createUser.mutateAsync(values);

    const { status, message } = response.data

    setErr({ status, message, open: true });

    if (status === 'success') {
      router.push('/')
    }
  }

  const { errors } = formState

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        w="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <Stack spacing="4">
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
          <Input
            name="word_secret"
            type="password"
            label="Palavra secreta"
            error={errors.word_secret}
            {...register('word_secret')}
          />
        </Stack>
        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
        >
          Criar
        </Button>
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
    </Flex>
  )
}

export const getServerSideProps = withSRRGuest(async (ctx) => {
  return {
    props: {}
  }
});