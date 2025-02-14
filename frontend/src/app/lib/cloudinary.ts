import { ImageLoader } from 'next/image';

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 80}&fit=fill`;
};

export default cloudinaryLoader;
