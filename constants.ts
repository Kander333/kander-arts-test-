
import { LocationMap } from './types';

const ASSETS = {
  // Статические сцены (картинки)
  HUB_SCENE: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031022531/oacHfkGzuylALphx.jpeg",
  ARCHIVE_SCENE: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031022531/rokYXDVSaEPSXiCq.jpeg",
  PROTOCOL_SCENE: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031022531/NcJPSPaRnZdUNoWt.jpeg",
  TRANSMISSION_SCENE: "https://private-us-east-1.manuscdn.com/sessionFile/W2wWEytC3dKrqadUyPkKaZ/sandbox/i7Qiehyh7dJ90ZV5urIjYQ-img-3_1771435422000_na1fn_Y29udGFjdC1sb2NhdGlvbg.jpg",
  
  // Переходы (видео)
  TRANS_GENERIC: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031022531/ZOYzqEtllLbFTbgS.mp4"
};

export const LOCATIONS: LocationMap = {
  hub: {
    id: "hub",
    title: "CENTRAL_HUB",
    description: "Точка входа в систему. Обнаружены активные каналы связи с архивом и протокольным отсеком.",
    type: "node",
    imageScene: ASSETS.HUB_SCENE,
    uiOverlay: "HubUI",
    exits: [
      {
        targetId: "archive",
        label: "DATA_ARCHIVE",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 35, y: 45 } 
      },
      {
        targetId: "protocol",
        label: "PROTOCOL_CHAMBER",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 65, y: 40 }
      },
      {
        targetId: "transmission",
        label: "TRANS_POINT",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 50, y: 70 }
      }
    ]
  },
  archive: {
    id: "archive",
    title: "DATA_ARCHIVE",
    description: "Хранилище зашифрованных логов. Доступ к историческим данным восстановлен на 42%.",
    type: "node",
    imageScene: ASSETS.ARCHIVE_SCENE,
    uiOverlay: "ArchiveUI",
    exits: [
      {
        targetId: "hub",
        label: "BACK_TO_HUB",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 50, y: 85 }
      }
    ]
  },
  protocol: {
    id: "protocol",
    title: "PROTOCOL_CHAMBER",
    description: "Сектор исполнения Омега-директив. Здесь формируется реальность Конструкта.",
    type: "terminal",
    imageScene: ASSETS.PROTOCOL_SCENE,
    uiOverlay: "ManifestoUI",
    exits: [
      {
        targetId: "hub",
        label: "EXIT_PROTOCOL",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 50, y: 85 }
      }
    ]
  },
  transmission: {
    id: "transmission",
    title: "TRANSMISSION_POINT",
    description: "Внешний шлюз для передачи сигналов. Наблюдается высокая турбулентность данных.",
    type: "terminal",
    imageScene: ASSETS.TRANSMISSION_SCENE,
    uiOverlay: "StandardUI",
    exits: [
      {
        targetId: "hub",
        label: "RETURN_TO_CORE",
        transitionVideo: ASSETS.TRANS_GENERIC,
        coordinates: { x: 50, y: 85 }
      }
    ]
  }
};

export const INITIAL_LOCATION_ID = "hub";
