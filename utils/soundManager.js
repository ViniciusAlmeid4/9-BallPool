const SoundManager = {
    game: null,
    registry: null,
    currentMusicInstance: null,

    init: function(phaserGameInstance) {
        this.game = phaserGameInstance;
        this.registry = phaserGameInstance.registry;

        if (this.registry.get('isMusicMuted') === undefined) {
            this.registry.set('isMusicMuted', false);
        }

        if (this.registry.get('isSfxMuted') === undefined) {
            this.registry.set('isSfxMuted', false);
        }
    },

    // Sound Effects
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
        // if (!this.registry) return;
        
        const currentMuteState = this.registry.get('isSfxMuted');
        const newMuteState = !currentMuteState;

        this.registry.set('isSfxMuted', newMuteState);

        return newMuteState;
    },

    isSfxMuted: function() {
        if (!this.registry) return true;
        return this.registry.get('isSfxMuted');
    },

    // Music
    playMusic: function(musicKey, config = {}) {
        if (!this.game || !this.registry) {
            console.error('SoundManager não inicializado');
            return;
        }

        // Se uma música já estiver tocando e a chave for diferente, pare a.
        if (this.currentMusicInstance && 
            this.currentMusicInstance.key !== musicKey 
            && this.currentMusicInstance.isPlaying) {
            this.currentMusicInstance.stop();
            this.currentMusicInstance = null;	
        }

        // Se a música solicitada já estiver tocando, não faz nada.
        if (this.currentMusicInstance &&
            this.currentMusicInstance.key === musicKey &&
            this.currentMusicInstance.isPlaying) {
            return this.currentMusicInstance;
        }

        // Se a música estiver pausada e não estiver mutada, retoma a música.
        if (this.currentMusicInstance && this.currentMusicInstance.key === musicKey && 
            this.currentMusicInstance.isPaused && 
            !this.registry.get('isMusicMuted')) {
            this.currentMusicInstance.resume();
            return this.currentMusicInstance;
        }


        const newMusic = this.game.sound.add(musicKey, config);
        this.currentMusicInstance = newMusic;

        // Se a música não estiver mutada, toca a música.
        if (!this.registry.get('isMusicMuted')) {
            newMusic.play();
        }

        return newMusic;
    },

    pauseMusic: function() {
        if (this.currentMusicInstance &&
            this.currentMusicInstance.isPlaying) {
            this.currentMusicInstance.pause();
        }
    },

    resumeMusic: function() {
        if (this.currentMusicInstance &&
            this.currentMusicInstance.isPaused) {
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

    }
}