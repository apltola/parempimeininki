import axios from 'axios';
import styles from '../styles/SnakeScores.module.css';

export default function SnakeScoreboard({ scores }) {
  if (!scores || scores.length === 0) {
    return <div></div>;
  }

  return (
    <div className={styles.container}>
      <table style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <th></th>
            <th className={styles.playerCol}>Player</th>
            <th>Score</th>
          </tr>
          {scores.map(({ _id, player, points }, idx) => {
            return (
              <tr key={_id}>
                <td>{idx + 1}</td>
                <td className={styles.playerCol}>{player}</td>
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
