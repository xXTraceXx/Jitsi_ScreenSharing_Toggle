$(async () => {
    //<button id="joinRoomBtn">Join Room</button>
    //<button id="leaveRoomBtn">Leave Room</button>

    $('#joinRoomBtn').click(onClick_joinJitsiRoom);
    $('#leaveRoomBtn').click(onClick_leaveJitsiRoom);


    connectJitsiServer(() => console.info('jitsi connection established...'),
        () => console.error('jitsi connection failed...'),
        () => console.error('jitsi connection disconnected...')
    );

    function onClick_joinJitsiRoom() {
        const clickedBtn = $(this);
        const leaveRoomBtn = $('#leaveRoomBtn');

        joinJitsiRoom('miau123', on_trackAdded, on_trackRemoved);
        console.info('joined jitsiRoom successfully...');   
        clickedBtn.hide();
        leaveRoomBtn.show();
    }

    async function onClick_leaveJitsiRoom() {
        if (!jitsiRoom) {
            console.error('you are not in a jitsiRoom');
            return;
        }

        const clickedBtn = $(this);
        const joinRoomBtn = $('#joinRoomBtn');

        try {
            await jitsiRoom.leave();
            console.info('left jitsiRoom successfully...');
            clickedBtn.hide();
            joinRoomBtn.show();
        } catch (errorMsg) {
            console.error(errorMsg);
        }
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
})

