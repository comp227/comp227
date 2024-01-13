import './ContentTemplate.scss';

import React, { useEffect, Component } from 'react';

import { graphql } from 'gatsby';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import snakeCase from 'lodash/fp/snakeCase';
import path from 'path';
import colors from '../colors';
import Arrow from '../components/Arrow/Arrow';
import { Banner } from '../components/Banner/Banner';
import EditLink from '../components/EditLink/EditLink';
import Element from '../components/Element/Element';
import PrevNext from '../components/PrevNext/PrevNext';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import { SubHeader } from '../components/SubHeader/SubHeader';
import Layout from '../components/layout';
import SEO from '../components/seo';
import navigation from '../content/partnavigation/partnavigation';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';
import ArrowToTop from '../images/up-arrow.svg';
import getPartTranslationPath from '../utils/getPartTranslationPath';
import { createCopyButton } from './copy-code-button/create-copy-buttons';
import { partColors } from './partColors';

export default class ContentTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            h1Title: '',
            otherTitles: '',
            showArrowUp: false,
            isDark: false,
        };
    }

    componentDidMount() {
        this.renderPartsForPage();
    }

    renderPartsForPage() {

        const h1 = document.querySelector('h1');
        const h3 = document.querySelectorAll('h3');
        const h3Arr = Array.from(h3).map(t => t.innerText);

        this.updateAllLinks(this.props);

        this.setState({
            h1Title: h1.innerText,
            otherTitles: [...h3Arr],
            isDark: document.documentElement.dataset.theme === 'dark',
        });

        window.addEventListener('scroll', this.handleScroll);
        createCopyButton();
    }

    updateAllLinks(props) {
        const links = Array.from(
            document.querySelectorAll('a:not(.skip-to-content):not(.panel a)')
        );
        // updateLinks(this.props, links);
        const { frontmatter } = props.data.markdownRemark;

        links.map(i => {
            // going to fix some of the link colors here to be bolder for the white ones in the light theming
            var theme = document.documentElement.dataset.theme;
            var partColorName = partColors[frontmatter.part];
            var partColor = colors[partColorName + (theme === 'light' ? '' : '-dark')];
            var alternativePartColor = colors[partColorName + (theme === 'light' ? '-alt' : '')];
            var textColor = (i.parentNode.tagName === "STRONG") ? alternativePartColor : origColor;
            i.style = `border-color: ${alternativePartColor}`;
            var origColor = i.style.color;

            i.style.color = textColor;
            !i.classList.contains('language-switcher__language') &&
                (i.target = '_blank');

            function over() {
                i.style.color = (i.parentNode.tagName !== "STRONG") && theme !== 'light' ? '#ffffff' : origColor;
                i.style.backgroundColor = partColor;
            }
            function out() {
                i.style.backgroundColor = 'transparent';
                i.style.color = textColor;
            }

            i.onmouseover = over;
            i.onmouseleave = out;

            return null;
        });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY > 300 && !this.state.showArrowUp) {
            this.setState({
                showArrowUp: true,
                isDark: document.documentElement.dataset.theme === 'dark',
            });
        } else if (window.scrollY <= 300 && this.state.showArrowUp) {
            this.setState({
                showArrowUp: false,
                isDark: document.documentElement.dataset.theme === 'dark'
            });
        }
    };

    render() {
        const { markdownRemark } = this.props.data;
        const { frontmatter, html } = markdownRemark;
        const { mainImage, letter, part, lang } = frontmatter;
        const switchingColorCode = colors[partColors[part] + (this.state.isDark ? '-dark' : '-light')]
        const boldColorCode = colors[partColors[part] + (this.state.isDark ? '' : '-bold')]
        const colorCode = colors[partColors[part]];

        this.updateAllLinks(this.props);

        const parserOptions = {
            replace: props => {
                const { type, name, attribs, children } = props;
                if (type === 'tag' && name === 'picture') {
                    const alt = children[0].attribs.alt
                        ? children[0].attribs.alt
                        : 'comp227 content';
                    return (
                        <picture>
                            <img
                                style={{ borderColor: colorCode }}
                                alt={alt}
                                src={children[0].attribs.src}
                            />
                        </picture>
                    );
                } else if (type === 'tag' && name === 'pre') {
                    return <pre>{domToReact(children, parserOptions)}</pre>;
                } else if (type === 'tag' && attribs.class === 'content') {
                    return (
                        <Element className="course-content">
                            <Element className="course-content-inner">
                                {domToReact(children, parserOptions)}
                            </Element>
                        </Element>
                    );
                } else if (type === 'tag' && attribs.class === 'tasks') {
                    return (
                        <Banner
                            style={{
                                backgroundColor: switchingColorCode,
                                borderColor: colorCode,
                            }}
                            className="spacing tasks content-banner"
                        >
                            <Element
                                className="course-content"
                                style={{
                                    borderColor: colorCode,
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <Element className="course-content-inner">
                                    {children.name === 'pre' ? (
                                        <pre>{domToReact(children, parserOptions)}</pre>
                                    ) : (
                                        domToReact(children, parserOptions)
                                    )}
                                </Element>
                            </Element>
                        </Banner>
                    );
                } else if (type === 'tag' && name === 'strong') {
                    return (
                        <strong
                            style={{
                                color: boldColorCode
                            }}
                        >
                            {domToReact(children, parserOptions)}
                        </strong>
                    )
                }
                return;
            },
        };

        return (
            <Layout isCoursePage={true}>
                <SEO
                    lang={lang}
                    title={`COMP227 ${'part'}${part} | ${this.state.h1Title}`}
                    description={mainSEOdescription[lang]}
                    keywords={[
                        ...mainSEOtags,
                        this.state.h1Title,
                        ...this.state.otherTitles,
                    ]}
                />

                {/* eslint-disable */}
                {this.state.showArrowUp && (
                    <div
                        className="arrow-go-up"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: 'smooth',
                            })
                        }
                    >
                        <img src={ArrowToTop} alt="arrow-up" />
                    </div>
                )}
                {/* eslint-enable */}

                <div className="course-container spacing--after">
                    <Banner
                        className="part-main__banner spacing--mobile--small"
                        backgroundColor={colorCode}
                        style={{
                            backgroundImage: `url(${path.resolve(mainImage.publicURL)})`,
                            backgroundColor: colorCode,
                        }}
                    >
                        <div className="container spacing--after">
                            <Arrow
                                className="breadcrumb"
                                content={[
                                    {
                                        backgroundColor: colorCode,
                                        text: 'COMP227',
                                        link: `/${lang === 'en' ? '' : `${lang}/`}#course-contents`,
                                    },
                                    {
                                        backgroundColor: colorCode,
                                        text: `${'Part'} ${part}`,
                                        link: getPartTranslationPath(lang, part),
                                    },
                                    {
                                        backgroundColor: colors['black'],
                                        text: navigation[lang][part][letter],
                                    },
                                ]}
                            />
                        </div>
                    </Banner>

                    <Element className="course" id="course-main-content">
                        <ScrollNavigation
                            part={part}
                            letter={letter}
                            lang={lang}
                            currentPartTitle={navigation[lang][part][letter]}
                            currentPath={getPartTranslationPath(
                                lang,
                                part,
                                `/${snakeCase(navigation[lang][part][letter])}`
                            )}
                            colorCode={colorCode}
                        />

                        <Element className="course-content-container">
                            <Element className="course-content" autoBottomMargin>
                                <Element className="course-content-inner">
                                    <p
                                        className="col-1 letter"
                                        style={{ borderColor: colorCode }}
                                    >
                                        {letter}
                                    </p>

                                    <SubHeader
                                        headingLevel="h1"
                                        text={navigation[lang][part][letter]}
                                    />
                                </Element>
                            </Element>

                            {Parser(html, parserOptions)}
                        </Element>
                    </Element>

                    <EditLink part={part} letter={letter} lang={lang} />

                    <PrevNext part={part} letter={letter} lang={lang} />
                </div>
            </Layout>
        );
    }
}

export const contentPageQuery = graphql`
  query($part: Int!, $letter: String!, $lang: String!) {
    markdownRemark(
      frontmatter: {
        part: { eq: $part }
        letter: { eq: $letter }
        lang: { eq: $lang }
      }
    ) {
      html
      frontmatter {
        mainImage {
          publicURL
        }
        part
        letter
        lang
      }
    }
  }
`;
