import json
from googleapiclient.discovery import build # type: ignore
from googleapiclient.http import MediaFileUpload,MediaIoBaseUpload,MediaIoBaseDownload # type: ignore
from google.oauth2.service_account import Credentials # type: ignore
import io

# Path to your service account JSON file
SERVICE_ACCOUNT_JSON = {
  "type": "service_account",
  "project_id": "gen-lang-client-0666379550",
  "private_key_id": "9c8c66c4d95ed17505bc737e6ac9e8f6a54e93b7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxHWrpameLTVPj\nrC/hz8aXJq2x0qFmQXt3U7yIrXdrGkiAKoW/BDbpyjRC8dZ5BnU+YJlZ0CzKkRYH\nsqMOPuUa2BLajnZPN8RlEEJ3KYC/E8J6OQNQVwoT0p++rvb/gL/CivIOYONP+r8l\nXF6ewWdTU57/odU1N6NQbvcnol1NWsUJ0bg36GQS7r89tk6o4+kZ1/1beINXX9LS\npqGFeXHfk5Yz61A2TbMNndhEF1dWJtRg/zVIzjPmwMdRSPc5RyYZVNAQAq+oiEHW\n63V+84lj7KBUS7Wl/fqwmLDtyYul7V3ZHROEYPUIY1uMYfwPgZhegWYzH3GXorSA\niOe/WERPAgMBAAECggEAB394saWDbsuKzkuueYEylcS4Jg18w2dJ5Z4PANkUG5qH\noqSv4A7Lfl2xXluS5dSTlMsAOdDFc88rNjYR6AGAsmMBwxYnC7OaQeJNjtMVk9uT\ncqWPOtJaF9+25AEg4TUpwWz8tgHBT91mUE0dDCbLhcXV7fEkZjFCvN+Wg/8Ck8Mt\nZakyTABxv/YRaF4rIK2mOj5CgsBD/rvAwzHJUYOTDMgXHLIxUqu5VbiCuG+QkyGb\nXUfXlWcXlLRPDLHm7gBwpH7iZxJBSKehURvCuMKe5QbIw/OR5OVtLYgU44ULDvIN\nHGSPVqiUWmQGeu2SPKz/WSBhehw0j7DrntdkF9KtoQKBgQD5pBoxOjoF9AZAzSDe\nvDc+67Q/TbMUw8KeLzh7vyMPtSFYlLM/Tiz1NkRNaZZ5hFdbvawUT3jI/wnylV27\nb7YEPE2FQvRTPJrZukGPbptMXvDo7cXGlymzqedCAGcNyZFjHtWQ3efaShNhMNOY\nz/yxgNvZyWk5icsq4kC/VJD0NwKBgQD3QbeIWQjXKTs6DSa1qL7j+dLAsLhGQT5O\nJP6J2dIq2ekVlABKlJbRQWMImWZcWbOF122meF6W5Tc9Hke7bDCUjnQ2NLrovjcF\nCS8R9o0KEJR9BgKPyNKCck+nQIygB25P1nVEcbnLO+DTjIn4chyjxdButN5UtPkJ\nhckryCNUqQKBgQCmfadqRWcFKWYyOZw+cFB4CkLAJVXV92kIjn2hKix8AVUn+qRB\nCCY7s+GBr3XHvVd1u93T/dyUUGOWAb/tjedak80vnyPLj5PGuc2XlzDDkl4hOtK4\nS4BoblvpTNNuAoyQCrRsVVKX5udd3m6Ab9Ybm9EEQquG0DtLcnG0KPYzqQKBgGxU\n5L7ek5sBu6thm7Y36vsjuA0o4HQXnd7LIqLvRr/zncYQhFgo5jNkvKlF3K1Vt+xK\nSQaI8piWcS9cFv2tF1PfXldpnwLeZGjWb0MljQH95bEpcvHggSsaPn//Lh3nY5Oj\nWNnWIhtDbuwBRWoPRTEUOJBouojOidZ8QXnnRGORAoGBANZHwBV1Bx49NsTsVaY/\nr9ARLeSD2+nlGD+O8U8diqronZw1cgbnoD86/KlwBt7GSUs21TRorfd24gIEAvjJ\np+sV0MMU4ObjlhaybkPifvVV5B7i9GdUksHZ4rF0mdGkQbdzLvDYH23iXUIkSwKM\nW0Yrb4Dqn5g77PHmcYDqaEDL\n-----END PRIVATE KEY-----\n",
  "client_email": "fintrack07@gen-lang-client-0666379550.iam.gserviceaccount.com",
  "client_id": "105728032729973567717",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/fintrack07%40gen-lang-client-0666379550.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


# Define the required scopes
SCOPES = ['https://www.googleapis.com/auth/drive.file']
FOLDERID =  "1Gx2CCfwsD2ED1RnmbYd1AWRBImY0_dGR"


def upload_json_to_drive(json_data, file_name):
    """Upload a JSON object to Google Drive using a service account."""
    # Authenticate using the service account
    creds = Credentials.from_service_account_file(json.loads(SERVICE_ACCOUNT_JSON), scopes=SCOPES)
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
    creds = Credentials.from_service_account_file(json.loads(SERVICE_ACCOUNT_JSON), scopes=SCOPES)
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
    creds = Credentials.from_service_account_file(json.loads(SERVICE_ACCOUNT_JSON), scopes=SCOPES)
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
    creds = Credentials.from_service_account_file(json.loads(SERVICE_ACCOUNT_JSON), scopes=SCOPES)
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