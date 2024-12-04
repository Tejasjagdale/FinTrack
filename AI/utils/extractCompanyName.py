import re

# Function to extract the company name from a single prompt
def extract_company_name(prompt):
    # Regular expression pattern to match the company name
    company_name_pattern = r"Company name is (.*?) and the CEO"
    match = re.search(company_name_pattern, prompt)
    if match:
        return match.group(1)  # Extract and return the company name
    else:
        return "Company name not found"  # Handle cases where the pattern isn't matched