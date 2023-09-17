export type BoardUser = { peerId: string; name: string; choice?: string };

export type VotingSystemOption = { name: string; key: string; cards: string[] };

export const votingSystemValues: VotingSystemOption[] = [
  {
    name: 'Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕ )',
    key: 'fibonacci',
    cards: [
      '0',
      '1',
      '2',
      '3',
      '5',
      '8',
      '13',
      '21',
      '34',
      '55',
      '89',
      '?',
      '☕',
    ],
  },
];
