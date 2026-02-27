import os
from datetime import datetime, timedelta
from openai import OpenAI
import re  # This should be at the top with other imports

class AIService:
    def __init__(self):
        # New OpenAI client initialization
        self.client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    
    def analyze_task_priority(self, title, description):
        """Use AI to analyze task priority based on content"""
        try:
            prompt = f"""
            Analyze this task and suggest a priority score from 1-5:
            Title: {title}
            Description: {description}
            
            Consider:
            - Urgency (time-sensitive)
            - Importance (business impact)
            - Complexity
            - Dependencies
            
            Return only the number (1-5) and a brief reason.
            """
            
            # Updated API call syntax
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a task prioritization assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.3
            )
            
            # Updated response access
            content = response.choices[0].message.content
            # Extract first number found
            numbers = re.findall(r'\d+', content)
            priority = int(numbers[0]) if numbers else 1
            return min(max(priority, 1), 5)  # Ensure within 1-5
            
        except Exception as e:
            print(f"Priority analysis failed: {e}")
            # Return default priority if AI fails
            return 3
    
    def suggest_deadline(self, title, description, priority):
        """Suggest a reasonable deadline based on task analysis"""
        try:
            prompt = f"""
            Based on this task, suggest how many days it would reasonably take:
            Title: {title}
            Description: {description}
            Priority: {priority}/5
            
            Return only a number (1-30) representing days.
            """
            
            # Updated API call syntax
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a project planning assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.3
            )
            
            # Updated response access
            content = response.choices[0].message.content
            numbers = re.findall(r'\d+', content)
            days = int(numbers[0]) if numbers else 7
            days = min(max(days, 1), 30)  # Ensure within 1-30
            
            suggested_date = datetime.now() + timedelta(days=days)
            return suggested_date
            
        except Exception as e:
            print(f"Deadline suggestion failed: {e}")
            # Return default deadline (7 days) if AI fails
            return datetime.now() + timedelta(days=7)