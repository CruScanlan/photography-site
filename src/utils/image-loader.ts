'use client'

const contentfulLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 95}`;
};

export default contentfulLoader;