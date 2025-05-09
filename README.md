# Electron Encryption

## Warning: DO NOT USE THIS FOR ANY GENUINE ENCRYPTION NEEDS!

## Description

This was a final project for a computer security class I took during the Fall 2024 semester at Berea College. The initial repository was a private repository for the class. Because of this, I had to create a new repository and copy the original repository's contents. [OriginalClassProjectReadme.md](OriginalClassProjectREADME.md) contains the original readme information pertinent to this project. [OldCommitHistory.txt](OldCommitHistory.txt) contains the commit log for the original repository.

## Installers

- [Windows and Linux Installers for Electron Encryption](https://drive.google.com/drive/folders/146AgZZoUjxwRbeXa7Cxl97feMKgCf2fX?usp=drive_link)

## How to run the app:

As of now, running the app from installing it to encrypting or decrypting a file works as follows:

The app can be installed using one of the installers in my 2024FA-CSC450/Individual Work/Final Project Installers folder.

Once the app is installed and launched, a login screen will appear. There is a default/testing password with the username and password both being 123, however, an account can be created using a create account link found on the first screen.

After logging in, an end user can upload a file to encrypt or click the "decrypt an encrypted file" link to decrypt a file. Most file types work. I have had success with images, videos, sound files, .tar.gz files, executables, .pdf files, and several other file types. Some notable exceptions were 7zip files and .iso image files. Once the uploaded file has been encrypted, the user will be prompted to select a save location using the OS file manager. The original copy of the file IS NOT deleted, so the user will need to delete it themselves if necessary for their needs.

An encrypted file can only be decrypted by the same account that encrypted it. Because the login information is handled locally, this also means that the decryption must happen on the same machine using the same install of the app* UNLESS the user navigates to their Electron Encryption appdata folder (user/appdata/roaming for Windows, ~/.config for Linux) and copies .logins.csv to the same appdata folder on another machine with the app installed.
*Because the app's appdata is stored in Roaming on Windows, it may carry over to other Windows machines using the same Microsoft account, but I haven't tested this.

I have tested the functionality of this app on Windows 10, Windows 11, Pop OS, and Fedora.
