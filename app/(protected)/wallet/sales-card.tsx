import {
  AreaChart,
  BadgeDelta,
  Card,
  Flex,
  Metric,
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  Text
} from '@tremor/react';

import { useState } from 'react';

const sales = [
  {
    Month: 'Jan 21',
    Sales: 2890
  },
  {
    Month: 'Feb 21',
    Sales: 1890
  },
  {
    Month: 'Dec 21',
    Sales: 3350
  },
  {
    Month: 'Jan 22',
    Sales: 3401
  },
  {
    Month: 'Mar 22',
    Sales: 3576
  }
];

const products: { [key: string]: any } = [
  {
    title: 'B2B',
    value: 38,
    metric: '$ 100,838',
    location: 'A'
  },
  {
    title: 'B2C',
    value: 34,
    metric: '$ 90,224',
    location: 'A'
  }
];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export const SalesCard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedLocation = selectedIndex === 0 ? 'A' : 'B';

  return (
    <Card className="max-w-md mx-auto">
      <Flex alignItems="start">
        <Text>Balance trends</Text>
        <BadgeDelta deltaType="moderateIncrease">23.1%</BadgeDelta>
      </Flex>
      <Flex
        justifyContent="start"
        alignItems="baseline"
        className="space-x-3 truncate"
      >
        <Metric>$ 255,465</Metric>
        <Text>from $ 210,482</Text>
      </Flex>
      <AreaChart
        className="mt-10 h-48"
        data={sales}
        index="Month"
        categories={['Sales']}
        colors={['blue']}
        showYAxis={false}
        showLegend={false}
        startEndOnly={true}
        valueFormatter={valueFormatter}
      />
      <TabGroup
        className="mt-4"
        index={selectedIndex}
        onIndexChange={setSelectedIndex}
      >
        <TabList>
          <Tab>Canada</Tab>
          <Tab>Brazil</Tab>
        </TabList>
      </TabGroup>
      {products
        .filter((item: any) => item.location === selectedLocation)
        .map((item: any) => (
          <div key={item.title} className="mt-4 space-y-2">
            <Flex>
              <Text>{item.title}</Text>
              <Text>{`${item.value}% (${item.metric})`}</Text>
            </Flex>
            <ProgressBar value={item.value} />
          </div>
        ))}
    </Card>
  );
};
