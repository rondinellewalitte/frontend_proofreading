import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { withSRRAuth } from "../../utils/withSRRAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import Link from "next/link";
import delayTime from "../../utils/delayTime";

type CreateSchoolFormData = {
  school: string;
}

const createSchoolFormSchema = yup.object().shape({
  school: yup.string().required("Escola é obrigatório"),
})


export default function CreateSchool() {
  const router = useRouter();

  const createSchool = useMutation(async (school: CreateSchoolFormData) => {
    const response = await api.post("/school", school).catch((error: any) => {
      return error.response;
    })
    return response;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createSchoolFormSchema)
  })

  const [err, setErr] = useState({ status: "", message: "", open: false });

  const handleSchoolUser: SubmitHandler<CreateSchoolFormData> = async (values) => {
    const response = await createSchool.mutateAsync(values);

    const { status, message } = response.data

    setErr({ status, message, open: true });

    if (status === 'success') {
      router.reload();
    }
  }

  const { errors } = formState;

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

        <Box as="form" onSubmit={handleSubmit(handleSchoolUser)} flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Inserir Escola</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="school"
                label="Nome da Escola"
                error={errors.school}
                {...register('school')}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/dashboard" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
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
          pos="absolute" bottom="-100" left="5"
        >
          <AlertIcon />
          <AlertTitle textColor="white">{err.status}</AlertTitle>
          <AlertDescription textColor="white">{err.message}</AlertDescription>
        </Alert> :
        <Alert
          status='success'
          variant='solid'
          width={["80"]}
          pos="absolute" bottom="-100" left="5"
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