import json
import os
from googleapiclient.discovery import build # type: ignore
from googleapiclient.http import MediaFileUpload,MediaIoBaseUpload,MediaIoBaseDownload # type: ignore
from google.oauth2.service_account import Credentials # type: ignore
import io
from dotenv import load_dotenv # type: ignore

# Load environment variables from .env file
load_dotenv()

# Path to your service account JSON file
SERVICE_ACCOUNT_INFO = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

# Define the required scopes
SCOPES = ['https://www.googleapis.com/auth/drive.file']
FOLDERID =  "1Gx2CCfwsD2ED1RnmbYd1AWRBImY0_dGR"


def upload_json_to_drive(json_data, file_name):
    """Upload a JSON object to Google Drive using a service account."""
    # Authenticate using the service account
    creds = Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_INFO), scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    # Convert the JSON data to a bytes buffer
    json_bytes = json.dumps(json_data).encode('utf-8')
    file_like_object = io.BytesIO(json_bytes)

    # Metadata for the file to be uploaded
    file_metadata = {'name': file_name, 'mimeType': 'application/json'}
    if FOLDERID:
        file_metadata['parents'] = [FOLDERID]  # Specify the folder ID

    media = MediaIoBaseUpload(file_like_object, mimetype='application/json', resumable=True)

    # Upload the file
    uploaded_file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()

    # Print the ID of the uploaded file
    print(f"File uploaded successfully! File ID: {uploaded_file.get('id')}")

def download_json_from_drive(file_name):
    """Download a JSON file from Google Drive within a specific folder by its name and return it as a JSON object."""
    # Authenticate using the service account
    creds = Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_INFO), scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    try:
        # Search for the file by name and folder id (parents)
        query = f"name='{file_name}' and '{FOLDERID}' in parents"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])

        if not files:
            print(f"File with name '{file_name}' not found in folder '{FOLDERID}'.")
            return None  # Return None if file is not found

        # Get the first matching file
        file_id = files[0]['id']
        print(f"Found file '{file_name}' with ID: {file_id}")

        # Create a request to download the file
        request = service.files().get_media(fileId=file_id)
        fh = io.BytesIO()  # Create an in-memory byte stream
        downloader = MediaIoBaseDownload(fh, request)

        # Download the file in chunks
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}%.")

        # Once the file is downloaded, reset the pointer and parse the content as JSON
        fh.seek(0)  # Reset the pointer to the beginning of the byte stream
        json_data = json.load(fh)  # Parse the content as JSON
        print(f"File '{file_name}' downloaded and parsed as JSON successfully.")

        return json_data  # Return the JSON data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None  # Return None if an error occurs


def delete_file_from_drive(file_name):
    """Delete a file from Google Drive within a specific folder by its name."""
    # Authenticate using the service account
    creds = Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_INFO), scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    try:
        # Search for the file by name and folder id (parents)
        query = f"name='{file_name}' and '{FOLDERID}' in parents"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])

        if not files:
            print(f"File with name '{file_name}' not found in folder '{FOLDERID}'.")
            return

        # Get the first matching file
        file_id = files[0]['id']
        print(f"Found file '{file_name}' with ID: {file_id}")

        # Delete the file
        service.files().delete(fileId=file_id).execute()
        print(f"File '{file_name}' deleted successfully from folder '{FOLDERID}'.")

    except Exception as e:
        print(f"An error occurred: {e}")

def check_file_exists_in_drive(file_name):
    """Check if a file exists in a specific Google Drive folder by its name."""
    # Authenticate using the service account
    creds = Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_INFO), scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    try:
        # Search for the file by name and folder id (parents)
        query = f"name='{file_name}' and '{FOLDERID}' in parents"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])

        if files:
            print(f"File '{file_name}' found in folder '{FOLDERID}'.")
            return True  # Return True if file is found
        else:
            print(f"File '{file_name}' not found in folder '{FOLDERID}'.")
            return False  # Return False if file is not found

    except Exception as e:
        print(f"An error occurred: {e}")
        return False