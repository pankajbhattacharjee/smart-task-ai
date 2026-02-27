# Claude AI Assistant Guidelines

## Project Context
You are assisting with TaskFlow, a task management application with AI-powered features. The stack includes Flask backend, React frontend, and PostgreSQL.

## Coding Standards
- Python: Follow PEP 8, use type hints, docstrings for functions
- JavaScript: Use ES6+, functional components with hooks
- Naming: camelCase for JS, snake_case for Python, PascalCase for components
- Error handling: Always use try-catch, return meaningful error messages

## API Design Principles
- RESTful endpoints with proper HTTP methods
- JWT authentication for protected routes
- Consistent response format: { success: boolean, data?: any, error?: string }
- Version API endpoints (e.g., /api/v1/)

## Database Guidelines
- Use migrations for schema changes
- Index foreign keys and frequently queried columns
- Use transactions for multi-step operations
- Sanitize user inputs

## AI Integration
- Cache AI responses when possible
- Handle API failures gracefully
- Rate limit AI requests
- Provide fallback values when AI fails

## Security Considerations
- Never expose API keys in frontend
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Hash passwords with bcrypt

## Testing Requirements
- Unit tests for critical functions
- Integration tests for API endpoints
- Mock external services (AI API)
- Test error scenarios