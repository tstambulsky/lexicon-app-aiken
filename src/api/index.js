import api from './axios';
import { API } from '../constants';

const fetchKnownWordsFromPlayers = () => api.get(API.knownWords);

const fetchOlderWordByPlayer = (player) =>
  api.get(API.olderWordsByPlayer.concat(player));

const testGreekWord = (data) => api.patch(API.words, data);

const fetchScoresByPlayer = (player) =>
  api.get(API.scores.concat(`?player=${player}`));

export default {
  fetchScoresByPlayer,
  testGreekWord,
  fetchKnownWordsFromPlayers,
  fetchOlderWordByPlayer,
};
