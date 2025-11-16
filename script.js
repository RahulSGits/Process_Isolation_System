// Process Management System
class ProcessManager {
    constructor() {
        this.processes = [];
        this.nextProcessId = 1;
        this.schedulerMetrics = {
            algorithm: 'ROUND_ROBIN',
            avgWaitingTime: 0,
            avgTurnaroundTime: 0,
            contextSwitches: 0,
            cpuUtilization: 0
        };
        this.deadlockEvents = [];
        this.isMonitoring = true;
        this.charts = {};
        this.chartData = {
            cpuMemory: { cpu: [], memory: [], labels: [] },
            algorithm: { fifo: 0, sjf: 0, rr: 0, priority: 0 },
            metricsAlgorithm: { fifo: [], sjf: [], rr: [], priority: [], labels: [] },
            waitingTime: { fifo: 0, sjf: 0, rr: 0, priority: 0 },
            turnaroundTime: { fifo: 0, sjf: 0, rr: 0, priority: 0 }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startMetricsUpdate();
        this.updateProcessLists();
        this.updateDashboard();
        this.initCharts();
        this.startRealTimeCharts();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Process creation
        document.getElementById('create-process').addEventListener('click', () => {
            this.createProcess();
        });

        // Process name input - allow Enter key to create process
        document.getElementById('process-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createProcess();
            }
        });

        // Scheduler algorithm selection
        document.querySelectorAll('.scheduler-algorithm').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.scheduler-algorithm').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Run simulation
        document.getElementById('run-simulation').addEventListener('click', () => {
            this.runSchedulerSimulation();
        });

        // Show algorithm steps
        document.getElementById('show-steps').addEventListener('click', () => {
            this.showAlgorithmSteps();
        });

        // Sandbox language selection
        document.querySelectorAll('.sandbox-language').forEach(btn => {
            btn.addEventListener('click', () => {
                const language = btn.getAttribute('data-language');
                this.changeSandboxLanguage(language);
            });
        });

        // Execute code
        document.getElementById('execute-code').addEventListener('click', () => {
            this.executeCode();
        });

        // Detect deadlock
        document.getElementById('detect-deadlock').addEventListener('click', () => {
            this.detectDeadlock();
        });

