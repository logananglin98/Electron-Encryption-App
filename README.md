[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TNLLzJ67)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=16856054&assignment_repo_type=AssignmentRepo)
# Electron Encryption
## Description/Motivation

I am going to use the Electron GUI framework, Javascript, and Nodejs Node.js to build a GUI desktop app that will allow an end user to select a file and encrypt it. This file will remain encrypted until the same end user requests the file be decrypted.

## Prerequisites

I will need to install Node, Electron, and Javascript on my laptop using node and npm. I will also need to initialize those technologies in my repo. node_modules is ignored by github. If this repo is opened on any other PC, the technologies will need to be re-initialized.

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

## Requirements

### Mandatory Features

        - Requirement 1 [complete]
  - **Statement**: Create a basic html/css layout for the app with minimal design that will accomodate the functionality of the app.
  - **Evaluation Method**: There will be login, account creation, and encryption/decryption html files linked to css file(s).
  - **Dependency**: none
  - **Priority**: Medium
  - **Requirement revision history**: (when, what, and why)

        - Requirement 2 [complete]
  - **Statement**: Create sripts that handle logging in and creating accounts. These accounts will be linked to a css file that handles login information.
  - **Evaluation Method**: User can use the html pages to create an account and login. These html pages will be linked to the scripts.
  - **Dependency**: Requirement 1
  - **Priority**: Medium
  - **Requirement revision history**: (when, what, and why)

        - Requirement 3 [complete]
  - **Statement**: Add a function to the script for account creation that generates a random key and adds it to the login information.
  - **Evaluation Method**: Random key is in the third column of the csv after an account is created.
  - **Dependency**: Requirement 2
  - **Priority**: High
  - **Requirement revision history**: (when, what, and why)

          - Requirement 4 [complete]
  - **Statement**: Add ability to upload files to be encrypted.
  - **Evaluation Method**: User can click a button on the page that will bring up a file manager window for them to select the file. Running the code in this state will bring up the incomplete encryption script because it is linked to the encryption html page.
  - **Dependency**: Requirement 1
  - **Priority**: High
  - **Requirement revision history**: (when, what, and why)

          - Requirement 5 [complete]
  - **Statement**: Complete encryption script.
  - **Evaluation Method**: After uploading the file, the file will be passed to the encryption script which will encrypt the file and will task the user to download the encrypted version of the file.
  - **Dependency**: Requirement 4
  - **Priority**: High
  - **Requirement revision history**: (when, what, and why)

          - Requirement 6 [complete]
  - **Statement**: Add ability to upload files to be decrypted.
  - **Evaluation Method**: User can click a button on the page that will bring up a file manager window for them to select the file. Running the code in this state will bring up the incomplete decryption script because it is linked to the encryption html page.
  - **Dependency**: Requirement 1
  - **Priority**: High
  - **Requirement revision history**: (when, what, and why)

          - Requirement 7 [complete]
  - **Statement**: Complete Decryption file.
  - **Evaluation Method**: After uploading the file and after processing the file, the encryption script will encrypt the file and will task the user to download the encrypted version of the file. The decryption script will use the key saved in the csv to decrypt the file.
  - **Dependency**: Requirement 6
  - **Priority**: High
  - **Requirement revision history**: (when, what, and why)

### Features to be added if time permits

          -  Additional Feature 8
  - **Statement**: Add more than 1 encryption algorithm.
  - **Evaluation Method**: User will have the option to encrypt the input file with one or more encryption algorithms from a list.
  - **Dependency**: Requirement 1 through 7
  - **Priority**: If time permits.
  - **Requirement revision history**: (when, what, and why)

          - Additional Feature 9
  - **Statement**: Create custom encryption
  - **Evaluation Method**: One of the encryption algorithms the end user can select is a "homemade" algorithm unique to this app.
  - **Dependency**: Requirement 1 through 7, Additional Feature 8
  - **Priority**: If time permits.
  - **Requirement revision history**: (when, what, and why)

          - Additional Feature 10
  - **Statement**: Enhance CSS so the app looks sleek, modern, and intuitive.
  - **Evaluation Method**: I and others will like the way the app looks.
  - **Dependency**: Requirement 1 through 7
  - **Priority**: If time permits.
  - **Requirement revision history**: (when, what, and why)

            - Additional Feature 11
  - **Statement**: Add "drag and drop" box to encryption and decryption html pages.
  - **Evaluation Method**: User can opt to drag the file they want to encrypt or decrypt into a box that will accomplish what the upload button does without opening a file manager.
  - **Dependency**: Requirement 1 through 7
  - **Priority**: If time permits.
  - **Requirement revision history**: (when, what, and why)

## Built With

- [Electron](https://www.electronjs.org/)
- [Node](https://nodejs.org/en)
- [Javascript](https://www.javascript.com/):
- [VSCode](https://code.visualstudio.com/)
- [VMWare Workstation Pro for Testing](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion) 
- [Canva for Icon](https://www.canva.com/design/DAGXz70hEaE/7HR8lGsBgG0VK0iuQN80zg/edit?referrer=icons-landing-page)

## Author

- Logan Anglin: Electron Encryption [Github profile](https://github.com/logananglin98)

## About

Logan Anglin is the sole contributor to this project. Logan is fascinated with combining a passion for technology with critical thinking and analytical inquiry to tackle challenging problems. With skills in both IT and software engineering, they are exploring the intersection of Computer Science and Information Technology to create innovative solutions.

Growing up in the foothills of Appalachia, Logan takes pride in their roots in a resilient, hardworking community that shaped their diligence and work ethic. Beyond technology, they are a multi-instrumentalist musician with experience in composing, recording, and performing across various projects. In their free time, they enjoy reading, drawing, and gaming, embracing creativity in all its forms.

## Acknowledgments

- If you find code that you are going to use in YourProjectName, include author's name and URL here.
- all who inspired the idea and/or the code in YourProjectName
- other people you wish to acknowledge

- [ChatGPT - used to ask questions with answers not found at another site](https://openai.com/index/chatgpt/)

- [Fireship - Helpful Youtube Video about Electron](https://www.youtube.com/watch?v=3yqDxhR2XxE)

- [w3schools - Login HTML Page](https://www.w3schools.com/howto/howto_css_login_form.asp)

- [mdn web docs - Uploading a File in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)

- [Johnathan L, stack overflow - Generating random numbers using mathjs](https://stackoverflow.com/questions/50377048/how-can-i-import-math-module-using-nodejs)

- []

- [npmjs - Using the Crypto.js library](https://www.npmjs.com/package/crypto-js)

- [geeksforgeeks.com - Advanced Encryption Standard (AES) Functionality and History](https://www.geeksforgeeks.org/advanced-encryption-standard-aes/)

- [mdn web docs - Javascript Classes Tutorial](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

- David Crubaugh - David's project is very similar to mine and we bounced ideas off eachother in class. While I haven't copied his work in any way, some of the ideas I have had for this project were inspired by David's project.

## License (not required initially)

This project is licensed under the ??? License - see the wiki page (https://en.wikipedia.org/wiki/Software_license) for details