from datetime import datetime

def is_current_date_in_range(fromDate: str, toDate: str, currentDate: str) -> bool:
    # Parse the dates from string to datetime objects
    from_date = datetime.fromisoformat(fromDate.replace("Z", "+00:00"))  # handle 'Z' timezone
    to_date = datetime.fromisoformat(toDate.replace("Z", "+00:00"))  # handle 'Z' timezone
    current_date = datetime.fromisoformat(currentDate.replace("Z", "+00:00"))  # handle 'Z' timezone
    
    # Check if the current date is within the range
    return from_date <= current_date <= to_date