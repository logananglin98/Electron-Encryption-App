const { ipcRenderer } = require('electron');
const readline = require('readline');
const events = require('events');
const math = require('mathjs');

console.log("Create Account script running");

/**
 * Generates a random 256-bit key in hexadecimal format.
 * The key will consist of 256 hexadecimal characters (128 bytes).
 *
 * @returns {string} A random hexadecimal key of 256 characters.
 */
function getRandomKey() {
    const keyLength = 256; // Key length in bits (can be adjusted for different encryption styles)
    const numBytes = keyLength / 8; // Convert bits to bytes
    const hexNumbers = "0123456789ABCDEF";

    let randomKey = "";

    for (let i = 0; i < numBytes * 2; i++) {
        randomKey += hexNumbers[Math.floor(Math.random() * 16)];
    }

    return randomKey;
}

/**
 * Checks if a username already exists in the CSV file.
 * This function reads the CSV file and compares each username entry to the provided username.
 *
 * @async
 * @param {string} user - The username to check for duplicates.
 * @returns {Promise<boolean>} Resolves to `true` if the username exists, otherwise `false`.
 * @throws Will throw an error if the CSV file cannot be read.
 */
async function userInCSV(user) {
    try {
        const data = await ipcRenderer.invoke('read-logins-file');
        const lines = data.split('\n');

        for (const line of lines) {
            const parsedLine = line.split(",");
            console.log(`User from file: ${parsedLine[0]}`);
            if (parsedLine[0] === user) {
                console.log("Duplicate username detected!");
                window.location.href = "../src/account_found.html";
                return true; // Username exists
            }
        }

        return false; // Username not found
    } catch (err) {
        console.error("Error checking username in CSV:", err);
        throw err;
    }
}

/**
 * Validates a password against specific criteria.
 * Ensures the password meets the minimum length and matches the confirmation password.
 *
 * @param {string} pass - The password to validate.
 * @param {string} conf - The confirmation password.
 * @returns {boolean} Returns `true` if the password is valid, otherwise `false`.
 */
function checkPassword(pass, conf) {
    const passwordMinLength = 8; // Minimum length for passwords

    if (pass.length < passwordMinLength) { // Checks for required password length
        console.log("Password is too short!");
        window.location.href = "../src/password_too_short.html";  
        return false;
    }

    if (pass !== conf) { // Checks is the password and confirmation password are the same
        console.log("Password and confirmation do not match!");
        window.location.href = "../src/password_mismatch.html";   
        return false;
    }

    return true;
}

/**
 * Adds a new account entry to the CSV file.
 * Appends the username, password, and randomly generated key to the CSV.
 *
 * @async
 * @param {string} account - A formatted string containing the username, password, and key.
 * @returns {Promise<void>}
 * @throws Will throw an error if the CSV file cannot be updated.
 */
async function addAccountToCSV(account) {
    try {
        const existingData = await ipcRenderer.invoke('read-logins-file');
        const updatedData = existingData + account;

        await ipcRenderer.invoke('write-logins-file', updatedData);
        console.log("CSV updated successfully.");
        window.location.href = "../src/account_created.html";
    } catch (err) {
        console.error("Error occurred while updating the CSV:", err);
        throw err;
    }
}

/**
 * Handles the account creation process.
 * Validates user input and adds a new account entry to the CSV if all checks pass.
 *
 * @async
 */
async function main() {
    document.getElementById("account_form").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        let accountTuple; // Used to store the concatenated username, password, and key

        const username = document.getElementById("first").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        console.log("Username entered:", username);

        // Ensure the username is not already in the CSV and passwords are valid
        if (!(await userInCSV(username)) && checkPassword(password, confirmPassword)) {
            // Create the account entry if all validations pass
            accountTuple = `${username},${password},${getRandomKey()}\n`; 
            await addAccountToCSV(accountTuple);
        }
    });
}

// Start the create_account process
main();
