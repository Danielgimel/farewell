(function () {
  "use strict";

  function base64ToBytes(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function bytesToBase64(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function base64urlToBytes(b64url) {
    var b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return base64ToBytes(b64);
  }

  function bytesToBase64url(bytes) {
    return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // payload: { iv: base64, data: base64 }  |  keyB64url: key from the URL fragment
  async function decryptPerson(payload, keyB64url) {
    var keyBytes = base64urlToBytes(keyB64url);
    var iv = base64ToBytes(payload.iv);
    var data = base64ToBytes(payload.data);

    var key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
    var plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
    return JSON.parse(new TextDecoder().decode(plainBuf));
  }

  // obj: plain JS object (name, intro, game, gameConfig, letter, signoff, ...)
  async function encryptPerson(obj) {
    var keyBytes = crypto.getRandomValues(new Uint8Array(32));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);
    var plain = new TextEncoder().encode(JSON.stringify(obj));
    var cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, plain);

    return {
      payload: { iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(cipherBuf)) },
      keyB64url: bytesToBase64url(keyBytes)
    };
  }

  window.CryptoUtils = {
    base64ToBytes: base64ToBytes,
    bytesToBase64: bytesToBase64,
    base64urlToBytes: base64urlToBytes,
    bytesToBase64url: bytesToBase64url,
    decryptPerson: decryptPerson,
    encryptPerson: encryptPerson
  };
})();
