function openAmdm(band, song) {
  var base_url = "";
  if (band) {
    chrome.tabs.update({url: 'https://amdm.ru/akkordi/'+band});
  };
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.tabs.executeScript(tabId, {file: 'jquery-1.8.3.min.js'});
      chrome.tabs.executeScript(tabId, {file: 'sorter.js'});
    }
  });
};

console.log('Reached popup.js')
document.addEventListener('DOMContentLoaded', () => {
  var band = document.getElementById('band');
  var song = document.getElementById('song');
  var button = document.getElementsByTagName('button')[0];

  button.addEventListener('click', () => {
    //Store vars to use them in content script
    chrome.storage.local.set({'band': band.value});
    chrome.storage.local.set({'song': song.value});
    openAmdm(band.value, song.value);
  });
});
