import { Box, Button, Text, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Select, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { withSRRAuth } from "../../utils/withSRRAuth";

export default function Correction() {
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
          <Heading size="lg" fontWeight="normal">Gabarito Prova</Heading>
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
              <Select variant="filled" bgColor="gray.900" _hover={{ bgColor: 'gray.900' }} borderColor="gray.900" placeholder='Selecione a aluno' focusBorderColor='pink.500' size='lg' >
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </Select>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <RadioGroup>
                <Stack spacing="4">
                  <Text>Português</Text>
                  <Stack spacing={50} direction='row'>
                    <Radio colorScheme='pink' value='1'>
                      A
                    </Radio>
                    <Radio colorScheme='pink' value='2'>
                      B
                    </Radio>
                    <Radio colorScheme='pink' value='3'>
                      C
                    </Radio>
                    <Radio colorScheme='pink' value='4'>
                      D
                    </Radio>
                  </Stack>
                </Stack>
              </RadioGroup>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <RadioGroup>
                <Stack spacing="4">
                  <Text>Matemática</Text>
                  <Stack spacing={50} direction='row'>
                    <Radio colorScheme='pink' value='1'>
                      A
                    </Radio>
                    <Radio colorScheme='pink' value='2'>
                      B
                    </Radio>
                    <Radio colorScheme='pink' value='3'>
                      C
                    </Radio>
                    <Radio colorScheme='pink' value='4'>
                      D
                    </Radio>
                  </Stack>
                </Stack>
              </RadioGroup>
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