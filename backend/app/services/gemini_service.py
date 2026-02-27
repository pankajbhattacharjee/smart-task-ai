import os
import re
from datetime import datetime, timedelta
from google import genai
from dotenv import load_dotenv
from pathlib import Path

# Load .env file at module level
load_dotenv()

class GeminiService:
    def __init__(self):
        # Try to get API key from multiple sources
        api_key = None
        
        # 1. Try from environment variable directly
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            print(f"✅ Found API key from environment variable")
        
        # 2. If not found, try reading .env file manually
        if not api_key:
            try:
                # Look for .env in the backend folder (3 levels up from this file)
                # File path: backend/app/services/gemini_service.py
                # Need to go up 3 levels to reach backend folder
                env_path = Path(__file__).parent.parent.parent / '.env'
                print(f"Looking for .env at: {env_path}")
                
                if env_path.exists():
                    print(f"✅ .env file found")
                    # Read file and clean any hidden characters
                    with open(env_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig removes BOM
                        for line in f:
                            line = line.strip()  # Remove whitespace and newlines
                            if line.startswith('GEMINI_API_KEY='):
                                # Extract everything after the equals sign
                                api_key = line.split('=', 1)[1].strip()
                                # Remove any quotes if present
                                api_key = api_key.strip('"').strip("'")
                                print(f"✅ Found API key in .env")
                                break
                else:
                    print(f"❌ .env file not found at {env_path}")
            except Exception as e:
                print(f"⚠️ Could not read .env file: {e}")
        
        # 3. Try from current directory as fallback
        if not api_key:
            try:
                env_path = Path.cwd() / '.env'
                print(f"Looking for .env in current directory: {env_path}")
                if env_path.exists():
                    with open(env_path, 'r', encoding='utf-8-sig') as f:
                        for line in f:
                            line = line.strip()
                            if line.startswith('GEMINI_API_KEY='):
                                api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
                                print(f"✅ Found API key in current directory")
                                break
            except Exception as e:
                print(f"⚠️ Could not read .env from cwd: {e}")
        
        # Initialize Gemini client if we have an API key
        if api_key:
            try:
                print(f"✅ API Key found (length: {len(api_key)})")
                # Initialize Gemini client
                self.client = genai.Client(api_key=api_key)
                self.model = "gemini-1.5-flash"
                print("✅ Gemini AI service initialized successfully")
                print(f"Using model: {self.model}")
            except Exception as e:
                print(f"⚠️ Gemini initialization failed: {e}")
                print(f"Error details: {str(e)}")
                self.client = None
        else:
            print("⚠️ No Gemini API key found. Using mock AI responses.")
            self.client = None
    
    def analyze_task_priority(self, title, description):
        """Use Gemini to analyze task priority from 1-5"""
        try:
            if not self.client:
                # Return mock data if no API key
                return self._mock_priority_analysis(title)
            
            prompt = f"""
            Analyze this task and suggest a priority score from 1-5:
            Title: {title}
            Description: {description if description else 'No description provided'}
            
            Consider:
            - Urgency (time-sensitive)
            - Importance (business impact)
            - Complexity
            - Dependencies
            
            Return only the number (1-5) and a brief reason.
            """
            
            # API call syntax for google-genai
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            
            # Extract first number found
            numbers = re.findall(r'\d+', response.text)
            priority = int(numbers[0]) if numbers else 3
            return min(max(priority, 1), 5)  # Ensure within 1-5
            
        except Exception as e:
            print(f"❌ Gemini priority analysis failed: {e}")
            return self._mock_priority_analysis(title)
    
    def suggest_deadline(self, title, description, priority):
        """Suggest a reasonable deadline based on task analysis"""
        try:
            if not self.client:
                # Return mock data if no API key
                return self._mock_deadline_suggestion(priority)
            
            prompt = f"""
            Based on this task, suggest how many days it would reasonably take:
            Title: {title}
            Description: {description if description else 'No description provided'}
            Priority: {priority}/5
            
            Return only a number (1-30) representing days.
            """
            
            # API call syntax for google-genai
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            
            numbers = re.findall(r'\d+', response.text)
            days = int(numbers[0]) if numbers else 7
            days = min(max(days, 1), 30)
            
            suggested_date = datetime.now() + timedelta(days=days)
            return suggested_date
            
        except Exception as e:
            print(f"❌ Gemini deadline suggestion failed: {e}")
            return self._mock_deadline_suggestion(priority)
    
    def _mock_priority_analysis(self, title):
        """Generate mock priority based on keywords in title"""
        title_lower = title.lower()
        if any(word in title_lower for word in ['urgent', 'asap', 'critical', 'emergency']):
            return 5
        elif any(word in title_lower for word in ['important', 'high', 'priority']):
            return 4
        elif any(word in title_lower for word in ['medium', 'normal']):
            return 3
        elif any(word in title_lower for word in ['low', 'minor', 'small']):
            return 2
        else:
            return 3
    
    def _mock_deadline_suggestion(self, priority):
        """Generate mock deadline based on priority"""
        # Higher priority = sooner deadline
        days_map = {1: 14, 2: 10, 3: 7, 4: 3, 5: 1}
        days = days_map.get(priority, 7)
        return datetime.now() + timedelta(days=days)