import Config from 'react-native-config';

const URL = Config.API_URL.concat('/api');

export const API = Object.freeze({
  words: `${URL}/words`,
  knownWords: `${URL}/words/known`,
  olderWordsByPlayer: `${URL}/words/?player=`,
  scores: `${URL}/scores/`,
});

export const Coincidence = {
  COMPLETE: 'COMPLETE',
  PARTIAL: 'PARTIAL',
  NONE: 'NONE',
};
