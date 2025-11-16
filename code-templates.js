// Code Templates for Different Languages
const CodeTemplates = {
    PYTHON: `# Python Process Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate Fibonacci sequence
print("Fibonacci Sequence:")
for i in range(10):
    result = fibonacci(i)
    print(f"F({i}) = {result}")

# Process information
print("\\nProcess completed successfully!")`,

    JAVA: `// Java Process Example
public class ProcessExample {
    public static void main(String[] args) {
        System.out.println("Java Process Started");
        
        // Calculate factorial
        for(int i = 1; i <= 5; i++) {
            long factorial = calculateFactorial(i);
            System.out.println("Factorial of " + i + " = " + factorial);
        }
        
        System.out.println("Process execution completed!");
    }
    
    public static long calculateFactorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * calculateFactorial(n - 1);
    }
}`,

    C: `// C Process Example
#include <stdio.h>
#include <stdlib.h>

// Function to calculate Fibonacci number
int fibonacci(int n) {
    if (n <= 1)
        return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// Function to check prime number
int isPrime(int num) {
    if (num <= 1) return 0;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0)
            return 0;
    }
    return 1;
}

int main() {
    printf("C Process Execution Started\\n");
    
    // Calculate Fibonacci sequence
    printf("Fibonacci Sequence (first 10 numbers):\\n");
    for (int i = 0; i < 10; i++) {
        printf("F(%d) = %d\\n", i, fibonacci(i));
    }
    
    // Check prime numbers
    printf("\\nPrime numbers between 1 and 20:\\n");
    for (int i = 1; i <= 20; i++) {
        if (isPrime(i)) {
            printf("%d ", i);
        }
    }
    printf("\\n");
    
    printf("Process completed successfully!\\n");
    return 0;
}`,

    HTML: `<!DOCTYPE html>
<html>
<head>
    <title>Process Execution</title>
    <style>
        .process-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 10px;
            color: white;
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .process-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .process-content {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
        }
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #4CAF50;
            border-radius: 50%;
            margin-right: 10px;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="process-container">
        <div class="process-header">
            <h1>HTML Process Execution</h1>
            <p><span class="status-indicator"></span>Process Running</p>
        </div>
        <div class="process-content">
            <h3>Process Information:</h3>
            <ul>
                <li>Process ID: HTML_PROC_001</li>
                <li>Status: Executing</li>
                <li>Memory Usage: 128MB</li>
                <li>Execution Time: 150ms</li>
            </ul>
            <button onclick="showCompletion()">Complete Process</button>
        </div>
    </div>

    <script>
        function showCompletion() {
            alert('Process executed successfully!');
        }
    </script>
</body>
</html>`,

    CSS: `/* CSS Process Example */
.process-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 15px;
    color: white;
    font-family: 'Arial', sans-serif;
    margin: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.process-header {
    text-align: center;
    margin-bottom: 25px;
}

.process-title {
    font-size: 2.5em;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.process-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 1.1em;
}

.status-indicator {
    width: 12px;
    height: 12px;
    background: #4CAF50;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}

.process-content {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.metric-card {
    background: rgba(255, 255, 255, 0.15);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-5px);
}

.metric-value {
    font-size: 2em;
    font-weight: bold;
    margin: 10px 0;
}

.metric-label {
    font-size: 0.9em;
    opacity: 0.8;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    margin: 15px 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    width: 75%;
    animation: progress 2s ease-in-out;
}

@keyframes progress {
    from { width: 0%; }
    to { width: 75%; }
}`
};