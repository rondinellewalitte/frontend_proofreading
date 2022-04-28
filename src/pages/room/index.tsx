import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, background, Stack } from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { withSRRAuth } from "../../utils/withSRRAuth";
import AsyncSelect from 'react-select/async';
import { useState } from "react";

export default function CreateRoom() {

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

  function handleSubmit() {
    console.log(selectData);
    setselectData(INITIAL_DATA);
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

        <Box as="form" flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Criar Sala</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <AsyncSelect
                cacheOptions
                id="selectbox"
                instanceId="selectbox"
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
              <Input name="room" label="Sala" />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="whiteAlpha">Cancelar</Button>
              <Button colorScheme="pink" onClick={handleSubmit}>Salvar</Button>
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