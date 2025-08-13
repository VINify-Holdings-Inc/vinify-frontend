// Encrypt a string using Base64
export const encryptString=(str) =>{
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.error("Encryption failed:", e);
    return null;
  }
}

// Decrypt a string from Base64
export const decryptString=(encryptedStr)=> {
  try {
    return decodeURIComponent(escape(atob(encryptedStr)));
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}

 
