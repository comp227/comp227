import translationProgress from '../../utils/translationProgress';
import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';
import React from 'react';
import navigation from '../../content/partnavigation/partnavigation';
import getPartTranslationPath from '../../utils/getPartTranslationPath';

const partNameTranslations = {
  en: [
    'Fundamentals of Web apps',
    'Introduction to React',
    'Communicating with a server',
    'Programming a server with NodeJS and Express',
    'Testing Express servers, user administration',
    'Testing React apps',
    'Advanced state management',
    'React router, custom hooks, styling app with CSS and webpack',
    'TypeScript',
    'React Native',
  ]
};

const partName = {
  en: 'Part',
};

export const PartBanner = ({ lang }) => {
  // TODO change on release
  const parts = Object.keys(navigation[lang]);

  return (
    <Banner
      className="spacing spacing--after-small spacing--after-mobile offset"
      id="course-contents"
    >
      <div className="container spacing flex-fix-aligning col-7--mobile">
        {parts.map((part) => {
          const partNames =
            partNameTranslations[lang] || partNameTranslations.en;

          const summary =
            translationProgress[lang] < part
              ? partNames[part] + ' (english only)'
              : partNames[part];
          return (
            <ContentLiftup
              key={partNames[part]}
              className="col-3 col-10--mobile col-4--tablet"
              image={{
                src: require(`../../images/thumbnails/part-${part}.svg`),
                alt: partNames[part],
              }}
              hoverImageSrc={require(`../../images/thumbnails/part-${part}_ovr.svg`)}
              name={`${'Part'} ${part}`}
              summary={partNames[part]}
              path={getPartTranslationPath(lang, part)}
            />
          );
        })}
      </div>
    </Banner>
  );
};
