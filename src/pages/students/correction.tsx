import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, RadioGroup, Stack, Radio, FormControl, FormErrorMessage, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import delayTime from "../../utils/delayTime";
import { withSRRAuth } from "../../utils/withSRRAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "react-query";
import { queryClient } from "../../services/queryClient";


type CreateTestFormData = {
  id: string;
  answer_01?: string;
  answer_02?: string;
  answer_03?: string;
  answer_04?: string;
  answer_05?: string;
  answer_06?: string;
  answer_07?: string;
  answer_08?: string;
  answer_09?: string;
  answer_10?: string;
  answer_11?: string;
  answer_12?: string;
  answer_13?: string;
  answer_14?: string;
  answer_15?: string;
  answer_16?: string;
  answer_17?: string;
}

const createStudentFormSchema = yup.object().shape({
  answer_01: yup.string().nullable().required("Campo obrigatório"),
  answer_02: yup.string().nullable().required("Campo obrigatório"),
  answer_03: yup.string().nullable().required("Campo obrigatório"),
  answer_04: yup.string().nullable().required("Campo obrigatório"),
  answer_05: yup.string().nullable().required("Campo obrigatório"),
  answer_06: yup.string().nullable().required("Campo obrigatório"),
  answer_07: yup.string().nullable().required("Campo obrigatório"),
  answer_08: yup.string().nullable().required("Campo obrigatório"),
  answer_09: yup.string().nullable().required("Campo obrigatório"),
  answer_10: yup.string().nullable().required("Campo obrigatório"),
})

