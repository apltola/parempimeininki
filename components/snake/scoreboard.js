import styles from '../../styles/SnakeScores.module.css';
import { GeistMono } from 'geist/font/mono';

export default function SnakeScoreboard({ scores }) {
  if (typeof scores === 'undefined') {
    return <div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={GeistMono.className}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th className={styles.playerCol}>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(({ id, player, points }, idx) => {
              return (
                <tr key={id}>
                  <td className={styles.positionCol}>{idx + 1}</td>
                  <td className={styles.playerCol}>{player}</td>
                  <td>{points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
