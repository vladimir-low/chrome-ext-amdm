// inject script to the page due to limitations of chrome content scripts
// Read more at https://developer.chrome.com/extensions/content_scripts
var injectScript = document.createElement('script');
injectScript.textContent = '$(".tablesorter-header-inner:eq(2)").click();';
document.body.appendChild(injectScript);
console.log("Sorted!");

// Filter song on the band's page
function songHighlight() {
  chrome.storage.local.get(['song'], function(storage) {
    console.log('Searching for song ' + storage.song);
    var result = $('a').filter(function() {
      return $(this).text().toLowerCase().indexOf(storage.song.toLowerCase()) >= 0;
    }).first();
    if (0 === result.text().length) {
      alert('WARNING: No songs found!');
    } else {
      result.css('background-color', 'red');
    }
  });
}
setTimeout(songHighlight, '3000'); // Wait a bit for sorting to take place
