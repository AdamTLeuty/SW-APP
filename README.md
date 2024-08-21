# Smile Correct Club Patient Portal

## Tech Stack
### Client
- React Native / Expo
  - Axios (For connecting to the server)

### Server
- Golang
  - Gin (As the web framework)
- Sqlite (For storing user login details, and references to UGC images)
- BCrypt (For encrypting user passwords)
- Rclone (For sending user progress images and other UGC to Google Drive)

## Future considerations
For a non-comprehensive list of changes that should be made to improve the app, please see `FUTURE.md`

## Continued Maintenance
The server needs the rclone to be configured with a remote location named `remote`

Documentation for this can be found here:
-  [Rclone - Google Drive](https://rclone.org/drive/)
-  [Rclone - Remote setup](https://rclone.org/remote_setup/)

I have found that authorising on a local machine with a browser, then copying the `rclone.conf` file to the headless machine running the auth server, to get around Google's OAuth requirements.

## Known Issues

- When the custom accordion component is at the bottom of a ScrollView, the scrolling behaviour breaks on iOS
