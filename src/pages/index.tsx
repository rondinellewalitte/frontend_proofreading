import { Flex, Button, Stack, AlertDescription, AlertIcon, AlertTitle, Alert, FormErrorMessage, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { Input } from '../components/Form/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { withSRRGuest } from '../utils/withSRRGuest';

type SignInFormData = {
  email: string;
  password: string;
}

type ResponseSignIn = {
  status: string;
  message: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatório"),
})


export default function SignIn() {

  const { signIn } = useContext(AuthContext)

  const [err, setErr] = useState({ status: "", message: "", open: false });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })

  const { errors } = formState

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    const { status, message } = await signIn(values) as ResponseSignIn;
    setErr({ status, message, open: true });
  }

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
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />
        </Stack>
        <Stack spacing="4">
          <Button
            type="submit"
            mt="6"
            colorScheme="pink"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
          <Link href="/signup" passHref>
            <Button size="lg" colorScheme="whiteAlpha">Inscrever-se</Button>
          </Link>
        </Stack>

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
