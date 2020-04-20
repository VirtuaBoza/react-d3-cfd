import {
  convertStoriesToStackData,
  wasStoryInThisStateAtThisTime,
} from './App';
import data from './data.json';

const keys = [
  'In Progress',
  'Ready to Deploy',
  'Ready for Test',
  'Testing',
  'Ready for Approval',
  'Done',
];

describe('wasStoryInThisStateAtThisTime', () => {
  it('is false for In Progress when In Progress is after time', () => {
    const story = {
      'In Progress': '2020-01-02T12:00:00.000-0500',
      'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      'Ready for Test': '2020-01-04T12:00:00.000-0500',
      Testing: '2020-01-05T12:00:00.000-0500',
      'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        0,
        new Date('2020-01-01T12:00:00.000-0500')
      )
    ).toBe(false);
  });

  it('is true for In Progress when time is on In Progress date', () => {
    const story = {
      'In Progress': '2020-01-02T12:00:00.000-0500',
      'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      'Ready for Test': '2020-01-04T12:00:00.000-0500',
      Testing: '2020-01-05T12:00:00.000-0500',
      'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        0,
        new Date('2020-01-02T12:00:00.000-0500')
      )
    ).toBe(true);
  });

  it('is true for In Progress when time is after In Progress date but before Ready to Deploy date', () => {
    const story = {
      'In Progress': '2020-01-02T12:00:00.000-0500',
      'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      'Ready for Test': '2020-01-04T12:00:00.000-0500',
      Testing: '2020-01-05T12:00:00.000-0500',
      'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        0,
        new Date('2020-01-02T18:00:00.000-0500')
      )
    ).toBe(true);
  });

  it('is true for In Progress when time is after In Progress date but before next date', () => {
    const story = {
      'In Progress': '2020-01-02T12:00:00.000-0500',
      // 'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      // 'Ready for Test': '2020-01-04T12:00:00.000-0500',
      // Testing: '2020-01-05T12:00:00.000-0500',
      // 'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        0,
        new Date('2020-01-02T18:00:00.000-0500')
      )
    ).toBe(true);
  });

  it('is false when the story has no dates', () => {
    const story = {};
    for (let i = 0; i < keys.length; i++) {
      expect(wasStoryInThisStateAtThisTime(story, keys, i, new Date())).toBe(
        false
      );
    }
  });

  it('is false for In Progress when there is no In Progress date', () => {
    const story = {
      // 'In Progress': '2020-01-02T12:00:00.000-0500',
      'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      'Ready for Test': '2020-01-04T12:00:00.000-0500',
      Testing: '2020-01-05T12:00:00.000-0500',
      'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        0,
        new Date('2020-01-01T12:00:00.000-0500')
      )
    ).toBe(false);
  });

  it('is true for Done when time is after Done date', () => {
    const story = {
      'In Progress': '2020-01-02T12:00:00.000-0500',
      'Ready to Deploy': '2020-01-03T12:00:00.000-0500',
      'Ready for Test': '2020-01-04T12:00:00.000-0500',
      Testing: '2020-01-05T12:00:00.000-0500',
      'Ready for Approval': '2020-01-06T12:00:00.000-0500',
      Done: '2020-01-07T12:00:00.000-0500',
    };

    expect(
      wasStoryInThisStateAtThisTime(
        story,
        keys,
        5,
        new Date('2020-01-08T12:00:00.000-0500')
      )
    ).toBe(true);
  });

  it('scenario 1', () => {
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        data.find((d) => d.key === 'TCP-7996').selectedChanges,
        keys,
        i,
        new Date('2020-02-19T15:17:01.480Z')
      );
      if (i === 0) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 2', () => {
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        data.find((d) => d.key === 'TCP-8050').selectedChanges,
        keys,
        i,
        new Date('2020-02-19T15:17:01.480Z')
      );
      expect(result).toBe(false);
    }
  });

  it('scenario 3', () => {
    const story = data.find((d) => d.key === 'TCP-7976');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-19T15:17:01.480Z')
      );

      if (i === 4) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 4', () => {
    const story = data.find((d) => d.key === 'TCP-7996');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-26T22:01:05.480Z')
      );

      if (i === 5) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 5', () => {
    const story = data.find((d) => d.key === 'TCP-7813');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-26T22:01:05.480Z')
      );

      if (i === 2) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 6', () => {
    const story = data.find((d) => d.key === 'TCP-7742');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-26T22:01:05.480Z')
      );

      if (i === 3) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 7', () => {
    const story = data.find((d) => d.key === 'TCP-7966');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-26T22:01:05.480Z')
      );

      if (i === 1) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 8', () => {
    const story = data.find((d) => d.key === 'TCP-7996');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-28T21:59:56.903Z')
      );

      if (i === 5) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });

  it('scenario 9', () => {
    const story = data.find((d) => d.key === 'TCP-8050');
    for (let i = 0; i < keys.length; i++) {
      const result = wasStoryInThisStateAtThisTime(
        story.selectedChanges,
        keys,
        i,
        new Date('2020-02-28T21:59:56.903Z')
      );

      if (i === 0) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    }
  });
});

describe('convertStoriesToStackData', () => {
  it('totals only grow', () => {
    const results = convertStoriesToStackData(
      data,
      keys,
      new Date('2020-02-17T19:00:49.855Z'),
      new Date('2020-02-29T22:00:00Z')
    );

    let lastTotal = 0;
    let index = 0;
    for (let result of results) {
      let localSum = 0;
      for (let key of keys) {
        localSum += result[key];
      }
      expect(localSum >= lastTotal).toBe(true);
      lastTotal = localSum;
      index++;
    }
  });

  it('totals max at number of stories', () => {
    const results = convertStoriesToStackData(
      data,
      keys,
      new Date('2020-02-17T19:00:49.855Z'),
      new Date('2020-02-29T22:00:00Z')
    );

    for (let result of results) {
      let localSum = 0;
      for (let key of keys) {
        localSum += result[key];
      }
      expect(localSum <= data.length).toBe(true);
    }
  });
});
