import google.generativeai as genai # type: ignore
import time

from utils.extractCompanyName import extract_company_name

# Configure the API key
genai.configure(api_key="AIzaSyCM9DoUyFbGbT6GfQ2Od-4cMXwaAMyIz8o")

# Create the model
generation_config = {
    "temperature": 0.8,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="tunedModels/perfectposneg-z01rs26mkxga",
    generation_config=generation_config,
)
#gemini-1.5-flash
#tunedModels/perfectlybalancedrange-6m6psleaqqko

def get_responses_for_prompts(prompts):
    """
    Calls the AI model for each prompt in the list and returns a list of responses.

    Args:
        prompts (list of str): List of prompts to be processed by the model.

    Returns:
        list of str: List of responses from the model.
    """
    chat_session = model.start_chat(history=[])
    responses = []

    for prompt in prompts:
        company_name = extract_company_name(prompt)
        try:
            response = chat_session.send_message(prompt)
            responses.append(response.text)
            time.sleep(5)
        except:
          print("An exception occurred for "+company_name)

    return responses
