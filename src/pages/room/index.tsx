import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, background, Stack, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { withSRRAuth } from "../../utils/withSRRAuth";
import AsyncSelect from 'react-select/async';
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { SubmitHandler, useForm } from "react-hook-form";
import delayTime from "../../utils/delayTime";


type CreateRoomFormData = {
  room: string;
}

const createRoomFormSchema = yup.object().shape({
  room: yup.string().required("Sala é obrigatório"),
})

export default function CreateRoom() {

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createRoomFormSchema)
  })

  const INITIAL_DATA = {
    value: 0,
    label: 'Selecione o usuário',
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);

  const mapResponseToValuesAndLabels = (data) => ({
    value: data.id,
    label: data.school,
  });

  async function callApi() {
    const data = await api.get("/test/school").then((response) => response.data.map(mapResponseToValuesAndLabels))
    return data;
  }

  const createRoom = useMutation(async (room: CreateRoomFormData) => {

    const data = { room: room.room, school_id: selectData.value }

    const response = await api.post("/room", data).catch((error: any) => {
      return error.response;
    })
    return response;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const [err, setErr] = useState({ status: "", message: "", open: false });

  const handleRoomUser: SubmitHandler<CreateRoomFormData> = async (values) => {
    const response = await createRoom.mutateAsync(values);

    const { status, message } = response.data

    setErr({ status, message, open: true });

    if (status === 'success') {
      setselectData(INITIAL_DATA);
      reset();
    }
    DelayDialogError();
  }

  async function DelayDialogError() {
    await delayTime(5);
    setErr({ status: "", message: "", open: false });
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

        <Box as="form" onSubmit={handleSubmit(handleRoomUser)} flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Criar Sala</Heading>
          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid marginBottom={["3"]}>Escola</SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <AsyncSelect
                cacheOptions
                id="school_id"
                instanceId="school_id"
                autoFocus={true}
                loadOptions={callApi}
                onChange={(data) => {
                  setselectData(data);
                }}
                value={selectData}
                defaultOptions
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="room"
                label="Sala"
                error={errors.room}
                {...register('room')}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="whiteAlpha">Cancelar</Button>
              <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}>Salvar</Button>
            </HStack>
          </Flex>
        </Box>
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
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSRRAuth(async (ctx) => {
  return {
    props: {}
  }
})

