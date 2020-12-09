import axios from 'axios';
import styles from '../styles/SnakeScores.module.css';

export default function SnakeScoreboard({ scores }) {
  if (!scores || scores.length === 0) {
    return <div></div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Scoreboard</h3>
      <table style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
          {scores.map(({ _id, player, points }) => {
            return (
              <tr key={_id}>
                <td>{player}</td>
                <td>{points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* scores.map(({ _id, player, points }) => {
          return (
            <li key={_id}>
              <span>{player}</span>
              <span>{points}</span>
            </li>
          );
          
        }) */}
    </div>
  );
}
