def load_context(file_path: str) -> str:
    """Loads context from a specified file path."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            context = file.read()
            print("Context loaded successfully.")
            return context
    except FileNotFoundError:
        print(f"Warning: Context file '{file_path}' not found.")
        return ""
    except IOError as e:
        print(f"Error reading context file '{file_path}': {str(e)}")
        return ""
