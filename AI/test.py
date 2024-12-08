from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow # type: ignore
from google.auth.transport.requests import Request # type: ignore
import os
import pickle

# Define the scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_drive():
    """Authenticate the Google Drive API and return the service object."""
    creds = None
    # Load credentials from token.pickle if it exists
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If no credentials available or invalid, authenticate using the credentials.json
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)
    return service

def upload_file_to_drive(file_path, file_name):
    """Upload a file to Google Drive."""
    service = authenticate_drive()
    file_metadata = {'name': file_name}
    media = MediaFileUpload(file_path, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"File uploaded successfully! File ID: {file.get('id')}")

def download_file_from_drive(file_id, destination_path):
    """Download a file from Google Drive."""
    service = authenticate_drive()
    request = service.files().get_media(fileId=file_id)
    with open(destination_path, 'wb') as file:
        downloader = googleapiclient.http.MediaIoBaseDownload(file, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download progress: {int(status.progress() * 100)}%")
    print(f"File downloaded successfully to {destination_path}")

# Example usage
# Replace 'your_file_id' with the ID of the file you want to download
download_file_from_drive('your_file_id', 'downloaded_example.json')


# Example usage
if __name__ == "__main__":
    upload_file_to_drive("example.json", "uploaded_example.json")


