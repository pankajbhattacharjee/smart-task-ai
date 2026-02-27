# TaskFlow Coding Standards

## Python (Backend)

### Style Guide
- Use 4 spaces for indentation
- Maximum line length: 88 characters
- Use single quotes for strings
- Sort imports: standard library, third-party, local
- Use meaningful variable names

### Function Documentation
```python
def function_name(param1: str, param2: int) -> dict:
    """
    Brief description of function.
    
    Args:
        param1: Description of param1
        param2: Description of param2
    
    Returns:
        Description of return value
    
    Raises:
        ValueError: When conditions are not met
    """