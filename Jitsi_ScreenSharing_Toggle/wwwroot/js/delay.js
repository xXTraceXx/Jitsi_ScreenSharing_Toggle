$(async () => {
    $('#joinRoomBtn').click(onClick_joinJitsiRoom);
    $('#createVideoBtn').click(createVideo);
    $('#createAudioBtn').click(createAudio);

    connectJitsiServer(() => console.info('jitsi connection established...'),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected...')
    );

    function onClick_joinJitsiRoom() {
        joinJitsiRoom('miau123', on_trackAdded, on_trackRemoved);
    }

    function on_trackRemoved(track) {
        const pid = track.getParticipantId();

        const videoContainer = $(`div[data-pid="${pid}"]`);

        if (videoContainer.length === 0) // no videoContainer found
            return;

        videoContainer.find('h3').text('');

        videoContainer.removeAttr('data-pid');

        $(`option[data-pid="${pid}"]`).remove();
    }

    function on_trackAdded(track) {
        const pid = track.getParticipantId();

        if (!pid || track.type === 'audio' || pid === ownParticipantId)
            return;

        const freeVideoContainer = $('#jitsiContainer div:not([data-pid])')[0];
        console.log(freeVideoContainer)

        if (!freeVideoContainer) // all videoContainers are live
            return;

        const videoElement = $(freeVideoContainer).find('video');

        track.attach(videoElement[0]);

        const pidHeader = $(freeVideoContainer).find('h3');
        pidHeader.text(pid);

        $(freeVideoContainer).attr('data-pid', pid);

        $('#selectedParticipantId').append(`<option data-pid="${pid}">${pid}</option>`)
    }

    async function createVideo() {
        try {
            let videoTrack = await JitsiMeetJS.createLocalTracks({ devices: ['video'] });

            jitsiRoom.addTrack(videoTrack[0]);
        } catch (errorMsg) {
            console.error(errorMsg);
        }
        
    }

    async function createAudio() {

        // var audioContext = new AudioContext();
        // var source = audioContext.createMediaStreamSource(stream);
           
        // let audioDelay = audioContext.createDelay(10); // 10 seconds max delay
        // audioDelay.delayTime.value = 3 // Seconds delay
           
        // source.connect(audioDelay).connect(audioContext.destination)

        try {
            let audioTrack = await JitsiMeetJS.createLocalTracks({ devices: ['audio'] });

            //let streamAudioTrack = audioTrack[0].stream.getAudioTracks()[0];

            //console.log('audioTrack');
            //console.log(audioTrack);

            //let audioContext = new AudioContext();
            //let source = audioContext.createMediaStreamSource(audioTrack[0].stream);
            

            //let audioDelay = audioContext.createDelay(5);
            //audioDelay.delayTime.value = 5;

            
            //console.log(source);

            //audioTrack[0].track = null;

            //streamAudioTrack = source.mediaStream;

            //source.connect(audioDelay).connect(audioContext.destination);


            jitsiRoom.addTrack(audioTrack[0]);

        } catch (errorMsg) {
            console.error(errorMsg);
        }
    }







});