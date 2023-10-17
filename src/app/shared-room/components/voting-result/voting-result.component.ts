import { Component, Input } from '@angular/core';
import { BoardState } from 'src/_shared/types/board-game-types';
import { getBoardInitialState } from 'src/_shared/types/events';

type CardrStatistics = { value: unknown; chosenCount: number };

@Component({
  selector: 'app-voting-result',
  templateUrl: './voting-result.component.html',
  styleUrls: ['./voting-result.component.scss'],
})
export class VotingResultComponent {
  @Input() board: BoardState = getBoardInitialState();

  result: {
    cards: CardrStatistics[];
    avg: number;
  } = {
    avg: 0,
    cards: [],
  };

  ngOnInit() {
    this.result = this.getProcessedResults();
  }

  getProcessedResults(): {
    cards: CardrStatistics[];
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

    const avgParams = Object.keys(votingCountMap)
      .filter((key) => !isNaN(Number(key)))
      .reduce(
        (acc, key) => {
          acc.sum += Number(key) * votingCountMap[key];
          acc.total += votingCountMap[key];
          return acc;
        },
        { total: 0, sum: 0 },
      );
    const avg = avgParams.total ? avgParams.sum / avgParams.total : 0;
    return {
      avg,
      cards: Object.keys(votingCountMap).map(
        (key): CardrStatistics => ({
          chosenCount: votingCountMap[key],
          value: key,
        }),
      ),
    };
  }
}
