import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Alert, AlertDescription, AlertTitle, AlertIcon, Select } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { withSRRAuth } from "../../utils/withSRRAuth";
import AsyncSelect from 'react-select/async';
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";
import { SubmitHandler, useForm } from "react-hook-form";
import delayTime from "../../utils/delayTime";
import { api } from "../../services/apiClient";
import { TextArea } from "../../components/Form/TextArea";

type CreateStudentsFormData = {
  alunos: string;
}

const createRoomFormSchema = yup.object().shape({
  alunos: yup.string().required("Alunos são obrigatório"),
})

export default function CreateStudents() {

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createRoomFormSchema)
  })

  const INITIAL_DATA_SCHOOLS = {
    value: "0",
    label: 'Selecione a escola',
  }

  const INITIAL_DATA_ROOMS = {
    value: "0",
    label: 'Selecione a turma',
  }

  const [listofSchools, setlistofSchools] = useState([INITIAL_DATA_SCHOOLS]);
  const [listofRooms, setlistofRooms] = useState([INITIAL_DATA_ROOMS]);

  const [selectedSchool, setselectedSchool] = useState(INITIAL_DATA_SCHOOLS);
  const [selectedRoom, setselectedRoom] = useState(INITIAL_DATA_ROOMS);

  const transformingResponseIntoValueAndLabelModelSchool = (data) => ({
    value: data.id,
    label: data.school,
  });

  const transformingResponseIntoValueAndLabelModelRoom = (data) => ({
    value: data.id,
    label: data.room,
  });

  async function callApiSchools() {
    const response = await api.get("/test/school").then((response) => response.data.map(transformingResponseIntoValueAndLabelModelSchool))
    setlistofSchools(response);
  }

  async function callApiRooms() {
    const dados = { school_id: selectedSchool }
    const response = await api.post("/test/room", dados).then((response) => response.data.map(transformingResponseIntoValueAndLabelModelRoom))
    setlistofRooms(response);
  }

  const handleStudentsUser: SubmitHandler<CreateStudentsFormData> = async (values) => {
    const alunos = values.alunos.split("\n");
    const school_id = selectedSchool;
    const room_id = selectedRoom;
    console.log(alunos);
    console.log(school_id);
    console.log(room_id);
  }

  const { errors } = formState;

  function onChangeSchools(e) {
    setselectedSchool(e.target.value);
  }
  function onChangeRoom(e) {
    setselectedRoom(e.target.value);
  }

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

        <Box as="form" onSubmit={handleSubmit(handleStudentsUser)} flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Criar Sala</Heading>
          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid marginBottom={["3"]}>Escola</SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select
                placeholder='Selecione a Escola'
                onClick={() => { callApiSchools() }}
                onChange={onChangeSchools}
                _active={{ bgColor: 'gray.900' }}
              >
                {listofSchools.map((data) => {
                  return (
                    <option key={data.value} value={data.value}>{data.label}</option>
                  )
                })}
              </Select>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Turma</SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select placeholder='Selecione a Turma' onClick={() => { callApiRooms() }} onChange={onChangeRoom} >
                {listofRooms.map((data) => {
                  return (
                    <option key={data.value} value={data.value}>{data.label}</option>
                  )
                })}
              </Select>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Alunos</SimpleGrid>
          <VStack marginBottom={["3"]} spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <TextArea
                error={errors.alunos}
                {...register('alunos')}
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
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSRRAuth(async (ctx) => {
  return {
    props: {}
  }
})