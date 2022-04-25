$(async () => {
    connectJitsiServer(() => joinJitsiRoom('test123', on_trackAdded, on_trackRemoved),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected')
    );

    function on_trackRemoved(track)
    {
        console.log('enter on_trackRemoved');
        const pid = track.getParticipantId();

        const videoElement = $(`video[data-pid="${pid}"]`);

        if (videoElement.length === 0) // no videoContainer found
            return;

        videoElement.removeAttr('data-pid');

        const video_id = videoElement.attr('id');
        const video_poster = videoElement.attr('poster');

        //videoElement.replaceWith(`<video id="${video_id}" poster="${video_poster}" autoplay playsinline muted></video>`);
    }

    function on_trackAdded(track) {
        console.log('enter on_trackAdded');
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