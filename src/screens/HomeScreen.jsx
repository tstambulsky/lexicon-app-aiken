import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { Icon, Input, Text } from 'react-native-elements';
import { Grid } from '@ant-design/react-native';
import theme from '../theme';
import PlayerContext from '../PlayerContext';
import api from '../api';
import { Coincidence } from '../constants';

const styles = StyleSheet.create({
  arrowContainer: {
    backgroundColor: theme.header,
    height: 50,
    width: 50,
  },
  boldFont: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    color: theme.dark,
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    maxHeight: 50,
  },
  inputText: {
    borderColor: theme.gray_light,
    borderWidth: 1,
  },
  knownBox: {
    backgroundColor: theme.blue_known,
    borderWidth: 1,
    margin: 3,
    textAlign: 'center',
  },
  playerStyle: {
    margin: 3,
    textAlign: 'center',
  },
  rightBox: {
    backgroundColor: theme.green_right,
    borderWidth: 1,
    margin: 3,
    textAlign: 'center',
  },
  wordBad: {
    color: theme.rojo_error,
    padding: 10,
  },
  wordOk: {
    color: theme.ok_word,
    padding: 10,
  },
  wordPartial: {
    color: theme.orange,
    padding: 10,
  },
  wrongBox: {
    backgroundColor: theme.red_wrong,
    borderWidth: 1,
    margin: 3,
    textAlign: 'center',
  },
});

const headers = [
  { text: '' },
  { text: 'Known' },
  { text: 'Right' },
  { text: 'Wrong' },
];

const HomeScreen = () => {
  const [greekInput, setGreekInput] = useState('');
  const [player] = useContext(PlayerContext);
  const [player1scores, setPlayer1scores] = useState([]);
  const [player2scores, setPlayer2scores] = useState([]);
  const [player1knownWords, setPlayer1knownWords] = useState([]);
  const [player2knownWords, setPlayer2knownWords] = useState([]);
  const [olderWordToGuess, setOlderWordToGuess] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments2, setShowComments2] = useState(false);
  const [wordStatusStyle, setWordStatusStyle] = useState({});
  const data = [
    ...headers,
    { text: 'P1', style: styles.playerStyle },
    ...player1knownWords,
    ...player1scores,
    { text: 'P2', style: styles.playerStyle },
    ...player2knownWords,
    ...player2scores,
  ];

  const clearForm = () => {
    setGreekInput('');
    setIsInputDisabled(false);
    setShowComments2(false);
    setWordStatusStyle({});
  };

  const processWords = (res) => {
    const player1 = res?.data?.find((v) => v.player === '1');
    const player2 = res?.data?.find((v) => v.player === '2');
    setPlayer1knownWords([{ text: player1.learned, style: styles.knownBox }]);
    setPlayer2knownWords([{ text: player2.learned, style: styles.knownBox }]);
  };

  const processScore = (res) => {
    if (res?.data?.player === '1') {
      setPlayer1scores([
        { text: res?.data?.right, style: styles.rightBox },
        { text: res?.data?.wrong, style: styles.wrongBox },
      ]);
    } else if (res?.data?.player === '2') {
      setPlayer2scores([
        { text: res?.data?.right, style: styles.rightBox },
        { text: res?.data?.wrong, style: styles.wrongBox },
      ]);
    }
  };

  const fetchOlderWordByPlayer = (plyer) => {
    api
      .fetchOlderWordByPlayer(plyer)
      .then((res) => setOlderWordToGuess(res.data))
      .catch((err) => console.log(err));
  };

  const updateStyleWordStatus = (coincidence, setStyle) => {
    switch (coincidence) {
      case Coincidence.COMPLETE:
        setIsInputDisabled(true);
        setStyle(styles.wordOk);
        break;
      case Coincidence.PARTIAL:
        setIsInputDisabled(true);
        setStyle(styles.wordPartial);
        break;
      case Coincidence.NONE:
        setStyle(styles.wordBad);
        break;
      default:
        console.log('Error');
        break;
    }
  };

  const fetchKnownWordsFromPlayers = () => {
    api
      .fetchKnownWordsFromPlayers()
      .then(processWords)
      .catch((err) => console.log(err));
  };

  const fetchScoresFromPlayers = () => {
    api
      .fetchScoresByPlayer('1')
      .then(processScore, '1')
      .catch((err) => console.log(err));
    api
      .fetchScoresByPlayer('2')
      .then(processScore, '2')
      .catch((err) => console.log(err));
  };
  const testGreekWord = (enteredWord, greekWord) => {
    setIsLoading(true);

    api
      .testGreekWord({ enteredWord, greekWord, player })
      .then((res) => {
        setIsLoading(false);
        updateStyleWordStatus(res.data, setWordStatusStyle);
        fetchScoresFromPlayers();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleChangeText = (text) => {
    setGreekInput(text);
  };

  const handleTestText = () => {
    setShowComments2(true);
    testGreekWord(greekInput, olderWordToGuess?.greek);
  };

  const handleSendText = () => {
    clearForm();
    fetchOlderWordByPlayer(player);
    fetchKnownWordsFromPlayers();
  };

  useEffect(() => {
    fetchScoresFromPlayers();
    fetchKnownWordsFromPlayers();
  }, []);

  useEffect(() => {
    fetchOlderWordByPlayer(player);
  }, [player]);

  const renderItem = (item) => {
    if (item?.style) {
      return <Text style={item.style}>{item.text}</Text>;
    }
    return <Text style={{ textAlign: 'center' }}>{item.text}</Text>;
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      {player1scores?.length > 0 && player2scores?.length > 0 ? (
        <>
          <Text h4 style={{ textAlign: 'center', color: theme.header }}>
            {olderWordToGuess?.spanish ?? ''}
          </Text>
          <Text style={{ padding: 0 }}>
            {olderWordToGuess?.comments1 ?? ''}
          </Text>
          <View style={styles.formContainer}>
            <View style={{ width: '90%', height: 50 }}>
              <Input
                value={greekInput}
                onEndEditing={handleTestText}
                disabled={isInputDisabled}
                autoCorrect={false}
                spellCheck={false}
                autoCompleteType="off"
                autoCapitalize="none"
                inputContainerStyle={{ borderBottomWidth: 0, height: 50 }}
                onChangeText={handleChangeText}
                style={{ ...styles.inputText, ...styles.boldFont }}
              />
            </View>
            <View style={styles.arrowContainer}>
              <Icon
                disabled={
                  !showComments2 || greekInput?.length === 0 || isLoading
                }
                name="arrow-right-alt"
                size={50}
                color="white"
                touchSoundDisabled={greekInput?.length === 0 || isLoading}
                disabledStyle={{ backgroundColor: theme.dark }}
                onPress={handleSendText}
              />
            </View>
          </View>
          <View>
            <Text
              style={{ padding: 5, ...styles.boldFont, ...wordStatusStyle }}>
              {showComments2 && olderWordToGuess?.greek}
            </Text>
            <Text style={{ padding: 5 }}>
              {showComments2 ? olderWordToGuess?.comments2 ?? '' : ''}
            </Text>
          </View>

          <Grid
            data={data}
            columnNum={4}
            renderItem={renderItem}
            hasLine={false}
            itemStyle={{ height: 27, margin: 8, padding: 5 }}
          />
        </>
      ) : (
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            height: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator color={theme.blue_known} size="large" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
