// @flow
import Deferred from "./../../../core/deferred";

const successPattern = /(?:\?|&|#)(?:access_)?token=([^&]+)/;
const tbs = window.chrome.tabs;

export default (url: string, fromTab: number) => {
  const deferred: Deferred = new Deferred();
  let idOfCreatedTab;
  let wIdOfCreatedTab;

  const watchHandler = (
    idOfUpdatedTab: number,
    changes: Object,
    tab: Object
  ) => {
    const { windowId: wIdOfUpdatedTab } = tab;
    const { url, status } = changes;
    if (
      wIdOfCreatedTab === wIdOfUpdatedTab &&
      idOfCreatedTab === idOfUpdatedTab &&
      url &&
      status
    ) {
      const token = url.match(successPattern);
      let needCleanWatcher = false;
      if (token) {
        deferred.resolve({
          token: token[1]
        });
        needCleanWatcher = true;
      } else {
        //  cleanWatchers();
      }
      if (needCleanWatcher) {
        cleanWatchers();
      }
    }
  };

  function cleanWatchers(isRemoved) {
    tbs.onUpdated.removeListener(watchHandler);
    tbs.onRemoved.removeListener(cleanWatchersFromOnRemoved);
    tbs.update(fromTab, {
      active: true,
      highlighted: true
    });
    if (!isRemoved) {
      tbs.remove(idOfCreatedTab);
    }
    deferred.reject(isRemoved ? "closed" : "");
  }

  function cleanWatchersFromOnRemoved() {
    cleanWatchers(true);
  }
  tbs.create(
    {
      url
    },
    (tab: Object) => {
      const { id, windowId } = tab;
      idOfCreatedTab = id;
      wIdOfCreatedTab = windowId;
      tbs.onUpdated.addListener(watchHandler);
      tbs.onRemoved.addListener(cleanWatchersFromOnRemoved);
    }
  );
  return deferred.promise;
};
