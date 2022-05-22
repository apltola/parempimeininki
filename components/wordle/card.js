import styles from '../../styles/Wordle.module.css';

function Card({ frontText, backText, flip, i, color }) {
  return (
    <div className={styles.card} flip={flip.toString()}>
      <div className={styles.cardInner} i={i}>
        <div className={styles.cardFront}>{frontText}</div>
        <div className={styles.cardBack} color={color}>
          {backText}
        </div>
      </div>
    </div>
  );
}

export default Card;