export default function Correction() {


  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createStudentFormSchema)
  })


  const INITIAL_DATA_SCHOOLS = {
    value: "0",
    label: 'Selecione a escola',
  }

  const INITIAL_DATA_ROOMS = {
    value: "0",
    label: 'Selecione a turma',
  }

  const INITIAL_DATA_STUDENT = {
    value: "0",
    label: 'Selecione um aluno',
    type_test: null,
  }

  const [listofSchools, setlistofSchools] = useState([INITIAL_DATA_SCHOOLS]);
  const [listofRooms, setlistofRooms] = useState([INITIAL_DATA_ROOMS]);
  const [listofStudents, setlistofStudents] = useState([INITIAL_DATA_STUDENT]);

  const [selectedSchool, setselectedSchool] = useState("");
  const [selectedStudent, setselectedStudent] = useState("");
  const [selectedRoom, setselectedRoom] = useState("");
  const [selectedType, setselectedType] = useState(false);
  const [err, setErr] = useState({ status: "", message: "", open: false });

  const [answer_01, setanswer_01] = useState("");
  const [answer_02, setanswer_02] = useState("");
  const [answer_03, setanswer_03] = useState("");
  const [answer_04, setanswer_04] = useState("");
  const [answer_05, setanswer_05] = useState("");
  const [answer_06, setanswer_06] = useState("");
  const [answer_07, setanswer_07] = useState("");
  const [answer_08, setanswer_08] = useState("");
  const [answer_09, setanswer_09] = useState("");
  const [answer_10, setanswer_10] = useState("");
  const [answer_11, setanswer_11] = useState("");
  const [answer_12, setanswer_12] = useState("");
  const [answer_13, setanswer_13] = useState("");
  const [answer_14, setanswer_14] = useState("");
  const [answer_15, setanswer_15] = useState("");
  const [answer_16, setanswer_16] = useState("");
  const [answer_17, setanswer_17] = useState("");



  const transformingResponseIntoValueAndLabelModelSchool = (data) => ({
    value: data.id,
    label: data.school,
  });

  const transformingResponseIntoValueAndLabelModelRoom = (data) => ({
    value: data.id,
    label: data.room,
  });

  const transformingResponseIntoValueAndLabelModelStudent = (data) => ({
    value: data.id,
    label: data.student_name,
    type_test: data.type_test
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

  async function callApiStudent() {
    const dados = { school_id: selectedSchool, student_id: selectedStudent }
    const response = await api.post("/students", dados).then((response) => response.data.map(transformingResponseIntoValueAndLabelModelStudent))
    setlistofStudents(response);
  }

  const updateStudent = useMutation(async (student: CreateTestFormData) => {
    const response = await api.post("/student", student).catch((error: any) => {
      return error.response;
    })
    return response;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })


  const handleStudentsTest: SubmitHandler<CreateTestFormData> = async (values) => {

    const test = {
      id: selectedStudent,
      answer_01,
      answer_02,
      answer_03,
      answer_04,
      answer_05,
      answer_06,
      answer_07,
      answer_08,
      answer_09,
      answer_10,
      answer_11,
      answer_12,
      answer_13,
      answer_14,
      answer_15,
      answer_16,
      answer_17
    }
    await updateStudent.mutateAsync(test);

    const id_school = selectedSchool;
    const id_room = selectedRoom;
    const id_student = selectedStudent;

    if (!id_school.length) {
      console.log("passou")
      setErr({ status: "Erro:", message: "Selecione a escola", open: true });
      DelayDialogError();
    } else {
      if (!id_room || id_room === "0") {
        setErr({ status: "Erro:", message: "Selecione a turma", open: true });
        DelayDialogError();
      } else {
        if (!id_student) {
          setErr({ status: "Erro:", message: "Selecione a aluno", open: true });
          DelayDialogError();
        } else {
          await updateStudent.mutateAsync(test);
          setErr({ status: "success", message: "Gabarito cadastrado com sucesso", open: true });
          setanswer_01("");
          setanswer_02("");
          setanswer_03("");
          setanswer_04("");
          setanswer_05("");
          setanswer_06("");
          setanswer_07("");
          setanswer_08("");
          setanswer_09("");
          setanswer_10("");
          setanswer_11("");
          setanswer_12("");
          setanswer_13("");
          setanswer_14("");
          setanswer_15("");
          setanswer_16("");
          setanswer_17("");
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
  async function onChangeStudent(e) {
    const dataStudent = e.target.value.split(",");
    setselectedStudent(dataStudent[0]);

    const { data } = await updateStudent.mutateAsync({ id: dataStudent[0] });

    setanswer_01(data.answer_01);
    setanswer_02(data.answer_02);
    setanswer_03(data.answer_03);
    setanswer_04(data.answer_04);
    setanswer_05(data.answer_05);
    setanswer_06(data.answer_06);
    setanswer_07(data.answer_07);
    setanswer_08(data.answer_08);
    setanswer_09(data.answer_09);
    setanswer_10(data.answer_10);
    setanswer_11(data.answer_11);
    setanswer_12(data.answer_12);
    setanswer_13(data.answer_13);
    setanswer_14(data.answer_14);
    setanswer_15(data.answer_15);
    setanswer_16(data.answer_16);
    setanswer_17(data.answer_17);

    if (dataStudent[1] === "2") {
      setselectedType(true)
    } else {
      setselectedType(false)
    }
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

        <Box as="form" onSubmit={handleSubmit(handleStudentsTest)} flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Gabarito Prova</Heading>
          <Divider my="6" borderColor="gray.700" />
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
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select
                placeholder='Selecione a Turma'
                onClick={() => { callApiRooms() }}
                onChange={onChangeRoom}
                _active={{ bgColor: 'gray.900' }}
              >
                {listofRooms.map((data) => {
                  return (
                    <option key={data.value} value={data.value}>{data.label}</option>
                  )
                })}
              </Select>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select
                placeholder='Selecione o Aluno(a)'
                onClick={() => { callApiStudent() }}
                onChange={onChangeStudent}
                _active={{ bgColor: 'gray.900' }}
              >
                {listofStudents.map((data) => {
                  return (
                    <option key={data.value} value={[data.value, data.type_test]}>{data.label}</option>
                  )
                })}
              </Select>
            </SimpleGrid>

          </VStack>
          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_01}>
                <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Português</SimpleGrid>
                <RadioGroup onChange={setanswer_01} value={answer_01}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>01)</SimpleGrid>
                    <Radio {...register("answer_01")} value='1'>A</Radio>
                    <Radio {...register("answer_01")} value='2'>B</Radio>
                    <Radio {...register("answer_01")} value='3'>C</Radio>
                    <Radio {...register("answer_01")} value='4'>D</Radio>
                    {!!errors.answer_01 && (
                      <FormErrorMessage>
                        {errors.answer_01.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>


          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_02}>
                <RadioGroup onChange={setanswer_02} value={answer_02}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>02)</SimpleGrid>
                    <Radio {...register("answer_02")} value='1'>A</Radio>
                    <Radio {...register("answer_02")} value='2'>B</Radio>
                    <Radio {...register("answer_02")} value='3'>C</Radio>
                    <Radio {...register("answer_02")} value='4'>D</Radio>
                    {!!errors.answer_02 && (
                      <FormErrorMessage>
                        {errors.answer_02.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_03}>
                <RadioGroup onChange={setanswer_03} value={answer_03}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>03)</SimpleGrid>
                    <Radio {...register("answer_03")} value='1'>A</Radio>
                    <Radio {...register("answer_03")} value='2'>B</Radio>
                    <Radio {...register("answer_03")} value='3'>C</Radio>
                    <Radio {...register("answer_03")} value='4'>D</Radio>
                    {!!errors.answer_03 && (
                      <FormErrorMessage>
                        {errors.answer_03.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_04}>
                <RadioGroup onChange={setanswer_04} value={answer_04}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>04)</SimpleGrid>
                    <Radio {...register("answer_04")} value='1'>A</Radio>
                    <Radio {...register("answer_04")} value='2'>B</Radio>
                    <Radio {...register("answer_04")} value='3'>C</Radio>
                    <Radio {...register("answer_04")} value='4'>D</Radio>
                    {!!errors.answer_04 && (
                      <FormErrorMessage>
                        {errors.answer_04.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_05}>
                <RadioGroup onChange={setanswer_05} value={answer_05}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>05)</SimpleGrid>
                    <Radio {...register("answer_05")} value='1'>A</Radio>
                    <Radio {...register("answer_05")} value='2'>B</Radio>
                    <Radio {...register("answer_05")} value='3'>C</Radio>
                    <Radio {...register("answer_05")} value='4'>D</Radio>
                    {!!errors.answer_05 && (
                      <FormErrorMessage>
                        {errors.answer_05.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>


          {selectedType && (
            <>
              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl isInvalid={!!errors.answer_11}>
                    <RadioGroup onChange={setanswer_11} value={answer_11}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>06)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>

              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl >
                    <RadioGroup onChange={setanswer_12} value={answer_12}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>07)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </>
          )}

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_06}>
                <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Matemática</SimpleGrid>
                <RadioGroup onChange={setanswer_06} value={answer_06}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>01)</SimpleGrid>
                    <Radio {...register("answer_06")} value='1'>A</Radio>
                    <Radio {...register("answer_06")} value='2'>B</Radio>
                    <Radio {...register("answer_06")} value='3'>C</Radio>
                    <Radio {...register("answer_06")} value='4'>D</Radio>
                    {!!errors.answer_06 && (
                      <FormErrorMessage>
                        {errors.answer_06.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_07}>
                <RadioGroup onChange={setanswer_07} value={answer_07}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>02)</SimpleGrid>
                    <Radio {...register("answer_07")} value='1'>A</Radio>
                    <Radio {...register("answer_07")} value='2'>B</Radio>
                    <Radio {...register("answer_07")} value='3'>C</Radio>
                    <Radio {...register("answer_07")} value='4'>D</Radio>
                    {!!errors.answer_07 && (
                      <FormErrorMessage>
                        {errors.answer_07.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>




          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_08}>
                <RadioGroup onChange={setanswer_08} value={answer_08}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>03)</SimpleGrid>
                    <Radio {...register("answer_08")} value='1'>A</Radio>
                    <Radio {...register("answer_08")} value='2'>B</Radio>
                    <Radio {...register("answer_08")} value='3'>C</Radio>
                    <Radio {...register("answer_08")} value='4'>D</Radio>
                    {!!errors.answer_08 && (
                      <FormErrorMessage>
                        {errors.answer_08.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_09}>
                <RadioGroup onChange={setanswer_09} value={answer_09}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>04)</SimpleGrid>
                    <Radio {...register("answer_09")} value='1'>A</Radio>
                    <Radio {...register("answer_09")} value='2'>B</Radio>
                    <Radio {...register("answer_09")} value='3'>C</Radio>
                    <Radio {...register("answer_09")} value='4'>D</Radio>
                    {!!errors.answer_09 && (
                      <FormErrorMessage>
                        {errors.answer_09.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
              <FormControl isInvalid={!!errors.answer_10}>
                <RadioGroup onChange={setanswer_10} value={answer_10}>
                  <Stack spacing={50} direction='row'>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>05)</SimpleGrid>
                    <Radio {...register("answer_10")} value='1'>A</Radio>
                    <Radio {...register("answer_10")} value='2'>B</Radio>
                    <Radio {...register("answer_10")} value='3'>C</Radio>
                    <Radio {...register("answer_10")} value='4'>D</Radio>
                    {!!errors.answer_10 && (
                      <FormErrorMessage>
                        {errors.answer_10.message}
                      </FormErrorMessage>
                    )}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </VStack>

          {selectedType && (
            <>
              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl >
                    <RadioGroup onChange={setanswer_13} value={answer_13}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>06)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>

              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl>
                    <RadioGroup onChange={setanswer_14} value={answer_14}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>07)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>

              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid>
              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl>
                    <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>Ciencia</SimpleGrid>
                    <RadioGroup onChange={setanswer_15} value={answer_15}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>01)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>


              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl >
                    <RadioGroup onChange={setanswer_16} value={answer_16}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>02)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>


              <SimpleGrid marginBottom={["3"]} marginTop={["3"]}></SimpleGrid><VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="10" w="100%">
                  <FormControl>
                    <RadioGroup onChange={setanswer_17} value={answer_17}>
                      <Stack spacing={50} direction='row'>
                        <SimpleGrid marginBottom={["3"]} marginTop={["3"]}>03)</SimpleGrid>
                        <Radio value='1'>A</Radio>
                        <Radio value='2'>B</Radio>
                        <Radio value='3'>C</Radio>
                        <Radio value='4'>D</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </>
          )}
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="whiteAlpha" >Cancelar</Button>
              <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}>Salvar</Button>
            </HStack>
          </Flex>
        </Box>

        {!!err.status && (err.status !== "success" ?
          <Alert
            status='error'
            variant='solid'
            width={["80"]}
            pos="absolute" bottom="10" left="5"
          >
            <AlertIcon />
            <AlertTitle textColor="white">{err.status}</AlertTitle>
            <AlertDescription textColor="white">{err.message}</AlertDescription>
          </Alert> :
          <Alert
            status='success'
            variant='solid'
            width={["80"]}
            pos="absolute" bottom="10" left="5"
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