        // Toggle monitoring
        document.getElementById('toggle-monitoring').addEventListener('click', () => {
            this.toggleMonitoring();
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.style.background = 'var(--primary)';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.style.background = 'var(--primary)';
        }
        
        // Update charts for new theme
        this.updateChartsTheme();
    }

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabId).classList.add('active');

        // Update active tab button
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');

        // Update specific tab content if needed
        if (tabId === 'processes') {
            this.updateProcessList();
        } else if (tabId === 'scheduler') {
            this.updateSchedulerProcessList();
        } else if (tabId === 'sandbox') {
            this.updateSandboxProcessSelect();
        } else if (tabId === 'metrics') {
            this.updateMetricsProcessList();
        } else if (tabId === 'deadlock') {
            this.updateDeadlockDisplay();
        }
    }

    createProcess() {
        const nameInput = document.getElementById('process-name');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Please enter a process name');
            return;
        }

        const language = document.getElementById('process-language').value;
        const burstTime = parseInt(document.getElementById('burst-time').value) || 5;
        const priority = parseInt(document.getElementById('process-priority').value) || 5;

        const process = {
            id: `proc_${this.nextProcessId++}`,
            name: name,
            language: language,
            state: 'READY',
            cpuTime: 0,
            memoryUsage: Math.floor(Math.random() * 512) + 64,
            arrivalTime: this.processes.length * 2,
            burstTime: burstTime,
            priority: priority,
            allocatedResources: [],
            maxResources: [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 4) + 1]
        };

        this.processes.push(process);
        nameInput.value = '';
        
        this.updateProcessList();
        this.updateSchedulerProcessList();
        this.updateSandboxProcessSelect();
        this.updateMetricsProcessList();
        this.updateDashboard();
        this.updateDeadlockDisplay();
    }

    updateProcessState(processId, newState) {
        const process = this.processes.find(p => p.id === processId);
        if (process) {
            process.state = newState;
            this.updateProcessList();
            this.updateDashboard();
        }
    }

    terminateProcess(processId) {
        this.processes = this.processes.filter(p => p.id !== processId);
        this.updateProcessList();
        this.updateSchedulerProcessList();
        this.updateSandboxProcessSelect();
        this.updateMetricsProcessList();
        this.updateDashboard();
        this.updateDeadlockDisplay();
    }

    updateProcessList() {
        const processList = document.getElementById('process-list');
        const processCount = document.getElementById('process-count');
        const totalProcesses = document.getElementById('total-processes');
        const runningProcesses = document.getElementById('running-processes');
        const readyProcesses = document.getElementById('ready-processes');
        const totalProcessMemory = document.getElementById('total-process-memory');

        processCount.textContent = this.processes.length;
        totalProcesses.textContent = this.processes.length;
        runningProcesses.textContent = this.processes.filter(p => p.state === 'RUNNING').length;
        readyProcesses.textContent = this.processes.filter(p => p.state === 'READY').length;
        totalProcessMemory.textContent = this.processes.reduce((sum, p) => sum + p.memoryUsage, 0);

        if (this.processes.length === 0) {
            processList.innerHTML = `
                <div class="flex items-center justify-center py-12 border border-dashed border-border rounded-md">
                    <p class="text-muted">No processes created yet. Create one to get started.</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.processes.forEach(process => {
            let iconClass = '';
            let icon = '';
            
            if (process.state === 'RUNNING') {
                iconClass = 'running';
                icon = '<i class="fas fa-play"></i>';
            } else if (process.state === 'READY') {
                iconClass = 'ready';
                icon = '<i class="fas fa-redo"></i>';
            } else if (process.state === 'WAITING') {
                iconClass = 'waiting';
                icon = '<i class="fas fa-pause"></i>';
            } else {
                iconClass = 'terminated';
                icon = '<i class="fas fa-stop"></i>';
            }

            let actionButtons = '';
            if (process.state === 'READY') {
                actionButtons = `
                    <button class="btn btn-outline btn-sm" onclick="processManager.updateProcessState('${process.id}', 'RUNNING')">
                        <i class="fas fa-play"></i> Run
                    </button>
                `;
            } else if (process.state === 'RUNNING') {
                actionButtons = `
                    <button class="btn btn-outline btn-sm" onclick="processManager.updateProcessState('${process.id}', 'WAITING')">
                        <i class="fas fa-pause"></i> Pause
                    </button>
                `;
            }
            
            actionButtons += `
                <button class="btn btn-outline btn-sm" onclick="processManager.terminateProcess('${process.id}')">
                    <i class="fas fa-trash"></i> Terminate
                </button>
            `;

            html += `
                <div class="process-item">
                    <div class="process-header">
                        <div class="process-icon ${iconClass}">
                            ${icon}
                        </div>
                        <div class="process-info">
                            <div class="process-name">${process.name}</div>
                            <div class="process-id">ID: ${process.id}</div>
                        </div>
                    </div>
                    <div class="process-badges">
                        <div class="badge ${process.state === 'RUNNING' ? 'badge-accent' : process.state === 'READY' ? 'badge-primary' : process.state === 'WAITING' ? 'badge-warning' : 'badge-muted'}">
                            ${process.state}
                        </div>
                        <div class="badge badge-outline">${process.language}</div>
                        <div class="badge badge-outline">Priority: ${process.priority}</div>
                    </div>
                    <div class="process-details">
                        <span>CPU: ${process.cpuTime}ms</span>
                        <span>Mem: ${process.memoryUsage}MB</span>
                        <span>Burst: ${process.burstTime}ms</span>
                        <span>Arrival: ${process.arrivalTime}ms</span>
                    </div>
                    <div class="process-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
        });

        processList.innerHTML = html;
    }

    updateSchedulerProcessList() {
        const schedulerProcessList = document.getElementById('scheduler-process-list');
        
        if (this.processes.length === 0) {
            schedulerProcessList.innerHTML = `
                <div class="col-span-2 flex items-center justify-center py-8 border border-dashed border-border rounded-md">
                    <p class="text-muted">No processes available for scheduling. Create processes in the Processes tab.</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.processes.forEach(process => {
            html += `
                <div class="bg-muted/50 rounded-md p-4">
                    <p class="text-sm font-medium">${process.name} (${process.id})</p>
                    <div class="text-xs text-muted mt-2 space-y-1">
                        <p>Burst Time: ${process.burstTime}ms</p>
                        <p>Priority: ${process.priority}</p>
                        <p>Arrival Time: ${process.arrivalTime}ms</p>
                        <p>Max Resources: [${process.maxResources.join(', ')}]</p>
                    </div>
                </div>
            `;
        });

        schedulerProcessList.innerHTML = html;
    }

    updateSandboxProcessSelect() {
        const sandboxProcessSelect = document.getElementById('sandbox-process-select');
        
        // Clear existing options except the first one
        while (sandboxProcessSelect.children.length > 1) {
            sandboxProcessSelect.removeChild(sandboxProcessSelect.lastChild);
        }
        
        // Add process options
        this.processes.forEach(process => {
            const option = document.createElement('option');
            option.value = process.id;
            option.textContent = `${process.name} (${process.language})`;
            sandboxProcessSelect.appendChild(option);
        });
    }

    updateMetricsProcessList() {
        const metricsProcessList = document.getElementById('metrics-process-list');
        
        if (this.processes.length === 0) {
            metricsProcessList.innerHTML = `
                <div class="flex items-center justify-center py-12 border border-dashed border-border rounded-md">
                    <p class="text-muted">No processes created yet. Create processes in the Processes tab.</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.processes.forEach(process => {
            const waitTime = Math.max(0, process.arrivalTime + process.burstTime - process.cpuTime);
            const turnaroundTime = process.cpuTime + waitTime;
            
            html += `
                <div class="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="font-semibold">${process.name}</p>
                            <p class="text-xs text-muted">${process.id}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <div class="bg-muted/50 rounded p-2">
                            <p class="text-xs text-muted">CPU Time</p>
                            <p class="text-sm font-semibold text-primary">${process.cpuTime}ms</p>
                        </div>
                        <div class="bg-muted/50 rounded p-2">
                            <p class="text-xs text-muted">Wait Time</p>
                            <p class="text-sm font-semibold text-secondary">${waitTime}ms</p>
                        </div>
                        <div class="bg-muted/50 rounded p-2">
                            <p class="text-xs text-muted">Turnaround</p>
                            <p class="text-sm font-semibold text-accent">${turnaroundTime}ms</p>
                        </div>
                    </div>
                </div>
            `;
        });

        metricsProcessList.innerHTML = html;
    }

    updateDashboard() {
        // Update active processes count
        document.getElementById('active-processes-count').textContent = this.processes.length;
        document.getElementById('dashboard-process-count').textContent = this.processes.length;
        
        // Calculate CPU utilization
        const runningProcesses = this.processes.filter(p => p.state === 'RUNNING');
        const totalCpuTime = this.processes.reduce((sum, p) => sum + p.cpuTime, 0);
        const cpuUtilization = this.processes.length > 0 
            ? Math.min((runningProcesses.length / this.processes.length) * 100 + Math.random() * 20, 100)
            : 0;
        
        document.getElementById('cpu-utilization').textContent = `${cpuUtilization.toFixed(1)}%`;
        
        // Update total memory
        const totalMemory = this.processes.reduce((sum, p) => sum + p.memoryUsage, 0);
        document.getElementById('total-memory').textContent = `${totalMemory}MB`;
        
        // Update average turnaround time
        const avgTurnaroundTime = this.processes.length > 0 
            ? totalCpuTime / this.processes.length 
            : 0;
        document.getElementById('avg-turnaround').textContent = `${avgTurnaroundTime.toFixed(2)}ms`;
        
        // Update metrics if we have scheduler data
        if (this.schedulerMetrics.avgTurnaroundTime > 0) {
            document.getElementById('cpu-source').textContent = `From ${this.schedulerMetrics.algorithm}`;
            document.getElementById('avg-turnaround-time').textContent = `${this.schedulerMetrics.avgTurnaroundTime.toFixed(2)}ms`;
            document.getElementById('avg-waiting-time').textContent = `${this.schedulerMetrics.avgWaitingTime.toFixed(2)}ms`;
            document.getElementById('context-switches').textContent = this.schedulerMetrics.contextSwitches;
            document.getElementById('metrics-description').textContent = `${this.schedulerMetrics.algorithm} Algorithm Performance`;
        } else {
            document.getElementById('avg-turnaround-time').textContent = `${avgTurnaroundTime.toFixed(2)}ms`;
            document.getElementById('avg-waiting-time').textContent = '0ms';
            document.getElementById('context-switches').textContent = runningProcesses.length * 10;
        }
    }

    startMetricsUpdate() {
        // Update CPU time for running processes every 500ms
        setInterval(() => {
            this.processes.forEach(process => {
                if (process.state === 'RUNNING') {
                    process.cpuTime += 10;
                }
            });
            
            this.updateProcessList();
            this.updateDashboard();
            this.updateMetricsProcessList();
        }, 500);
    }

    startRealTimeCharts() {
        // Update charts every second with real-time data
        setInterval(() => {
            this.updateRealTimeChartData();
            this.updateCharts();
        }, 1000);
    }

    updateRealTimeChartData() {
        const now = new Date();
        const timeLabel = now.getMinutes() + ':' + now.getSeconds();
        
        // Update CPU & Memory data
        const runningProcesses = this.processes.filter(p => p.state === 'RUNNING').length;
        const totalMemory = this.processes.reduce((sum, p) => sum + p.memoryUsage, 0);
        
        this.chartData.cpuMemory.cpu.push(Math.min(runningProcesses * 15 + Math.random() * 10, 100));
        this.chartData.cpuMemory.memory.push(totalMemory / 10);
        this.chartData.cpuMemory.labels.push(timeLabel);
        
        // Keep only last 10 data points
        if (this.chartData.cpuMemory.cpu.length > 10) {
            this.chartData.cpuMemory.cpu.shift();
            this.chartData.cpuMemory.memory.shift();
            this.chartData.cpuMemory.labels.shift();
        }
        
        // Update algorithm performance data
        if (this.chartData.metricsAlgorithm.labels.length < 5) {
            this.chartData.metricsAlgorithm.labels.push(`Run ${this.chartData.metricsAlgorithm.labels.length + 1}`);
            this.chartData.metricsAlgorithm.fifo.push(Math.random() * 50 + 20);
            this.chartData.metricsAlgorithm.sjf.push(Math.random() * 40 + 15);
            this.chartData.metricsAlgorithm.rr.push(Math.random() * 60 + 25);
            this.chartData.metricsAlgorithm.priority.push(Math.random() * 45 + 18);
        }
    }

    runSchedulerSimulation() {
        if (this.processes.length === 0) {
            alert('Please create processes in the Processes tab first');
            return;
        }

        const algorithmBtn = document.querySelector('.scheduler-algorithm.active');
        const algorithm = algorithmBtn.getAttribute('data-algorithm');
        
        // Show simulation results
        document.getElementById('simulation-results').classList.remove('hidden');
        document.getElementById('selected-algorithm').textContent = algorithm;
        
        // Run simulation based on algorithm
        let result;
        switch (algorithm) {
            case 'FIFO':
                result = SchedulerAlgorithms.runFIFO(this.processes);
                break;
            case 'SJF':
                result = SchedulerAlgorithms.runSJF(this.processes);
                break;
            case 'ROUND_ROBIN':
                result = SchedulerAlgorithms.runRoundRobin(this.processes);
                break;
            case 'PRIORITY':
                result = SchedulerAlgorithms.runPriority(this.processes);
                break;
            default:
                result = SchedulerAlgorithms.runRoundRobin(this.processes);
        }
        
        // Update metrics
        this.schedulerMetrics = {
            algorithm: algorithm,
            avgWaitingTime: result.metrics.avgWaitingTime,
            avgTurnaroundTime: result.metrics.avgTurnaroundTime,
            contextSwitches: result.metrics.contextSwitches,
            cpuUtilization: result.metrics.cpuUtilization
        };
        
        // Update algorithm performance data
        this.chartData.algorithm[algorithm.toLowerCase()] = result.metrics.avgTurnaroundTime;
        this.chartData.waitingTime[algorithm.toLowerCase()] = result.metrics.avgWaitingTime;
        this.chartData.turnaroundTime[algorithm.toLowerCase()] = result.metrics.avgTurnaroundTime;
        
        // Update UI with results
        document.getElementById('sim-avg-waiting').textContent = `${result.metrics.avgWaitingTime.toFixed(2)}ms`;
        document.getElementById('sim-avg-turnaround').textContent = `${result.metrics.avgTurnaroundTime.toFixed(2)}ms`;
        document.getElementById('sim-context-switches').textContent = result.metrics.contextSwitches;
        document.getElementById('sim-cpu-utilization').textContent = `${result.metrics.cpuUtilization}%`;
        
        // Render Gantt chart
        this.renderGanttChart(result.schedule);
        
        // Update dashboard with new metrics
        this.updateDashboard();
        this.updateCharts();
    }

    showAlgorithmSteps() {
        if (this.processes.length === 0) {
            alert('Please create processes in the Processes tab first');
            return;
        }

        const algorithmBtn = document.querySelector('.scheduler-algorithm.active');
        const algorithm = algorithmBtn.getAttribute('data-algorithm');
        
        document.getElementById('algorithm-steps-container').classList.remove('hidden');
        document.getElementById('steps-algorithm-name').textContent = algorithm;
        
        // Generate algorithm steps
        const stepsContainer = document.getElementById('algorithm-steps');
        stepsContainer.innerHTML = '';
        
        let steps = [];
        let cCode = '';
        
        switch (algorithm) {
            case 'FIFO':
                steps = SchedulerAlgorithms.generateFIFOSteps(this.processes);
                cCode = SchedulerCCode.FIFO;
                break;
            case 'SJF':
                steps = SchedulerAlgorithms.generateSJFSteps(this.processes);
                cCode = SchedulerCCode.SJF;
                break;
            case 'ROUND_ROBIN':
                steps = SchedulerAlgorithms.generateRRSteps(this.processes);
                cCode = SchedulerCCode.RoundRobin;
                break;
            case 'PRIORITY':
                steps = SchedulerAlgorithms.generatePrioritySteps(this.processes);
                cCode = SchedulerCCode.Priority;
                break;
        }
        
        // Add C code step
        steps.push('C Implementation Code:');
        
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            
            if (step === 'C Implementation Code:') {
                stepElement.innerHTML = `<span class="font-semibold">Step ${index + 1}:</span> ${step}`;
                const codeElement = document.createElement('pre');
                codeElement.className = 'bg-muted/50 p-3 rounded-md mt-2 text-xs font-mono overflow-x-auto';
                codeElement.textContent = cCode;
                stepElement.appendChild(codeElement);
            } else {
                stepElement.innerHTML = `<span class="font-semibold">Step ${index + 1}:</span> ${step}`;
            }
            
            stepsContainer.appendChild(stepElement);
        });
    }

    renderGanttChart(schedule) {
        const ganttChart = document.getElementById('gantt-chart');
        ganttChart.innerHTML = '';
        
        if (schedule.length === 0) {
            ganttChart.innerHTML = '<p class="text-muted text-center py-4">No schedule data available</p>';
            return;
        }
        
        // Find the maximum time to scale the chart
        const maxTime = Math.max(...schedule.map(s => s.startTime + s.duration));
        const scale = 100 / maxTime;
        
        schedule.forEach(item => {
            const row = document.createElement('div');
            row.className = 'gantt-row';
            
            const label = document.createElement('div');
            label.className = 'gantt-label';
            label.textContent = item.processName;
            
            const barContainer = document.createElement('div');
            barContainer.className = 'gantt-bar-container';
            
            const bar = document.createElement('div');
            bar.className = `gantt-bar ${item.algorithm.toLowerCase()}`;
            bar.style.left = `${item.startTime * scale}%`;
            bar.style.width = `${item.duration * scale}%`;
            bar.textContent = `[${item.startTime}-${item.startTime + item.duration}]`;
            
            barContainer.appendChild(bar);
            row.appendChild(label);
            row.appendChild(barContainer);
            ganttChart.appendChild(row);
        });
    }

    changeSandboxLanguage(language) {
        // Update active language button
        document.querySelectorAll('.sandbox-language').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.sandbox-language[data-language="${language}"]`).classList.add('active');
        
        // Update language badge
        document.getElementById('sandbox-language-badge').textContent = language;
        
        // Update code template based on language
        document.getElementById('code-input').value = CodeTemplates[language] || '';
    }

    executeCode() {
        const code = document.getElementById('code-input').value;
        const language = document.querySelector('.sandbox-language.active').getAttribute('data-language');
        const selectedProcessId = document.getElementById('sandbox-process-select').value;
        
        // Show execution result section
        document.getElementById('execution-result').classList.remove('hidden');
        
        // Simulate execution
        const executionTime = Math.floor(Math.random() * 100) + 50;
        let output = '';
        let error = '';
        let status = 'success';
        
        // Simple simulation based on language
        if (language === 'PYTHON') {
            output = 'F(0) = 0\nF(1) = 1\nF(2) = 1\nF(3) = 2\nF(4) = 3';
        } else if (language === 'JAVA') {
            output = 'Java Process Started\nIteration: 0\nIteration: 1\nIteration: 2\nIteration: 3\nIteration: 4';
        } else if (language === 'C') {
            output = 'C Process Started\nF(0) = 0\nF(1) = 1\nF(2) = 1\nF(3) = 2\nF(4) = 3';
        } else if (language === 'HTML') {
            output = '<div class="process-container">\n  <h1>HTML Process</h1>\n  <p>Rendering in isolated context</p>\n</div>';
        } else if (language === 'CSS') {
            output = '.process-container {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 20px;\n  border-radius: 8px;\n  color: white;\n}';
        }
        
        // Randomly simulate an error 10% of the time
        if (Math.random() < 0.1) {
            status = 'error';
            error = 'SyntaxError: Invalid syntax on line 3';
            output = '';
        }
        
        // Update execution result UI
        document.getElementById('execution-output').textContent = output || '(No output)';
        document.getElementById('execution-time').textContent = `${executionTime}ms`;
        
        if (status === 'success') {
            document.getElementById('execution-status-badge').className = 'badge badge-accent';
            document.getElementById('execution-status-badge').innerHTML = '<i class="fas fa-check-circle"></i> Success';
            document.getElementById('execution-error').classList.add('hidden');
        } else {
            document.getElementById('execution-status-badge').className = 'badge badge-destructive';
            document.getElementById('execution-status-badge').innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
            document.getElementById('execution-error').classList.remove('hidden');
            document.getElementById('execution-error').querySelector('div').textContent = error;
        }
        
        // Update process CPU time if a process is selected
        if (selectedProcessId) {
            const process = this.processes.find(p => p.id === selectedProcessId);
            if (process) {
                process.cpuTime += executionTime;
                this.updateProcessList();
                this.updateDashboard();
            }
        }
    }

    detectDeadlock() {
        if (this.processes.length === 0) {
            document.getElementById('no-processes-message').classList.remove('hidden');
            return;
        }
        
        document.getElementById('no-processes-message').classList.add('hidden');
        
        // Generate a mock deadlock event
        const involvedProcesses = this.processes.slice(0, Math.min(3, this.processes.length)).map(p => p.id);
        const resources = ['Resource1', 'Resource2', 'Resource3'];
        
        const event = {
            id: `deadlock_${Date.now()}`,
            timestamp: Date.now(),
            processesInvolved: involvedProcesses.length > 0 ? involvedProcesses : ['P1', 'P2', 'P3'],
            resources: resources,
            resolved: false,
        };
        
        this.deadlockEvents.unshift(event);
        this.updateDeadlockDisplay();
    }

    toggleMonitoring() {
        this.isMonitoring = !this.isMonitoring;
        const button = document.getElementById('toggle-monitoring');
        
        if (this.isMonitoring) {
            button.innerHTML = '<i class="fas fa-circle"></i> Monitoring Active';
            button.classList.add('btn-accent');
        } else {
            button.innerHTML = '<i class="far fa-circle"></i> Monitoring Paused';
            button.classList.remove('btn-accent');
        }
    }

    updateDeadlockDisplay() {
        // Update resource allocation graph
        this.updateResourceAllocationGraph();
        
        // Update deadlock events list
        this.updateDeadlockEventsList();
        
        // Update statistics
        document.getElementById('total-deadlock-events').textContent = this.deadlockEvents.length;
        document.getElementById('resolved-deadlock-events').textContent = this.deadlockEvents.filter(e => e.resolved).length;
        document.getElementById('active-deadlock-events').textContent = this.deadlockEvents.filter(e => !e.resolved).length;
        document.getElementById('deadlock-processes-tracked').textContent = this.processes.length;
        
        // Show/hide deadlock events section
        if (this.deadlockEvents.length > 0) {
            document.getElementById('deadlock-events').classList.remove('hidden');
        } else {
            document.getElementById('deadlock-events').classList.add('hidden');
        }
        
        // Show/hide no processes message
        if (this.processes.length === 0) {
            document.getElementById('no-processes-message').classList.remove('hidden');
        } else {
            document.getElementById('no-processes-message').classList.add('hidden');
        }
    }

    updateResourceAllocationGraph() {
        const graphContainer = document.getElementById('resource-allocation-graph');
        
        if (this.processes.length === 0) {
            graphContainer.innerHTML = '<p class="text-muted-foreground text-sm">No resource allocations to display</p>';
            return;
        }
        
        // Generate mock resource allocations
        const resourceAllocations = this.processes.map((proc, idx) => {
            const nextIdx = (idx + 1) % this.processes.length;
            return {
                processId: proc.id,
                resources: [
                    { id: `Resource_${proc.priority}`, amount: Math.ceil(proc.memoryUsage / 10) || 1 },
                ],
                waitingFor: [
                    { id: `Resource_${this.processes[nextIdx].priority}`, amount: Math.ceil(this.processes[nextIdx].memoryUsage / 10) || 1 },
                ],
            };
        });
        
        let html = '';
        resourceAllocations.forEach((alloc, idx) => {
            const resources = alloc.resources || [];
            const waitingFor = alloc.waitingFor || [];
            
            html += `
                <div class="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <p class="font-semibold">${alloc.processId}</p>
                        <i class="fas fa-exclamation-triangle text-chart-4"></i>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p class="text-muted-foreground mb-1">Holding:</p>
                            <div class="space-y-1">
                                ${resources.length > 0 ? 
                                    resources.map(res => `
                                        <div class="badge badge-outline bg-primary/20 text-primary">
                                            ${res.id} (${res.amount})
                                        </div>
                                    `).join('') : 
                                    '<p class="text-muted-foreground text-xs">None</p>'
                                }
                            </div>
                        </div>
                        <div>
                            <p class="text-muted-foreground mb-1">Waiting for:</p>
                            <div class="space-y-1">
                                ${waitingFor.length > 0 ? 
                                    waitingFor.map(res => `
                                        <div class="badge badge-outline bg-destructive/20 text-destructive">
                                            ${res.id} (${res.amount})
                                        </div>
                                    `).join('') : 
                                    '<p class="text-muted-foreground text-xs">None</p>'
                                }
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                        ${idx < resourceAllocations.length - 1 ? 
                            `<p>→ Waits for ${resourceAllocations[(idx + 1) % resourceAllocations.length].processId}</p>` : 
                            '<p class="text-destructive font-semibold">→ CYCLE DETECTED!</p>'
                        }
                    </div>
                </div>
            `;
        });
        
        graphContainer.innerHTML = html;
    }

    updateDeadlockEventsList() {
        const eventsList = document.getElementById('deadlock-events-list');
        
        if (this.deadlockEvents.length === 0) {
            eventsList.innerHTML = '<p class="text-muted text-center py-4">No deadlock events detected</p>';
            return;
        }
        
        let html = '';
        this.deadlockEvents.forEach((event, idx) => {
            html += `
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-border rounded-lg transition-all ${
                    event.resolved ? 'bg-accent/5 border-accent/30' : 'bg-destructive/5 border-destructive/30'
                }">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            ${event.resolved ? 
                                '<i class="fas fa-check-circle text-accent"></i>' : 
                                '<i class="fas fa-exclamation-circle text-destructive"></i>'
                            }
                            <p class="font-semibold">
                                Deadlock #${this.deadlockEvents.length - idx}: ${event.processesInvolved.join(' ↔ ')}
                            </p>
                        </div>
                        <div class="text-xs text-muted-foreground mb-2">
                            Resources involved: ${event.resources.join(', ')} • ${new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                        ${event.resolutionMethod ? `
                            <div class="badge badge-outline bg-accent/20 text-accent text-xs">
                                Resolution: ${event.resolutionMethod}
                            </div>
                        ` : ''}
                    </div>
                    ${!event.resolved ? `
                        <div class="flex gap-2 flex-wrap">
                            <button class="btn btn-outline btn-sm" onclick="processManager.resolveDeadlock('${event.id}', 'Process Termination')">
                                Process Termination
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="processManager.resolveDeadlock('${event.id}', 'Resource Preemption')">
                                Resource Preemption
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="processManager.resolveDeadlock('${event.id}', 'Safe State Rollback')">
                                Safe State Rollback
                            </button>
                        </div>
                    ` : `
                        <div class="badge badge-accent flex items-center gap-1 whitespace-nowrap">
                            <i class="fas fa-check-circle"></i> Resolved
                        </div>
                    `}
                </div>
            `;
        });
        
        eventsList.innerHTML = html;
    }

    resolveDeadlock(eventId, method) {
        const event = this.deadlockEvents.find(e => e.id === eventId);
        if (event) {
            event.resolved = true;
            event.resolutionMethod = method;
            this.updateDeadlockDisplay();
        }
    }

    updateProcessLists() {
        this.updateProcessList();
        this.updateSchedulerProcessList();
        this.updateSandboxProcessSelect();
        this.updateMetricsProcessList();
    }

    initCharts() {
        this.updateChartsTheme();
    }

    updateChartsTheme() {
        const isDark = !document.documentElement.hasAttribute('data-theme');
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#f0f0f0' : '#1e293b';

        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });

        // CPU & Memory Timeline Chart
        const cpuMemoryCtx = document.getElementById('cpu-memory-chart').getContext('2d');
        this.charts.cpuMemory = new Chart(cpuMemoryCtx, {
            type: 'line',
            data: {
                labels: this.chartData.cpuMemory.labels,
                datasets: [
                    {
                        label: 'CPU Usage (%)',
                        data: this.chartData.cpuMemory.cpu,
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Memory Usage (MB)',
                        data: this.chartData.cpuMemory.memory,
                        borderColor: 'rgb(56, 189, 248)',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'System Resource Usage Over Time',
                        color: textColor,
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor },
                        title: {
                            display: true,
                            text: 'Usage',
                            color: textColor
                        }
                    }
                }
            }
        });

        // Algorithm Performance Chart
        const algorithmCtx = document.getElementById('algorithm-chart').getContext('2d');
        this.charts.algorithm = new Chart(algorithmCtx, {
            type: 'bar',
            data: {
                labels: ['FIFO', 'SJF', 'Round Robin', 'Priority'],
                datasets: [
                    {
                        label: 'Avg Turnaround Time (ms)',
                        data: [
                            this.chartData.algorithm.fifo,
                            this.chartData.algorithm.sjf,
                            this.chartData.algorithm.rr,
                            this.chartData.algorithm.priority
                        ],
                        backgroundColor: [
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(56, 189, 248, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)'
                        ],
                        borderColor: [
                            'rgb(139, 92, 246)',
                            'rgb(56, 189, 248)',
                            'rgb(16, 185, 129)',
                            'rgb(245, 158, 11)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'Algorithm Performance Comparison',
                        color: textColor,
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor },
                        title: {
                            display: true,
                            text: 'Turnaround Time (ms)',
                            color: textColor
                        }
                    }
                }
            }
        });

        // Metrics Algorithm Chart
        const metricsAlgorithmCtx = document.getElementById('metrics-algorithm-chart').getContext('2d');
        this.charts.metricsAlgorithm = new Chart(metricsAlgorithmCtx, {
            type: 'line',
            data: {
                labels: this.chartData.metricsAlgorithm.labels,
                datasets: [
                    {
                        label: 'FIFO',
                        data: this.chartData.metricsAlgorithm.fifo,
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 2
                    },
                    {
                        label: 'SJF',
                        data: this.chartData.metricsAlgorithm.sjf,
                        borderColor: 'rgb(56, 189, 248)',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 2
                    },
                    {
                        label: 'Round Robin',
                        data: this.chartData.metricsAlgorithm.rr,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'Algorithm Performance Over Time',
                        color: textColor,
                        font: { size: 16 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor },
                        title: {
                            display: true,
                            text: 'Waiting Time (ms)',
                            color: textColor
                        }
                    }
                }
            }
        });

        // Waiting Time Chart
        const waitingTimeCtx = document.getElementById('waiting-time-chart').getContext('2d');
        this.charts.waitingTime = new Chart(waitingTimeCtx, {
            type: 'doughnut',
            data: {
                labels: ['FIFO', 'SJF', 'Round Robin', 'Priority'],
                datasets: [{
                    data: [
                        this.chartData.waitingTime.fifo,
                        this.chartData.waitingTime.sjf,
                        this.chartData.waitingTime.rr,
                        this.chartData.waitingTime.priority
                    ],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(56, 189, 248, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)'
                    ],
                    borderColor: [
                        'rgb(139, 92, 246)',
                        'rgb(56, 189, 248)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'Average Waiting Time Distribution',
                        color: textColor,
                        font: { size: 16 }
                    }
                }
            }
        });

        // Turnaround Time Chart
        const turnaroundTimeCtx = document.getElementById('turnaround-time-chart').getContext('2d');
        this.charts.turnaroundTime = new Chart(turnaroundTimeCtx, {
            type: 'doughnut',
            data: {
                labels: ['FIFO', 'SJF', 'Round Robin', 'Priority'],
                datasets: [{
                    data: [
                        this.chartData.turnaroundTime.fifo,
                        this.chartData.turnaroundTime.sjf,
                        this.chartData.turnaroundTime.rr,
                        this.chartData.turnaroundTime.priority
                    ],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(56, 189, 248, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)'
                    ],
                    borderColor: [
                        'rgb(139, 92, 246)',
                        'rgb(56, 189, 248)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'Average Turnaround Time Distribution',
                        color: textColor,
                        font: { size: 16 }
                    }
                }
            }
        });
    }

    updateCharts() {
        // Update all charts with current data
        if (this.charts.cpuMemory) {
            this.charts.cpuMemory.data.labels = this.chartData.cpuMemory.labels;
            this.charts.cpuMemory.data.datasets[0].data = this.chartData.cpuMemory.cpu;
            this.charts.cpuMemory.data.datasets[1].data = this.chartData.cpuMemory.memory;
            this.charts.cpuMemory.update('active');
        }

        if (this.charts.algorithm) {
            this.charts.algorithm.data.datasets[0].data = [
                this.chartData.algorithm.fifo,
                this.chartData.algorithm.sjf,
                this.chartData.algorithm.rr,
                this.chartData.algorithm.priority
            ];
            this.charts.algorithm.update('active');
        }

        if (this.charts.metricsAlgorithm) {
            this.charts.metricsAlgorithm.data.labels = this.chartData.metricsAlgorithm.labels;
            this.charts.metricsAlgorithm.data.datasets[0].data = this.chartData.metricsAlgorithm.fifo;
            this.charts.metricsAlgorithm.data.datasets[1].data = this.chartData.metricsAlgorithm.sjf;
            this.charts.metricsAlgorithm.data.datasets[2].data = this.chartData.metricsAlgorithm.rr;
            this.charts.metricsAlgorithm.update('active');
        }

        if (this.charts.waitingTime) {
            this.charts.waitingTime.data.datasets[0].data = [
                this.chartData.waitingTime.fifo,
                this.chartData.waitingTime.sjf,
                this.chartData.waitingTime.rr,
                this.chartData.waitingTime.priority
            ];
            this.charts.waitingTime.update('active');
        }

        if (this.charts.turnaroundTime) {
            this.charts.turnaroundTime.data.datasets[0].data = [
                this.chartData.turnaroundTime.fifo,
                this.chartData.turnaroundTime.sjf,
                this.chartData.turnaroundTime.rr,
                this.chartData.turnaroundTime.priority
            ];
            this.charts.turnaroundTime.update('active');
        }
    }
}

// Initialize the application
const processManager = new ProcessManager();