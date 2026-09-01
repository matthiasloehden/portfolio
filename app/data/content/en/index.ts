import * as academic from './academic';
import * as home from './home';
import * as personal from './personal';
import * as work from './work';

const englishContent = {
  academic,
  home,
  personal,
  work,
};

export type EnglishContent = typeof englishContent;

export default englishContent;
