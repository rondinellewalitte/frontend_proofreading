import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Alert, AlertDescription, AlertTitle, AlertIcon } from "@chakra-ui/react";
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
  student_name: [string];
}

const createRoomFormSchema = yup.object().shape({
  alunos: yup.string().required("Alunos são obrigatório"),
})

export default function CreateStudents() {

  const [isActive, setisActive] = useState(false);


  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createRoomFormSchema)
  })

  const INITIAL_DATA = {
    value: 0,
    label: 'Selecione o usuário',
  };

  const [selectData, setselectData] = useState(INITIAL_DATA);
  const [selectData2, setselectData2] = useState(INITIAL_DATA);


  const mapResponseToValuesAndLabels = (data) => ({
    value: data.id,
    label: data.school,
  });

  const mapResponseToValuesAndLabels2 = (data) => ({
    value: data.id,
    label: data.room,
  });

  async function callApiSchools() {
    const data = await api.get("/test/school").then((response) => response.data.map(mapResponseToValuesAndLabels))
    return data;
  }

  async function callApiRooms() {
    const dados = { school_id: selectData.value }
    const tt = await api.post("/test/room", dados).then((response) => response.data.map(mapResponseToValuesAndLabels2))
    return tt;
  }

  const handleRoomUser: SubmitHandler<CreateStudentsFormData> = async (values) => {

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
                loadOptions={callApiSchools}
                onChange={(data) => {
                  setselectData(data);
                  setisActive(true)
                }}
                value={selectData}
                defaultOptions
              />
            </SimpleGrid>
          </VStack>

          {selectData.value ? <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
            <AsyncSelect
              cacheOptions
              id="school_id"
              instanceId="school_id"
              autoFocus={true}
              loadOptions={callApiRooms}
              onChange={(data) => {
                setselectData2(data);
              }}
              value={selectData2}
              defaultOptions
            />
          </SimpleGrid> : <></>}

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Turma</SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
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