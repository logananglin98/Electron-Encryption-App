const { ipcRenderer } = require('electron');

console.log("Login script running");

/**
 * Sets global variables in the main process (index.js) for the username and encryption key.
 * The key will be used to encrypt and decrypt files in subsequent operations.
 *
 * @param {string} u - The username to set in the main process.
 * @param {string} k - The encryption key associated with the user.
 */
function setUsernameAndKey(u, k) {
    ipcRenderer.send('set-username', u);
    ipcRenderer.send('set-key', k);
}

/**
 * Validates the username and password against entries in the CSV file.
 * Checks if the username and password exist on the same line of the CSV.
 * If a match is found, it sets the username and key using `setUsernameAndKey()`.
 *
 * @async
 * @param {string} user - The username to validate.
 * @param {string} pass - The password to validate.
 * @returns {Promise<boolean>} Resolves to `true` if a matching username and password are found; otherwise, `false`.
 * @throws Will throw an error if the CSV file cannot be read.
 */
async function loginInCSV(user, pass) {
    try {
        const data = await ipcRenderer.invoke('read-logins-file');
        const lines = data.split('\n');

        for (const line of lines) {
            const parsedLine = line.split(",");
            console.log(`User from file: ${parsedLine[0]}`);
            if (parsedLine[0] === user && parsedLine[1] === pass) {
                console.log("Account found!");
                setUsernameAndKey(user, parsedLine[2]); // Set username and key upon successful login
                return true;
            }
        }

        return false; // No matching credentials found
    } catch (err) {
        console.error("Error reading CSV file:", err);
        throw err;
    }
}

/**
 * Handles the login process by validating form inputs against the CSV file.
 * Clears previous session data, validates credentials, and redirects based on the result.
 *
 * @async
 */
async function main() {
    // Clear the username and key to ensure no residual data from previous sessions.
    setUsernameAndKey("", "");

    // Attach an event listener to handle form submission
    document.getElementById("login_form").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const username = document.getElementById("first").value;
        const password = document.getElementById("password").value;

        console.log("Username entered:", username);

        if (await loginInCSV(username, password)) {
            // Redirect to the encryption page on successful login
            window.location.href = "../src/encrypt.html";
        } else {
            // Redirect to the error page on invalid credentials
            console.log("Invalid username or password.");
            window.location.href = "../src/wrong_login.html";
        }
    });
}

// Start the login process
main();
