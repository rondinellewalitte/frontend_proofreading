import { Box, Button, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import { withSRRAuth } from "../utils/withSRRAuth";


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false, })

const options = {

  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,

  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    labels: {
      formatter: function (val, timestamp) {
        return new Date(val).toLocaleDateString()
      },
    },

    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    category: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.7,


    }
  }
};
const series = [
  { name: "siries1", data: [31, 120, 10, 28, 61, 18, 109] }
];

export default function Dashboard() {

  const { user, signOut } = useContext(AuthContext);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex
        w="100%"
        my="6"
        maxWidth={1480}
        mx="auto"
        px="6"
      >
        <Sidebar />
        <SimpleGrid flex="1" gap="4" minChildWidth="320px">
          <Box
            p={["6", "8"]}
            bg="gray.800"
            borderRadius={8}
          >
            <Text fontSize="lg" mb="4">Alunos Cadastrados</Text>
            <Text> Em construção</Text>
          </Box>
          <Box
            p={["6", "8"]}
            bg="gray.800"
            borderRadius={8}
          >
            <Text fontSize="lg" mb="4">Alunos sem Notas</Text>
            <Text> Em construção</Text>
          </Box>
        </SimpleGrid>

      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSRRAuth(async (ctx) => {
  return {
    props: {}
  }
})


