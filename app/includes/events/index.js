import Events from '../../core/events/index';

const AUDIO_PLAYER_UPDATE = Events.create('AUDIO_PLAYER_UPDATE',
    (...args) => {});
const AUDIO_PLAYER_PAUSE = Events.create('AUDIO_PLAYER_PAUSE', (...args) => {});
const AUDIO_PLAYER_PROGRESS = Events.create('AUDIO_PLAYER_PROGRESS',
    (...args) => { });

const ap = getAudioPlayer();

ap.on(null, AudioPlayer.EVENT_UPDATE, AUDIO_PLAYER_UPDATE.dispatch);
ap.on(null, AudioPlayer.EVENT_PAUSE, AUDIO_PLAYER_PAUSE.dispatch);
ap.on(null, AudioPlayer.EVENT_PROGRESS, AUDIO_PLAYER_PROGRESS.dispatch);

Events.push(
    AUDIO_PLAYER_UPDATE,
    AUDIO_PLAYER_PAUSE,
    AUDIO_PLAYER_PROGRESS,
);

