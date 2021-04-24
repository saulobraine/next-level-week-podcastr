import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import { usePlayer } from '../../contexts/PlayerContext';


import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { useKey } from '../../hooks/useKey';

function Player() {

  const audioEpisodeRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    setIsPlaying,
    isLooping,
    setIsLooping,
    isShuffling,
    setIsShuffling,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  } = usePlayer();

  const [progress, setProgress] = useState(0);

  const episode = episodeList[currentEpisodeIndex];

  function setupProgressListener() {
    audioEpisodeRef.current.currentTime = 0;

    audioEpisodeRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioEpisodeRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioEpisodeRef.current.currentTime = amount;
    setProgress(amount);
  }
  useEffect(() => {
    if (!audioEpisodeRef.current) {
      return;
    }

    if (isPlaying) {
      audioEpisodeRef.current.play();

    } else {
      audioEpisodeRef.current.pause();
    }

  }, [isPlaying]);


  useKey("Space", () => {

    (document.activeElement as HTMLElement)?.blur();

    if (!audioEpisodeRef.current) {
      return;
    }

    setIsPlaying(!isPlaying);
  });

  return (
    <>
      <div className={styles.playerContainer}>
        <header>
          <img src="/playing.svg" alt="Tocando agora" />
          <strong>Tocando agora</strong>
        </header>

        {episode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
              alt={episode.title}
            />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}
        <footer className={!episode ? styles.empty : ''}>
          <div className={styles.progress}>
            <span>{convertDurationToTimeString(progress)}</span>
            <div className={styles.slider}>
              {episode ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{
                    backgroundColor: `var(--green-500)`
                  }}
                  railStyle={{
                    backgroundColor: `var(--purple-300)`
                  }}
                  handleStyle={{
                    borderColor: `var(--green-500)`,
                    borderWidth: 4,
                  }}
                />
              ) : (
                <div className={styles.emptySlider} />
              )}
            </div>
            <span>{episode ? episode.durationAsString : '00:00:00'}</span>
          </div>

          {episode && (
            <audio
              ref={audioEpisodeRef}
              src={episode.url}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              loop={isLooping}
              onLoadedMetadata={setupProgressListener}
              onEnded={playNext}
              autoPlay
            />
          )}

          <div className={styles.buttons}>
            <button type="button"
              disabled={!episode || episodeList.length === 1}
              onClick={() => setIsShuffling(!isShuffling)}
              className={isShuffling ? styles.isActive : ''}
            >
              <img src="/shuffle.svg" alt="Embaralhar" />
            </button>
            <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
              <img src="/play-previous.svg" alt="Tocar anterior" />
            </button>
            <button type="button" className={styles.playButton} disabled={!episode} onClick={() => setIsPlaying(!isPlaying)} >

              {isPlaying ? (
                <img src="/pause.svg" alt="Pausar" />
              ) : (
                <img src="/play.svg" alt="Tocar" />
              )}
            </button>
            <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
              <img src="/play-next.svg" alt="Tocar próxima" />
            </button>
            <button type="button"
              disabled={!episode}
              onClick={() => setIsLooping(!isLooping)}
              className={isLooping ? styles.isActive : ''}
            >
              <img src="/repeat.svg" alt="Repetir" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Player;
