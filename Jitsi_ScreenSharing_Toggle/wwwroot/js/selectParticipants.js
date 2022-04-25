$(async () => {
    connectJitsiServer(() => joinJitsiRoom('miau123', on_trackAdded, on_trackRemoved),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected')
    );

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

    //<button id="selectOneParticipantBtn">Select Just One Participant</button>
    //<button id="selectAllParticipantBtn">Select All Participants</button>

    $('#selectOneParticipantBtn').click(async () => {
        let selected_ID = $('#selectedParticipantId option:selected').text();
        console.info('selected_ID');
        console.info(selected_ID);

        jitsiRoom.selectParticipants([selected_ID]);
    });

    $('#selectAllParticipantBtn').click(async () => {
        let all_IDs = $('option').map(function () {
            return $(this).text();
        }).get();

        console.info('get all');
        console.info(all_IDs);

        jitsiRoom.selectParticipants(all_IDs);
    });
})

