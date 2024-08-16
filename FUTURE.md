# Future Considerations

## Server image storage

### Image storage
For the moment, images are stored directly on the server, and their file path is stored within the SQLite database. The images, particularly from newer phones, can be quite large, and should probably be instead sent to an AWS storage bucket or some equivalent, and referred to by file URL.

### Server speed
The server currently used may not scale well, as the bandwidth is shared with other apps within the company. Further, there may not be enough storage for all of the images, and this may impact performance.
