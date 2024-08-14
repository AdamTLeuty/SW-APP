# Future Considerations

## Server image storage

For the moment, images are stored directly on the server, and their file path is stored within the SQLite database. The images, particularly from newer phones, can be quite large, and should probably be instead sent to an AWS storage bucket or some equivalent, and referred to by file URL.
