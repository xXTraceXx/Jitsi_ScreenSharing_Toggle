$(async () => {
    connectJitsiServer(() => joinJitsiRoom('miau123', on_trackAdded, on_trackRemoved),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected')
    );

    function on_trackAdded(track) {
        const pid = track.getParticipantId();

        if (!pid || track.type === 'audio' || pid === ownParticipantId)
            return;

        let videoElement = $('#remoteTrack');

        track.attach(videoElement[0]);
    }

    function on_trackRemoved(track) {
        const pid = track.getParticipantId();

        if (!pid || track.type === 'audio' || pid === ownParticipantId)
            return;


        $('#remoteTrack').replaceWith('<video id="remoteTrack" autoplay playsinline muted></video>');
    }

    $('#createPreviewBtn').click(async () => {
        try {
            let previewVideo = await JitsiMeetJS.createLocalTracks({
                devices: ['video'],
                constraints: {
                    "video": {
                        "height": { "max": 720 },
                        "width": { "max": 1280 }
                    }
                }
            });
        } catch (e) {
            console.error(e);
        }

        let previewVideoElement = $('#previewVideo');

        previewVideo[0].attach(previewVideoElement[0]);
    });

    $('#startBtn').click(async () => {

        try {
            let newVideoTrack = await JitsiMeetJS.createLocalTracks({
                devices: ['video'],
                constraints: {
                    "video": {
                        "height": { "ideal": 720, "max": 720, "min": 720 },
                        "width": { "ideal": 1280, "max": 1280, "min": 1280 }
                    }
                }
            });

            let videoElement = $('#remoteTrack');

            newVideoTrack[0].attach(videoElement[0]);

        } catch (e) {
            console.error(e);
        }
    });

    $('#180pBtn').click(async () => {
        console.log('enter 180pBtn');

        jitsiRoom.setReceiverConstraints({
            'lastN': 1,
            'defaultConstraints': { 'maxHeight': 180 }
        });
    });

    $('#360pBtn').click(async () => {
        console.log('enter 360pBtn');

        jitsiRoom.setReceiverConstraints({
            'lastN': 1,
            'defaultConstraints': { 'maxHeight': 360 }
        });
    });

    $('#720pBtn').click(async () => {
        console.log('enter 720pBtn');
        /*jitsiRoom.setReceiverVideoConstraint('720');*/

        jitsiRoom.setReceiverConstraints({
            'lastN': 1,
            'defaultConstraints': { 'maxHeight': 720 }
        });
    });
})



//<button id="startBtn"></button>
//<button id="180pBtn"></button>
//<button id="360pBtn"></button>
//<button id="720pBtn"></button>

