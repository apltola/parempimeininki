import { useState } from 'react';
import DotLoader from 'react-spinners/PulseLoader';
import axios from 'axios';
import { textInput, btn } from '../../styles/Snake.module.css';

export default function AddNewScore({ score, callBack }) {
  const [name, setName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (scoreSubmitted) {
      return;
    }

    try {
      await axios.post('/api/snake/scores', {
        player: name,
        points: score,
      });
      const topTen = (await axios.get('/api/snake/scores/topten')).data;
      setName('');
      setLoading(false);
      callBack(topTen);
      setScoreSubmitted(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function submitIsDisabled() {
    return !name || scoreSubmitted || name.length > 20;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Congrats, your score is in the top 10!</p>
      <p>Please add a name for the scoreboard:</p>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="player name"
        className={textInput}
        disabled={scoreSubmitted}
      />
      <button
        type="submit"
        className={btn}
        disabled={submitIsDisabled()}
        style={{
          cursor: submitIsDisabled() ? 'not-allowed' : 'pointer',
        }}
      >
        Save
      </button>
      {name.length > 20 && <p>Player name too long!</p>}
      {loading && (
        <div style={{ paddingTop: '20px' }}>
          <DotLoader loading={loading} size={10} color="white" margin={5} />
        </div>
      )}
    </form>
  );
}
