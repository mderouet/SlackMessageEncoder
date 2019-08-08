var ENCRYPTION_KEY = "DEFAULT";
let PREFIX_MESSAGE = "@@@@";
let HMAC_PREFIX = '####';
let ERROR_MESSAGE = "[CANNOT DECODE THIS MESSAGE WITH PROVIDED ENCRYPTION KEY]";
window.addEventListener("load", function () {
  chrome.storage.sync.get(["USER_ENCRYPTION_KEY"], function (items) {
    if (items.USER_ENCRYPTION_KEY) {
      console.log('A USER ENCRYPTION KEY EXIST, SETTING IT AS CURRENT');
      ENCRYPTION_KEY = items.USER_ENCRYPTION_KEY;
    }
  });
  // Alt key
  window.addEventListener("keyup", function (event) {
    if (event.keyCode === 18) {
      let encodedMessage = encrypt($(".ql-editor")[0].innerText);
      $(".ql-editor")[0].innerText = encrypt(encodedMessage);
    }
  });
});

setInterval(function () {
  decryptsAllMessages();
}, 500);

function decryptsAllMessages() {
  if (window.jQuery) {
    var messagesEncoded = $("span:contains(@@@@)");
    for (var i = 0; i < messagesEncoded.length; i++) {
      try {
        let messageToDecode = messagesEncoded[i].innerText.split('@@@@')[1];
        messagesEncoded[i].innerText = decrypt(messageToDecode);
      } catch (error) {
        console.log("Error decoding message " + error);
        messagesEncoded[i].innerText = ERROR_MESSAGE 
      }
    }
  }
}

function encrypt(message = '') {
  var encodedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY);
  encodedMessage = PREFIX_MESSAGE + encodedMessage;
  return encodedMessage;
}

function decrypt(message = '') {
  console.log("Trying to decrypt : " + message);
  var code = CryptoJS.AES.decrypt(message, ENCRYPTION_KEY);
  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

chrome.runtime.onMessage.addListener(newEncryptionKey => {
  chrome.storage.sync.set({ "USER_ENCRYPTION_KEY": newEncryptionKey }, function () {
    alert("New encryption key set");
    console.log("USER SET A NEW ENCRYPTION KEY");
  });

  ENCRYPTION_KEY = newEncryptionKey;
});