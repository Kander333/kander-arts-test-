
import { LocationMap } from './types';

// Using github.com/.../raw/main/... format which is often more robust for video playback
const ASSETS = {
  // Static Scenes (Images)
  HUB_SCENE: "https://github.com/Kander333/kander-arts-test-/raw/main/Cinematic_wide_shot_2k_202602181954.jpeg",
  ARCHIVE_SCENE: "https://github.com/Kander333/kander-arts-test-/raw/main/Abstract_control_room_202602182000.jpeg",
  PROTOCOL_SCENE: "https://github.com/Kander333/kander-arts-test-/raw/main/Futuristic_gallery_corridor_202602182000.jpeg",
  
  // Transitions (Videos)
  TRANS_TO_ARCHIVE: "https://github.com/Kander333/kander-arts-test-/raw/main/Camera_moves_to_ARCHIVE.mp4",
  TRANS_TO_PROTOCOL: "https://github.com/Kander333/kander-arts-test-/raw/main/Camera_moves_to_PROTOCOL%20_ROOM.mp4"
};

export const LOCATIONS: LocationMap = {
  hub: {
    id: "hub",
    title: "CENTRAL_HUB",
    description: "System entry point. Active data streams detected leading to the Archive and Protocol Chamber.",
    type: "node",
    imageScene: ASSETS.HUB_SCENE,
    uiOverlay: "HubUI",
    exits: [
      {
        targetId: "archive",
        label: "DATA_ARCHIVE",
        transitionVideo: ASSETS.TRANS_TO_ARCHIVE,
        coordinates: { x: 35, y: 45 } 
      },
      {
        targetId: "protocol",
        label: "PROTOCOL_CHAMBER",
        transitionVideo: ASSETS.TRANS_TO_PROTOCOL,
        coordinates: { x: 65, y: 40 }
      }
    ]
  },
  archive: {
    id: "archive",
    title: "DATA_ARCHIVE",
    description: "Deep storage for system logs. Encrypted fragments of the past reside here.",
    type: "node",
    imageScene: ASSETS.ARCHIVE_SCENE,
    uiOverlay: "ArchiveUI",
    exits: [
      {
        targetId: "hub",
        label: "RETURN_TO_HUB",
        transitionVideo: ASSETS.TRANS_TO_ARCHIVE,
        coordinates: { x: 50, y: 85 }
      }
    ]
  },
  protocol: {
    id: "protocol",
    title: "PROTOCOL_CHAMBER",
    description: "Execution sector for Omega-directives. The reality of the Construct is forged within these walls.",
    type: "terminal",
    imageScene: ASSETS.PROTOCOL_SCENE,
    uiOverlay: "ManifestoUI",
    exits: [
      {
        targetId: "hub",
        label: "EXIT_PROTOCOL",
        transitionVideo: ASSETS.TRANS_TO_PROTOCOL,
        coordinates: { x: 50, y: 85 }
      }
    ]
  }
};

export const INITIAL_LOCATION_ID = "hub";
