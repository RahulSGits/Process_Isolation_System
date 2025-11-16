# 🖥️ Process Isolation & OS Scheduling System

A comprehensive web-based simulation platform that visualizes Operating System concepts such as **process management**, **CPU scheduling algorithms**, **resource allocation**, and **deadlock detection** — all in real time.

🔗 **Live Demo:** https://isolation-sys.netlify.app/

---

## 🚀 Project Overview
This project is an interactive OS learning tool built entirely using frontend technologies. It simulates how an OS handles:

- Process creation & isolation  
- CPU scheduling  
- Memory usage  
- Resource allocation  
- Deadlock detection  
- Secure code execution  

---

## 🌟 Core Features

### **1. Process Management**
- Create, monitor, and control isolated processes  
- Real-time states: `Ready`, `Running`, `Waiting`, `Terminated`  
- Multi-language support: **Python, Java, C, HTML, CSS**  
- Metrics: CPU burst, memory usage, execution time  

### **2. CPU Scheduling Algorithms**
- **FIFO (First-In-First-Out)**  
- **SJF (Shortest Job First)**  
- **Round Robin (RR)**  
- **Priority Scheduling**  
- Interactive **Gantt Chart** visualization  

### **3. Real-Time Analytics**
- Live CPU and memory charts  
- Algorithm efficiency comparison  
- Turnaround & waiting time metrics  
- Context switch tracking  

### **4. Secure Code Sandbox**
- Isolated execution environment  
- Multi-language support  
- Resource limits + timeout safety  
- No system-level access  

### **5. Deadlock Management**
- Resource Allocation Graph (RAG)  
- Cycle detection  
- Deadlock prevention strategies  
- Recovery simulation  

### **6. Modern UI/UX**
- Dark & light theme  
- Smooth transitions  
- 100% responsive  
- Clean modern styling  

---

## 🛠 Technical Architecture

### **Frontend Stack**
- **HTML5**  
- **CSS3 (Grid, Flexbox, Variables)**  
- **JavaScript ES6+ (OOP architecture)**  
- **Chart.js**  
- **Font Awesome Icons**

### **Key Modules**
| Component | Description |
|----------|-------------|
| `ProcessManager` | Manages process lifecycle & states |
| `SchedulerAlgorithms` | Implements all scheduling algorithms |
| `CodeTemplates` | Multi-language code examples |
| `Theme.js` | Light/Dark mode switching |
| `Charts.js` | Real-time performance charts |

---

## 📊 Educational Purpose

### **Concepts Covered**
- Process lifecycle  
- CPU scheduling  
- Memory management  
- Resource allocation  
- Deadlocks  
- Performance metrics  

### **Learning Outcomes**
- Understand trade-offs between algorithms  
- Visualize execution flow  
- Measure turnaround & waiting time  
- Experience deadlock situations  
- Practice safe code execution  

---

## 📁 Project Structure

```plaintext
/ 
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── ProcessManager.js
│   ├── SchedulerAlgorithms.js
│   ├── CodeSandbox.js
│   ├── Theme.js
│   └── Charts.js
├── assets/
└── README.md
