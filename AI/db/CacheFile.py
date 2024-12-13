import logging
from drive import download_json_from_drive, update_json_file_in_drive


def CheckStatus():
    try:
        data = download_json_from_drive("cache.json")
        return data['status']
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")
        return 'idel'
    
def SetStatusIdel():
    try:
        update_json_file_in_drive({"status":"idel"},"cache.json")
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")
        
def SetStatusRunning():
    try:
        update_json_file_in_drive({"status":"running"},"cache.json")
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")

def CheckStatusR():
    try:
        data = download_json_from_drive("cacheR.json")
        return data['status']
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")
        return 'idel'
    
def SetStatusIdelR():
    try:
        update_json_file_in_drive({"status":"idel"},"cacheR.json")
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")
        
def SetStatusRunningR():
    try:
        update_json_file_in_drive({"status":"running"},"cacheR.json")
    except Exception as e:
        logging.error(f"Error occurred : {str(e)}")