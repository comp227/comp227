import React from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from '../Accordion/Accordion';
import Element from '../Element/Element';
import Layout from '../layout';
import SEO from '../seo';
import { SubHeader } from '../SubHeader/SubHeader';
import content from '../../content/pages/faq.json';
import mainSEOtags from '../../content/seo/mainSEOtags';

const FaqPage = ({ lang, title, seoDescription }) => {
  const { t } = useTranslation();
  const langContent = content[lang] || content.en;

  return (
    <Layout>
      <SEO
        lang={lang}
        title={title}
        description={seoDescription}
        keywords={[
          ...mainSEOtags,
          'faq',
          'frequently asked questions',
        ]}
      />

      <Element className="container link spacing spacing--after">
        <SubHeader
          className="spacing--after-small"
          headingLevel="h1"
          text={t('faqPage:faqTitle')}
        />
        {langContent.map(item => {
          return (
            <Accordion
              track
              key={item.title}
              title={item.title}
              content={item.text}
            />
          );
        })}
      </Element>
    </Layout>
  );
};

export default FaqPage;
