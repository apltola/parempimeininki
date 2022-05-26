import SimpleKeyboard from 'react-simple-keyboard';

const ALPHABET = [
  'a',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
  'b',
];

const ALPHABET2 = 'abcdefghijklmnopqrsteuvwxyzåäö';
const ROW1 = 'qwertyuiopå';
const ROW2 = 'asdfghjklöä';
const ROW3 = 'zxcvbnm';

function Keyboard() {
  <SimpleKeyboard
    mergeDisplay={true}
    layoutName="default"
    layout={{
      default: [
        'q w e r t y u i o p å',
        'a s d f g h j k l ö ä',
        '{ent} z x c v b n m {backspace}',
      ],
    }}
    display={{
      '{ent}': 'enter',
      '{backspace}': '⌫',
    }}
  />;
}

export default Keyboard;
