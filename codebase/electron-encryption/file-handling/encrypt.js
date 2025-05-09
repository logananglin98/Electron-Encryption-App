const { ipcRenderer } = require('electron');
const fs = require('fs');
const crypto = require('crypto');

console.log("Encryption script running");

/**
 * Retrieves the user's 256-bit encryption key stored as a hexadecimal string.
 * Converts the key into a buffer for cryptographic operations.
 *
 * @returns {Buffer|null} The encryption key as a buffer, or null if retrieval or conversion fails.
 */
function getKey() {
    let hexKey;
    let key;

    try {
        // Request the key from the main process
        hexKey = ipcRenderer.sendSync('get-key');
    } catch (error) {
        console.error('Error retrieving key:', error.message);
    }

    if (!hexKey) {
        console.error("Key is missing!");
        return null;
    }

    try {
        // Convert hexadecimal key to a Buffer
        key = Buffer.from(hexKey, 'hex');
    } catch (error) {
        console.error('Error converting key to buffer:', error.message);
        return null;
    }

    return key;
}

/**
 * Class for handling file encryption using AES-256-CBC.
 * Allows the user to select a file, encrypt it, and save the encrypted file with a prepended IV.
 */
class Encryptor {
    #file;
    #fileName;
    #FileNameLength;
    #key;
    #iv;
    #cipher;
    #encrypted;
    #reader;
    #arrayBuffer;
    #fileBuffer;

    /**
     * Creates an Encryptor instance with the provided file and encryption key.
     * Generates a random initialization vector (IV) for encryption.
     *
     * @param {File} file - The file to encrypt.
     * @param {Buffer} key - The encryption key.
     */
    constructor(file, key) {
        this.#file = file;
        this.#key = key;
        this.#fileName = Buffer.from(file.name); 
        this.#FileNameLength = Buffer.alloc(1);
        this.#FileNameLength.writeUInt8(this.#fileName.length, 0);
        this.setRandomIV();
    }

    /**
     * Reads the content of the file as a buffer.
     * Uses the FileReader API to handle file reading asynchronously.
     *
     * @returns {Promise<void>} Resolves when the file is successfully read.
     */
    async readFile() {
        return new Promise((resolve, reject) => {
            this.#reader = new FileReader();

            this.#reader.onload = (e) => {
                // Convert the ArrayBuffer to a regular Buffer
                this.#arrayBuffer = e.target.result;
                this.#fileBuffer = Buffer.from(this.#arrayBuffer);
                resolve();
            };

            this.#reader.onerror = (e) => {
                console.error("Error reading file:", e);
                reject(new Error("Failed to read file."));
            };

            this.#reader.readAsArrayBuffer(this.#file); // Read the file as an ArrayBuffer
        });
    }

    /**
     * Generates a random 16-byte initialization vector (IV) for AES encryption.
     * The IV ensures that encrypting the same file multiple times results in different outputs.
     */
    setRandomIV() {
        this.#iv = crypto.randomBytes(16); // AES block size for CBC mode
    }

    /**
     * Encrypts the file content using AES-256-CBC.
     * Prepends the IV to the encrypted data to enable decryption.
     *
     * @throws Will throw an error if the key, IV, or file content is missing.
     */
    encrypt() {
        console.log("Encryption method running");

        if (!this.#key || !this.#iv) {
            throw new Error("Encryption key or initialization vector is missing!");
        }

        if (!this.#fileBuffer) {
            throw new Error("File content not read. Call readFile() before encrypting.");
        }

        try {
            this.#cipher = crypto.createCipheriv('aes-256-cbc', this.#key, this.#iv);
            // Encrypt the file and prepend the IV
            this.#encrypted = Buffer.concat([
                this.#iv,
                this.#cipher.update(this.#fileBuffer),
                this.#cipher.final(),
                this.#fileName,
                this.#FileNameLength
            ]);
            console.log("Encryption completed successfully.");
        } catch (error) {
            console.error("Error during encryption:", error.message);
        }
    }

    /**
     * Prompts the user to save the encrypted file as a binary (.bin) file.
     * Uses Electron's dialog API to show the save dialog.
     */
    saveEncryptedFile() {
        if (!this.#encrypted) {
            console.error('Encrypted content has not been created.');
            return;
        }

        ipcRenderer.invoke('show-save-dialog-encrypt').then((filePath) => {
            if (filePath) {
                try {
                    // Save the encrypted file to the selected location
                    fs.writeFileSync(filePath, this.#encrypted);
                    console.log(`Encrypted file saved to ${filePath}`);
                } catch (error) {
                    console.error('Failed to save the encrypted file:', error.message);
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
 * Main function to initialize the encryption process.
 * Handles file uploads, encrypts the file, and allows the user to save it.
 */
function main() {
    document.getElementById("encrypt-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        console.log("File reader initialized.");

        const upload = document.getElementById("encrypt_upload");
        const inputFile = upload.files[0]; // Retrieve the selected file

        const userKey = getKey(); // Get user key

        if (inputFile) {
            const encryptor = new Encryptor(inputFile, userKey);
            await encryptor.readFile();
            encryptor.encrypt();
            encryptor.saveEncryptedFile();
        } else {
            alert("No file selected!");
        }
    });
}

// Start the encryption process
main();