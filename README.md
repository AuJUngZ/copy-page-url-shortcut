# Copy Page URL with Snackbar

A Chrome extension to quickly copy the current page URL using a keyboard shortcut, with a customizable snackbar notification.

## Features

- Copy the current tab's URL to clipboard with a shortcut (`Ctrl+Shift+Y` or `Cmd+Shift+Y` on Mac).
- Snackbar notification appears at your chosen screen position.
- Modern, Arc-style notification design.
- Simple popup UI for configuring notification position.

## Installation

1. Clone or download this repository.
2. Go to `chrome://extensions` in your browser.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this project folder.

## Usage

- Press the shortcut (`Ctrl+Shift+Y` or `Cmd+Shift+Y` on Mac) to copy the current page URL.
- A snackbar notification will confirm the action.
- Click the extension icon to open the popup and choose where notifications appear.

## Configuration

- Open the extension popup.
- Select your preferred notification position (top/bottom, left/center/right).
- Click **Save Configuration**.

## Permissions

- `scripting`, `activeTab`, `clipboardWrite`, `storage`: Required for copying URLs and showing notifications.

## Development

- `background.js`: Handles the shortcut and notification logic.
- `popup.html` / `popup.js`: UI for configuring notification position.
- `manifest.json`: Extension manifest.

---

MIT License.
