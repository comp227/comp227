import './LanguageSwitcher.scss';

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'gatsby';
import getTranslationPath from '../../utils/getTranslationPath';

const Language = ({ language, active }) => {
  return language === active ? (
    <span className="language-switcher__active-language">{language}</span>
  ) : (
    <div className="language-switcher__language">
      <Link to={getTranslationPath(language, '/')}>{language}</Link>
    </div>
  );
};

const LanguageSwitcher = ({ lang }) => {
  return (
    <div className="language-switcher">
      <Language language="en" active={lang} />
    </div>
  );
};

LanguageSwitcher.defaultProps = {
  lang: 'en',
};

LanguageSwitcher.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default LanguageSwitcher;
