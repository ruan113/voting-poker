import { Component, Input } from '@angular/core';
import { BoardState, getBoardInitialState } from 'src/_shared/types/events';

@Component({
  selector: 'app-voting-result',
  templateUrl: './voting-result.component.html',
  styleUrls: ['./voting-result.component.scss'],
})
export class VotingResultComponent {
  @Input() board: BoardState = getBoardInitialState();

  result: {
    cards: { value: number; chosenCount: number }[];
    avg: number;
  } = {
    avg: 0,
    cards: [],
  };

  ngOnInit() {
    this.result = this.getProcessedResults();
  }

  getProcessedResults(): {
    cards: { value: number; chosenCount: number }[];
    avg: number;
  } {
    const votingCountMap = this.board.users
      .filter((it) => Boolean(it.choice))
      .reduce((acc, it) => {
        if (!acc[it.choice!]) {
          acc[it.choice!] = 0;
        }
        acc[it.choice!] += 1;
        return acc;
      }, {});

    const avgParams = Object.keys(votingCountMap).reduce(
      (acc, key) => {
        acc.sum = Number(key) * votingCountMap[key];
        acc.total += votingCountMap[key];
        return acc;
      },
      { total: 0, sum: 0 },
    );
    const avg = avgParams.total ? avgParams.sum / avgParams.total : 0;
    return {
      avg,
      cards: Object.keys(votingCountMap).map(
        (key): { value: number; chosenCount: number } => ({
          chosenCount: votingCountMap[key],
          value: Number(key),
        }),
      ),
    };
  }
}
