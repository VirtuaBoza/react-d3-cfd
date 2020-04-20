import React from 'react';
import CumulativeFlowDiagram from './components/CumulativeFlowDiagram';
import data from './data1.json';

function App() {
  const startDate = new Date('2020-04-13T15:42:05.233Z');
  const endDate = new Date('2020-04-24T22:00:00Z');
  const keys = [
    'In Progress',
    'Ready to Deploy',
    'Ready for Test',
    'Testing',
    'Ready for Approval',
    'Done',
  ];

  const stackData = convertStoriesToStackData(data, keys, startDate);

  return (
    <div>
      <CumulativeFlowDiagram
        width={600}
        height={300}
        startDate={startDate}
        endDate={endDate}
        keys={keys}
        backgroundTitle="Sprint Backlog"
        total={data.length}
        stackData={stackData}
      />
    </div>
  );
}

export default App;

export function wasStoryInThisStateAtThisTime(story, states, stateIndex, time) {
  const dateStringAtState = story[states[stateIndex]];
  if (dateStringAtState) {
    const dateAtState = new Date(dateStringAtState);
    if (dateAtState.getTime() === time.getTime()) {
      return true;
    } else if (dateAtState.getTime() < time.getTime()) {
      for (let i = stateIndex + 1; i < states.length; i++) {
        if (
          story[states[i]] &&
          new Date(story[states[i]]).getTime() <= time.getTime()
        ) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

export function convertStoriesToStackData(data, keys, start) {
  const transitions = data
    .reduce(
      (acc, cur) => {
        for (let key of keys) {
          const date = cur.selectedChanges[key];
          if (date) {
            acc.push(new Date(date));
          }
        }
        return acc;
      },
      [new Date(start)]
    )
    .sort((a, b) => a - b);

  return transitions.map((time) => {
    const point = { date: time };
    keys.forEach((key, i, arr) => {
      point[key] = data.reduce((acc, cur) => {
        if (wasStoryInThisStateAtThisTime(cur.selectedChanges, arr, i, time)) {
          return acc + 1;
        }
        return acc;
      }, 0);
    });
    return point;
  });
}
