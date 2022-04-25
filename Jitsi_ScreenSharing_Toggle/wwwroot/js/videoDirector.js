$(async () => {
    $('#startVideo').click(async () => {
        try {
            let localTrack = jitsiRoom.getLocalTracks()[0];

            // verhindert, dass ein track 2 mal hinzugefügt wird
            if (localTrack && localTrack.videoType === 'camera')
                return;

            let newVideoTrack = await JitsiMeetJS.createLocalTracks({ devices: ['video'] });

            // aktuell ist screensharing aktiv => wechsel zu camera
            if (localTrack && localTrack.videoType === 'desktop') {
                await jitsiRoom.replaceTrack(localTrack, newVideoTrack[0]);
            }

            // noch kein track ist aktiv => füge den raum hinzu
            if (!localTrack) {
                await jitsiRoom.addTrack(newVideoTrack[0]);
            }
        } catch (e) {
            console.error(e);
        }
    });

    $('#startScreenSharing').click(async () => {
        try {
            let localTrack = jitsiRoom.getLocalTracks()[0];

            // verhindert, dass ein track 2 mal hinzugefügt wird
            if (localTrack && localTrack.videoType === 'desktop')
                return;

            let newVideoTrack = await JitsiMeetJS.createLocalTracks({ devices: ['desktop'] });

            // aktueller ist camera aktiv => wechsel zu screensharing 
            if (localTrack && localTrack.videoType === 'camera') {
                // case 'videoType == desktop' => switche zu camera
                await jitsiRoom.replaceTrack(localTrack, newVideoTrack[0]);
            }

            // noch kein track ist aktiv => fürge den raum hinzu
            if (!localTrack) {
                console.log(newVideoTrack);
                await jitsiRoom.addTrack(newVideoTrack[0]);
            }

        } catch (e) {
            console.error(e);
        }
    });

    $('#addRemoveVideo').click(() => {

        let currentVideoTrack = jitsiRoom.getLocalVideoTrack();
        console.log('currentVideoTrack');
        console.log(currentVideoTrack);

        jitsiRoom.removeTrack(currentVideoTrack)
            .then(() => {
                jitsiRoom.addTrack(currentVideoTrack);
            })
            .catch((e) => {
                console.error(e);
            });

        //jitsiRoom.removeTrack(currentVideoTrack)
        //    .then((success) => console.info('successfully removed'))
        //    .catch(console.error);
    })

    connectJitsiServer(() => joinJitsiRoom('test123', on_trackAdded, on_trackRemoved),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected')
    );

    function on_trackRemoved(track) {
        const pid = track.getParticipantId();

        const videoContainer = $(`div[data-pid="${pid}"]`);

        if (videoContainer.length === 0) // no videoContainer found
            return;

        videoContainer.removeAttr('data-pid');
    }

    function on_trackAdded(track) {
        const pid = track.getParticipantId();

        if (!pid || track.type === 'audio' || pid === ownParticipantId)
            return;

        const freeVideoContainer = $('video:not([data-pid])');

        if (freeVideoContainer.length === 0) // all videoContainers are live
            return;

        track.attach(freeVideoContainer[0]);

        $(freeVideoContainer[0]).attr('data-pid', pid);
    }
})



