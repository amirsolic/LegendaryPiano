

# Legendary Piano

Legendary Piano is an interactive 3D piano project built using **Three.js**, **Vite**, and **Tauri**. In this project, users can click on the piano keys to play the corresponding notes.

---

## Prerequisites

To run this project, you need to have the following installed on your system:

- Node.js
- pnpm (The package manager used for this project)
- Rust
- Tauri dependencies

To install the project dependencies:

```bash
pnpm install
```

To run the project in development mode:

```bash
pnpm start
```
---

## Tech Stack

This project uses the following technologies:

- **Tauri**: For creating the desktop application.
- **Vite**: For project management and building the frontend.
- **Three.js**: For the 3D environment and rendering the piano model.
- **JavaScript**: For the application logic.
- **HTML / CSS**: For the UI and loading screen.
- **Blender**: For creating the 3D piano model.

---

## 3D Model
The 3D piano model was created in **Blender** and exported as a `.glb` file for use in the project.

---

## Project Roadmap: Where to start?

If you want to understand how the project works, I recommend reviewing the files in this order:

### 1. `main.js`
This is the heart of the project. Almost all the logic is written here, including:
- Setting up the scene, camera, and renderer.
- Loading the 3D model and environment light.
- Identifying keys and handling mouse interactions.
- Playing sounds and running animations.
- Handling window resizing.

### 2. `assets` folder
This folder contains the core assets:
- The 3D piano model.
- The audio files for the notes.
- Textures and the HDR file.

### 3. `index.html`
This file contains the initial structure of the page, including the loading overlay.

---

## How it works (The Flow)

1. Set up the scene, camera, and renderer.
2. Load the HDR environment light.
3. Load the 3D piano model.
4. Filter out the interactive keys from the rest of the model's objects.
5. Capture user clicks using `Raycaster`.
6. Identify which key was clicked.
7. Trigger the sound and key animation.
8. Continuously render the scene inside the `animate()` loop.

---

## Key Functions

### `playNote(key)`
Triggered when the user clicks a key. It:
- Retrieves the note name.
- Triggers the key-press animation.
- Calls the function to play the sound.

### `playSound(note)`
Plays the audio for the specific note by locating the file in the `soundMap`.

### `animate()`
The main render loop. It updates the scene on every frame to show the model and animations smoothly.

### `loader.load(...)`
Responsible for loading the 3D model into the scene.

### `model.traverse(...)`
Iterates through all parts of the model to distinguish between the actual keys and the piano body (to ensure only keys are interactive).

### `raycaster.intersectObjects(...)`
Used to accurately detect when the user clicks on the 3D keys.

---

## Summary
The core idea is to load a 3D model, isolate the interactive components (keys), and map mouse clicks to audio and animation triggers to create a realistic piano experience.

---

## Credits
Thanks to everyone who views this project or provides feedback. 🌱

Also, this project was developed with the assistance of **AI** for various parts of the development process.

