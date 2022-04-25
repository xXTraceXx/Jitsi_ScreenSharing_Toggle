const options = {
    hosts: {
        domain: 'meet.jitsi',
        muc: 'muc.meet.jitsi'
    },
    bosh: 'https://meet.beamstream.eu/http-bind'
};

let jitsiRoom = null;
let ownParticipantId = null;

JitsiMeetJS.init({ disableSimulcast: false});

JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.INFO);

const jitsiConnect = new JitsiMeetJS.JitsiConnection(null, null, options);

function connectJitsiServer(establishedEventHandler, failedEventHandler, disconnectedEventHanlder) {
    jitsiConnect.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, establishedEventHandler);
    jitsiConnect.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, failedEventHandler);
    jitsiConnect.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnectedEventHanlder);

    jitsiConnect.connect();
}

async function joinJitsiRoom(roomID, trackAdded, trackRemoved) {
    jitsiRoom = jitsiConnect.initJitsiConference(roomID, { openBridgeChannel: true, p2p: { enabled: false } });

    jitsiRoom.on(JitsiMeetJS.events.conference.TRACK_ADDED, trackAdded);
    jitsiRoom.on(JitsiMeetJS.events.conference.TRACK_REMOVED, trackRemoved);

    jitsiRoom.join();
    ownParticipantId = jitsiRoom.myUserId;
}
