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
SERVICE_ACCOUNT_INFO = '''{
  "type": "service_account",
  "project_id": "gen-lang-client-0666379550",
  "private_key_id": "b866dacce3ff8c97913318662b38d43b76c5ee4b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0AkIJXzdR+LHZ\nnrcGiukOSLqqEjhL0JVVnbkq/e9Riu9Q669NE6bJreATfDRyTH1WWK7UdkcrJRND\noHsP+pj8zfIbXb4Cw1fuOe/ODO7srAvXpqREZ2S0tgvdqmEBF6IDNdbVw7CVM5Eg\nYIFl4U0sAIjGgXsy38NoH9hYmQs1zuFMpFJ1OI4WZd+Pq+WlKZ3ZicOUqYVkIqqU\nxIxF11xC15bCK6IpMjN5rN/eD/DwerksWrgO7pRBKui5OF4G1sqVSkw7RGd4WUJl\nRfIUhHg08e37UqXKfgLIySLHOgNivf3/mlk4jmakUDHwasjmgWKb4RnZl1Sh5DQz\nGb/6WY+FAgMBAAECggEABrRi00iJnfL+ZNWliYfZAGAzG6yMDj7ZoRO71t8Yb9gV\n69Srddp6ht6EDxW8Olmg/XtWH7G8Gt5JpmYuzzyNQDVHhD9smVu/Ra9AwFL4/zW1\nRzX8vlN/i7+QF5SGAm1n6mix9MpSJGyERklx6GKI5k+qyIIAHbf55kHxY/NnWHyp\nJ3OdJ3mZC5eVp6JzB2AbcAYUX/Ty0QmYWBMxXszNbVDQOmlCti7AIAK/+05lCxJp\natr7GJrNBrHZsPxKMZh1S/S7v8Z0fb3t2p4X6IeHjZgUfPWVj/tEpLIK6BMX5k6m\nPB7WB8sfzPgrdRRlm6bzXsjdKeId9cjfq/dAiPXzYQKBgQDZk360X2EP0q49sMMf\n/XfS6JkMLEG+5Fk0mXnwAVkPvoM/IYgPNKeZKcjmjgWwrZwXGbkVo2nsIsB30iVc\n5DEyzngq7ocRCX3BtWY43sFmU5m1eAmr0s03c/wsmx+mkLwCjNUe37CGLNTEIg+Q\nfohr+zXfJ6OMeVLdNYE9P1Y5vQKBgQDTzF0Ia1dIBjHJLQe+20ddOmdJz0D+0Yvb\n9GsTMlT0Tfqd+aBqN5zsdEuXWnzyms/mNqqopq2zmmQbqAvaqIEAto/hRcvjJ5pq\n66iBCVqbCzpteHmwSTI/2euFoQnmX9iaxxUge1q4f+AQcO2NxPAmywOKHK+GTqeh\nXSUYeEL1aQKBgQCJOzaXnfEigcfUsUDhVIXXSU3/F4sAVBbPzl3Su4bpH0i48PVY\nYeWz/V7xzHJaVaY2C8tpkoCkp+atrKZUSLmfSgsRSRF39XyUSU4IYLerSt+QTf4L\nmhJF/6n2mIEGFhP/p8RkjMJSXsR0UOdwQ97X/MKl1eKaH4vcanrxnplMIQKBgFao\ntJwgR2sZ1b8JpLSrxexYXDCwE1jv5jjOLg2Bt47qZRPEMqWjMZryDofUJ3GgdFYu\noe81m7b0Aefq/0atUXM4P3Cd/UlpR95do+mAKUls87Ac7jV6DYxgnuRjOsi/CMJz\nmKpcrob1E3nGqvwpy1UkFcOp7wuWHTKCCQ6VDliZAoGAHZOYYdIZ2HPeKfxpV8kM\nIfjGEfRRRksV8BECDash1piPyoazbdJqYNJ4fI41FdlUqz7chZx7e+HPGxpMvMKi\n8KAwZuqZt34KfMzk9T9xvUXNJYk2Wx61xpKDkSxsyrTbEBms5ers7ClwJeaZgUwk\nVtxmkgNWQ1hjwE/SGf04TYE=\n-----END PRIVATE KEY-----\n",
  "client_email": "fintrack07@gen-lang-client-0666379550.iam.gserviceaccount.com",
  "client_id": "105728032729973567717",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/fintrack07%40gen-lang-client-0666379550.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}'''

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
    
def update_json_file_in_drive( updated_data,file_name):
    """
    Update an existing JSON file in Google Drive with new content.
    
    :param file_name: Name of the file in the specified folder to be updated.
    :param updated_data: The updated JSON content to write into the file.
    """
    # Authenticate using the service account
    creds = Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_INFO), scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    try:
        # Search for the file by name and folder ID (parents)
        query = f"name='{file_name}' and '{FOLDERID}' in parents"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])

        if not files:
            print(f"File '{file_name}' not found in folder '{FOLDERID}'.")
            return False  # Return False if the file is not found

        # Get the first matching file
        file_id = files[0]['id']
        print(f"Found file '{file_name}' with ID: {file_id}")

        # Save the updated JSON content to a bytes buffer
        json_bytes = json.dumps(updated_data).encode('utf-8')
        file_like_object = io.BytesIO(json_bytes)

        # Create a MediaIoBaseUpload object
        media = MediaIoBaseUpload(file_like_object, mimetype='application/json', resumable=True)

        # Update the file content on Google Drive
        updated_file = service.files().update(fileId=file_id, media_body=media).execute()
        print(f"File '{file_name}' updated successfully with new content.")
        
        return True  # Return True if the update is successful

    except Exception as e:
        print(f"An error occurred while updating the file: {e}")
        return False  # Return False if an error occurs
