const { ipcRenderer } = require('electron');
const fs = require('fs');
const crypto = require('crypto');

console.log("Decryption script running");

/**
 * Retrieves the encryption/decryption key from the main process.
 * Converts the hexadecimal key into a buffer for cryptographic operations.
 *
 * @returns {Buffer|null} The decryption key as a buffer, or null if an error occurs.
 */
function getKey() {
    let hexKey;
    let key;
    try {
        hexKey = ipcRenderer.sendSync('get-key');
    } catch (error) {
        console.error('Error retrieving key:', error.message);
    }

    if (!hexKey) {
        console.error("Key is missing!");
        return null;
    }

    try {
        key = Buffer.from(hexKey, 'hex');
    } catch (error) {
        console.error('Error converting key to buffer:', error.message);
        return null;
    }
    return key;
}

/**
 * Class to handle decryption of files uploaded by the user.
 */
class Decryptor {
    #file;
    #key;
    #iv;
    #decipher;
    #encryptedData;
    #decrypted;
    #reader;
    #arrayBuffer;
    #fileBuffer;
    #fileName;
    #fileNameLength;

    /**
     * Creates an instance of the Decryptor class.
     *
     * @param {File} file - The file to be decrypted.
     * @param {Buffer} key - The decryption key as a buffer.
     */
    constructor(file, key) {
        this.#file = file;
        this.#key = key;
    }

    /**
     * Reads the file content and converts it into a buffer.
     * Uses the FileReader API to handle file reading asynchronously.
     *
     * @returns {Promise<void>} Resolves when the file has been successfully read.
     */
    async readFile() {
        return new Promise((resolve, reject) => {
            this.#reader = new FileReader();

            this.#reader.onload = (e) => {
                this.#arrayBuffer = e.target.result;
                this.#fileBuffer = Buffer.from(this.#arrayBuffer); // Convert ArrayBuffer to Buffer
                resolve();
            };

            this.#reader.onerror = (e) => {
                console.error("Error reading file:", e);
                reject(new Error("Failed to read file."));
            };

            this.#reader.readAsArrayBuffer(this.#file); // Trigger the FileReader to read the file
        });
    }

    /**
     * Decrypts the file content using AES-256-CBC.
     * Extracts the initialization vector (IV) from the file and decrypts the remaining data.
     *
     * @throws Will throw an error if the decryption key or IV is missing.
     */
    decrypt() {
        console.log("Decryption method running");
        this.#iv = this.#fileBuffer.slice(0, 16); // Extract IV (first 16 bytes)
        this.#fileNameLength=this.#fileBuffer.readUInt8(this.#fileBuffer.length - 1);
        this.#fileName = this.#fileBuffer.slice(this.#fileBuffer.length - this.#fileNameLength - 1 , this.#fileBuffer.length - 1).toString('utf8').trim();

        this.#encryptedData = this.#fileBuffer.slice(16, this.#fileBuffer.length - this.#fileNameLength - 1); // Extract encrypted data

        if (!this.#key || !this.#iv) {
            throw new Error("Decryption key or initialization vector is missing!");
        }

        this.#decipher = crypto.createDecipheriv('aes-256-cbc', this.#key, this.#iv);
        this.#decrypted = Buffer.concat([this.#decipher.update(this.#encryptedData), this.#decipher.final()]);
        
        console.log("Decryption function finished");
    }

    /**
     * Prompts the user to save the decrypted content to a file.
     * Uses Electron's dialog API to show the save dialog.
     */
    saveDecryptedFile() {
        if (!this.#decrypted) {
            console.error('Decrypted content has not been created.');
            return;
        }

        ipcRenderer.invoke('show-save-dialog-decrypt', this.#fileName).then((filePath) => {
            if (filePath) {
                try {
                    // Save the decrypted file to the selected location
                    fs.writeFileSync(filePath, this.#decrypted);
                    console.log(`Decrypted file saved to ${filePath}`);
                } catch (error) {
                    console.error('Failed to save the decrypted file:', error.message);
                }
            } else {
                console.log('Save operation was canceled.');
            }
        }).catch((error) => {
            console.error('Error showing save dialog:', error.message);
        });
        
    }
}

/**
 * Initializes the decryption process by handling the file upload form submission.
 * Reads the selected file, decrypts it, and prompts the user to save the decrypted file.
 */
function main() {
    document.getElementById("decrypt-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        console.log("File reader running");

        const upload = document.getElementById("decrypt_upload");
        const inputFile = upload.files[0];

        const userKey = getKey();

        if (inputFile) {
            const decryptor = new Decryptor(inputFile, userKey);
            await decryptor.readFile();
            decryptor.decrypt();
            decryptor.saveDecryptedFile();
        } else {
            alert("No file selected!");
        }
    });
}

// Start the decryption process
main();