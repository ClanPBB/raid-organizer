import {translations as hu} from './hu'

let translations

switch (process.env.locale) {
  case 'hu':
  default:
    translations = hu
}

export {translations}
