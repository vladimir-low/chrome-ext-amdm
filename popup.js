// Gets data of specified type from storage
function getSavedData(type, callback) {
  chrome.storage.local.get([type], (items) => {
    callback(chrome.runtime.lastError ? null : items[type]);
  });
}

// Adds band or song name to proper list
function saveData(key, value) {
  if (value.length === 0) {
    return;
  }
  getSavedData(key, (list) => {
    if (!list) {
      var list = [value];
    } else if (!list.includes(value)) {
      list.push(value);
    }
  var items = {};
  items[key] = list;
  console.log(key + ': ' + items[key]);
  chrome.storage.local.set(items);
  });
}

function openAmdm(band, song) {
  chrome.tabs.update({url: 'https://amdm.ru/akkordi/'+band});
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.tabs.executeScript(tabId, {file: 'jquery-1.8.3.min.js'});
      chrome.tabs.executeScript(tabId, {file: 'sorter.js'});
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  //chrome.storage.local.clear(); // Flushes data store
  // Fills up datalists
  getSavedData('bands', (savedBands) => {
    if (savedBands) {
      var bList = document.getElementById('bandList');
      savedBands.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        bList.appendChild(option)
      });
    }
  });
  getSavedData('songs', (savedSongs) => {
    if (savedSongs) {
      var sList = document.getElementById('songList');
      savedSongs.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        sList.appendChild(option)
      });
    }
  });

  var button = document.getElementsByTagName('button')[0];
  button.addEventListener('click', () => {
    var band = document.getElementById('band');
    var song = document.getElementById('song');
    if (!band.value) {
      alert('Band is not entered');
      return;
    } else {
      saveData('bands', band.value);
      saveData('songs', song.value);
      //Stores song to search for it in content script
      chrome.storage.local.set({'song': song.value});
      openAmdm(band.value, song.value);
    }
  });
});
