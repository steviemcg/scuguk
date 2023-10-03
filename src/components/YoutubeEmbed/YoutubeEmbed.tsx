import React from 'react';
import styles from './YoutubeEmbed.module.scss';

type YoutubeEmbedProps = {
  videoId: string;
};

const YoutubeEmbed = ({ videoId }: YoutubeEmbedProps) => (
  <div className={styles.youtubeEmbed}>
    <iframe
      width='853'
      height='480'
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      title='Embedded youtube'
    />
  </div>
);

export default YoutubeEmbed;
