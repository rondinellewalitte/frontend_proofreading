import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Alert, AlertDescription, AlertTitle, AlertIcon, Select, Radio, FormControl, FormErrorMessage, Stack, RadioGroup } from "@chakra-ui/react";
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
  type_test: string;

}

type CreateStudentFormData = {
  student_name: string;
  id_school: string;
  id_room: string;
  type_test: string;
}

const createRoomFormSchema = yup.object().shape({
  alunos: yup.string().required("Alunos são obrigatório"),
  type_test: yup.string().nullable().required("Escolha uma Opção"),


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

  const [selectedSchool, setselectedSchool] = useState("");
  const [selectedRoom, setselectedRoom] = useState("");
  const [err, setErr] = useState({ status: "", message: "", open: false });
  const [valueG, setValueG] = useState('');

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

  const createStudent = useMutation(async (student: CreateStudentFormData) => {

    const response = await api.post("/test", student).catch((error: any) => {
      return error.response;
    })
    return response;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const handleStudentsUser: SubmitHandler<CreateStudentsFormData> = async (values) => {

    const alunos = values.alunos.split("\n").filter(Boolean);
    const id_school = selectedSchool;
    const id_room = selectedRoom;
    const type_test = values.type_test;
    console.log(type_test);

    if (!id_school) {
      setErr({ status: "Erro:", message: "Selecione a escola", open: true });
      DelayDialogError();
    } else {
      if (!id_room || id_room === "0") {
        setErr({ status: "Erro:", message: "Selecione a sala", open: true });
        DelayDialogError();
      } else {
        if (alunos) {
          for (const aluno of alunos) {
            await createStudent.mutateAsync({ student_name: aluno, id_room, id_school, type_test });
          }

          setErr({ status: "success", message: "Alunos gravados com sucesso", open: true });
          reset();
          DelayDialogError();
        }
      }
    }
  }

  const { errors } = formState;

  async function DelayDialogError() {
    await delayTime(5);
    setErr({ status: "", message: "", open: false });
  }


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
          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Gabarito</SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.type_test}>

                <RadioGroup onChange={setValueG} value={valueG}>
                  <Stack spacing={50} direction='row'>
                    <Radio {...register("type_test")} value='1'>10</Radio>
                    <Radio {...register("type_test")} value='2'>17</Radio>

                    {!!errors.type_test && (
                      <FormErrorMessage>
                        {errors.type_test.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
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