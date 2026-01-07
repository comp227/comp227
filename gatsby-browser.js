import { anchorate } from 'anchorate';

export { default as wrapPageElement } from './wrapPageElement';
export { default as wrapRootElement } from './wrapRootElement';

require('prismjs/themes/prism-tomorrow.css');

export const onRouteUpdate = () => {
  anchorate({
    scroller: function (element) {
      if (!element) return false;
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    },
  });
};
