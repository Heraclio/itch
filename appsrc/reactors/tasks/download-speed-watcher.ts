
import {Watcher} from "../watcher";
import * as actions from "../../actions";

import delay from "../delay";

import {opts} from "./log";
import mklog from "../../util/log";
const log = mklog("download-speed-watcher");

const DOWNLOAD_SPEED_DELAY = 1000;

import {IStore} from "../../types";

async function updateDownloadSpeed (store: IStore) {
  await delay(DOWNLOAD_SPEED_DELAY);

  const downloadsState = store.getState().downloads;
  const activeDownload = downloadsState.activeDownload;

  let bps = 0;

  if (!downloadsState.downloadsPaused && activeDownload) {
    bps = activeDownload.bps || 0;
  }

  store.dispatch(actions.downloadSpeedDatapoint({bps}));
}

export default function (watcher: Watcher) {
  watcher.on(actions.boot, async (store, action) => {
    while (true) {
      try {
        await updateDownloadSpeed(store);
      } catch (e) {
        log(opts, `While updating download speed: ${e.stack || e}`);
      }
    }
  });
}
