import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, background, Textarea } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { withSRRAuth } from "../../utils/withSRRAuth";

export default function CreateStudents() {
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

        <Box flex='1' borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Inserir Alunos</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select variant="filled" bgColor="gray.900" _hover={{ bgColor: 'gray.900' }} borderColor="gray.900" placeholder='Selecione a escola' focusBorderColor='pink.500' size='lg' >
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </Select>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Select variant="filled" bgColor="gray.900" _hover={{ bgColor: 'gray.900' }} borderColor="gray.900" placeholder='Selecione a turma' focusBorderColor='pink.500' size='lg' >
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </Select>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Textarea variant="filled" bgColor="gray.900" _hover={{ bgColor: 'gray.900' }} focusBorderColor='pink.500' placeholder='Joao Pereira da Silva'></Textarea>
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="whiteAlpha">Cancelar</Button>
              <Button colorScheme="pink">Salvar</Button>
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