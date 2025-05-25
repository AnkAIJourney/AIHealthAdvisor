import openai
import os
import base64
from dotenv import load_dotenv
import pdfplumber

# Load environment variables
load_dotenv()

# Configure OpenAI
client = openai.AzureOpenAI(
                 api_key=os.getenv("OPENAI_API_KEY"),
                 azure_endpoint=os.getenv("AZURE_ENDPOINT"),
                 api_version=os.getenv("API_VERSION"),
                 azure_deployment=os.getenv("AZURE_DEPLOYMENT"),)

class HealthAdvisor:
    """Agent for analyzing blood marker reports and providing health recommendations."""
    
    def __init__(self):
        self.system_prompt = """You are a knowledgeable and empathetic health advisor who specializes in 
        interpreting blood test results and providing health recommendations in extremely simple language 
        that anyone without medical knowledge can understand."""
    
    def analyze(self, file):
        """
        Analyze blood markers and provide recommendations.
        
        Args:
            file: The uploaded PDF file object
            
        Returns:
            str: Analysis and recommendations
        """
        prompt = """As a compassionate and knowledgeable health advisor, please analyze the blood marker report 
        and provide insights in extremely simple, everyday language. Imagine you're explaining to someone with 
        no medical background. Avoid technical jargon, and when you must use a medical term, explain it immediately.
        
        Focus on:
        1. Identifying any concerning or out-of-range markers
        2. Explaining what these markers mean using simple analogies and everyday examples
        3. Suggesting specific lifestyle changes, including:
           - Recommended physical activities that are easy to understand and implement
           - Common, everyday foods to include or avoid (use familiar food names, not nutrients)
        
        Please structure your response in a friendly, conversational manner as if talking to a friend."""

        try:
          # Extract text from the PDF
            with pdfplumber.open(file) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""  # Extract text from each page
            
            if not text.strip():
                return "Error: No text could be extracted from the PDF. Please ensure the PDF contains readable text."
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {
                        "role": "user", 
                        "content": [
                            {
                                "type": "text",
                                "text": f"{prompt}\n\nBlood Marker Report:\n{text}",
                            },
                            {
                                "type": "text",
                                "text": prompt,
                            }
                        ]
                    }
                ],
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Error analyzing blood markers: {str(e)}"
