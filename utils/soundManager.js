const SoundManager = {
    game: null,
    registry: null,
    currentMusicInstance: null,
    jukeboxPlaylist: [
        "jukebox1", 
        "jukebox2", 
        "jukebox3", 
        "jukebox4", 
        "jukebox5"
    ],
    currentTrackIndex: 0,

    init: function(phaserGameInstance) {
        if (!phaserGameInstance || !phaserGameInstance.registry) {
            console.error("SoundManager.init falhou: Instância de jogo ou registro inválido.");
            return;
        }

        this.game = phaserGameInstance;
        this.registry = phaserGameInstance.registry;

        if (this.registry.get('isMusicMuted') === undefined) {
            this.registry.set('isMusicMuted', false);
        }

        if (this.registry.get('isSfxMuted') === undefined) {
            this.registry.set('isSfxMuted', false);
        }
    },

    playSfx: function(sfxKey, config = {}) {
        if (!this.game || !this.registry) {
            console.error('SoundManager não inicializado');
            return;
        }

        if (!this.registry.get('isSfxMuted')) {
            this.game.sound.play(sfxKey, config);
        }
    },

    toggleSfxMute: function() {
        const currentMuteState = this.registry.get('isSfxMuted');
        const newMuteState = !currentMuteState;
        this.registry.set('isSfxMuted', newMuteState);
        return newMuteState;
    },

    isSfxMuted: function() {
        if (!this.registry) return true;
        return this.registry.get('isSfxMuted');
    },

    playMusic: function(musicKey, config = {}) {
        if (!this.game || !this.registry) {
            console.error('SoundManager não inicializado');
            return;
        }

        if (this.currentMusicInstance && this.currentMusicInstance.key !== musicKey && this.currentMusicInstance.isPlaying) {
            this.currentMusicInstance.stop();
            this.currentMusicInstance = null;
        }

        if (this.currentMusicInstance && this.currentMusicInstance.key === musicKey && this.currentMusicInstance.isPlaying) {
            return this.currentMusicInstance;
        }
        
        if (this.currentMusicInstance && this.currentMusicInstance.key === musicKey && this.currentMusicInstance.isPaused && !this.registry.get('isMusicMuted')) {
            this.currentMusicInstance.resume();
            return this.currentMusicInstance;
        }

        const newMusic = this.game.sound.add(musicKey, config);
        this.currentMusicInstance = newMusic;

        if (!this.registry.get('isMusicMuted')) {
            newMusic.play();
        }

        return newMusic;
    },

    pauseMusic: function() {
        if (this.currentMusicInstance && this.currentMusicInstance.isPlaying) {
            this.currentMusicInstance.pause();
        }
    },

    resumeMusic: function() {
        if (this.currentMusicInstance && this.currentMusicInstance.isPaused) {
            if (!this.registry.get('isMusicMuted')) {
                this.currentMusicInstance.resume();
            }
        }
    },

    stopMusic: function() {
        if (this.currentMusicInstance) {
            this.currentMusicInstance.stop();
            this.currentMusicInstance = null;
        }
    },

    toggleMusicMute: function() {
        if (!this.registry) return false;

        const currentMuteState = this.registry.get('isMusicMuted');
        const newMuteState = !currentMuteState;
        this.registry.set('isMusicMuted', newMuteState);

        if (this.currentMusicInstance) {
            if (newMuteState) {
                if (this.currentMusicInstance.isPlaying) {
                    this.currentMusicInstance.pause();
                }
            } else {
                if (this.currentMusicInstance.isPaused) {
                    this.currentMusicInstance.resume();
                }
            }
        }

        return newMuteState;
    },

    isMusicMuted: function() {
        if (!this.registry) return true;
        return this.registry.get('isMusicMuted');
    },

    runPlaylist: function() {
        if (!this.game) {
            console.error('SoundManager não inicializado');
            return;
        }
        
        this.jukeboxPlaylist = Phaser.Utils.Array.Shuffle(this.jukeboxPlaylist);
        this.currentTrackIndex = 0;

        const playNextTrack = () => {
            const musicKey = this.jukeboxPlaylist[this.currentTrackIndex];
            
            this.currentMusicInstance = this.playMusic(musicKey, { volume: 0.3, loop: false });

            if (this.currentMusicInstance) {
                 this.currentMusicInstance.once("complete", () => {
                    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.jukeboxPlaylist.length;
                    playNextTrack();
                });
            }
        };

        playNextTrack();
    }
}