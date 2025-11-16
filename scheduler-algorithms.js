// Scheduling Algorithms Implementation
const SchedulerAlgorithms = {
    // FIFO (First-In-First-Out) Algorithm
    runFIFO: function(processes) {
        if (processes.length === 0) {
            return {
                schedule: [],
                metrics: { avgWaitingTime: 0, avgTurnaroundTime: 0, contextSwitches: 0, cpuUtilization: 0 }
            };
        }

        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const schedule = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        sorted.forEach(process => {
            const startTime = Math.max(currentTime, process.arrivalTime);
            const duration = process.burstTime;
            
            schedule.push({
                processId: process.id,
                processName: process.name,
                startTime,
                duration,
                algorithm: 'FIFO'
            });

            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = startTime + duration - process.arrivalTime;
            
            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;
            currentTime = startTime + duration;
        });

        return {
            schedule,
            metrics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length,
                contextSwitches: processes.length - 1,
                cpuUtilization: Math.round((currentTime / (currentTime + 5)) * 100)
            }
        };
    },

    // SJF (Shortest Job First) Algorithm
    runSJF: function(processes) {
        if (processes.length === 0) {
            return {
                schedule: [],
                metrics: { avgWaitingTime: 0, avgTurnaroundTime: 0, contextSwitches: 0, cpuUtilization: 0 }
            };
        }

        const sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
        const schedule = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        sorted.forEach(process => {
            const startTime = Math.max(currentTime, process.arrivalTime);
            const duration = process.burstTime;
            
            schedule.push({
                processId: process.id,
                processName: process.name,
                startTime,
                duration,
                algorithm: 'SJF'
            });

            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = startTime + duration - process.arrivalTime;
            
            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;
            currentTime = startTime + duration;
        });

        return {
            schedule,
            metrics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length,
                contextSwitches: processes.length - 1,
                cpuUtilization: Math.round((currentTime / (currentTime + 5)) * 100)
            }
        };
    },

    // Round Robin Algorithm
    runRoundRobin: function(processes, timeQuantum = 4) {
        if (processes.length === 0) {
            return {
                schedule: [],
                metrics: { avgWaitingTime: 0, avgTurnaroundTime: 0, contextSwitches: 0, cpuUtilization: 0 }
            };
        }

        const queue = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
        const schedule = [];
        let currentTime = 0;
        let contextSwitches = 0;

        while (queue.length > 0) {
            const process = queue.shift();
            if (!process) break;

            const duration = Math.min(process.remainingTime, timeQuantum);
            const startTime = currentTime;

            schedule.push({
                processId: process.id,
                processName: process.name,
                startTime,
                duration,
                algorithm: 'RR'
            });

            process.remainingTime -= duration;
            currentTime += duration;

            if (process.remainingTime > 0) {
                queue.push(process);
                contextSwitches++;
            }
        }

        const totalWaitingTime = schedule.reduce((sum, s) => sum + (s.startTime - 0), 0);
        const totalTurnaroundTime = schedule.reduce((sum, s) => sum + (s.startTime + s.duration), 0);

        return {
            schedule,
            metrics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length,
                contextSwitches,
                cpuUtilization: Math.round((currentTime / (currentTime + 5)) * 100)
            }
        };
    },

    // Priority Scheduling Algorithm
    runPriority: function(processes) {
        if (processes.length === 0) {
            return {
                schedule: [],
                metrics: { avgWaitingTime: 0, avgTurnaroundTime: 0, contextSwitches: 0, cpuUtilization: 0 }
            };
        }

        const sorted = [...processes].sort((a, b) => a.priority - b.priority);
        const schedule = [];
        let currentTime = 0;
        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        sorted.forEach(process => {
            const startTime = Math.max(currentTime, process.arrivalTime);
            const duration = process.burstTime;
            
            schedule.push({
                processId: process.id,
                processName: process.name,
                startTime,
                duration,
                algorithm: 'PRIORITY'
            });

            const waitingTime = startTime - process.arrivalTime;
            const turnaroundTime = startTime + duration - process.arrivalTime;
            
            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;
            currentTime = startTime + duration;
        });

        return {
            schedule,
            metrics: {
                avgWaitingTime: totalWaitingTime / processes.length,
                avgTurnaroundTime: totalTurnaroundTime / processes.length,
                contextSwitches: processes.length - 1,
                cpuUtilization: Math.round((currentTime / (currentTime + 5)) * 100)
            }
        };
    },

    // Algorithm Steps Generation
    generateFIFOSteps: function(processes) {
        const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        let steps = [];
        let currentTime = 0;
        
        steps.push('Sort processes by arrival time');
        
        sorted.forEach((process, index) => {
            steps.push(`Process ${process.name} arrives at time ${process.arrivalTime}`);
            const startTime = Math.max(currentTime, process.arrivalTime);
            steps.push(`Process ${process.name} starts execution at time ${startTime}`);
            steps.push(`Process ${process.name} runs for ${process.burstTime}ms`);
            currentTime = startTime + process.burstTime;
            steps.push(`Process ${process.name} completes at time ${currentTime}`);
            
            if (index < sorted.length - 1) {
                steps.push(`Next process in queue: ${sorted[index + 1].name}`);
            }
        });
        
        return steps;
    },

    generateSJFSteps: function(processes) {
        const sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
        let steps = [];
        let currentTime = 0;
        
        steps.push('Sort processes by burst time (shortest first)');
        
        sorted.forEach((process, index) => {
            steps.push(`Process ${process.name} has burst time ${process.burstTime}ms`);
            const startTime = Math.max(currentTime, process.arrivalTime);
            steps.push(`Process ${process.name} starts execution at time ${startTime}`);
            steps.push(`Process ${process.name} runs for ${process.burstTime}ms`);
            currentTime = startTime + process.burstTime;
            steps.push(`Process ${process.name} completes at time ${currentTime}`);
            
            if (index < sorted.length - 1) {
                steps.push(`Next shortest job: ${sorted[index + 1].name} with burst time ${sorted[index + 1].burstTime}ms`);
            }
        });
        
        return steps;
    },

    generateRRSteps: function(processes) {
        const timeQuantum = 4;
        let steps = [];
        let queue = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
        let currentTime = 0;
        
        steps.push(`Initialize Round Robin with time quantum = ${timeQuantum}ms`);
        steps.push(`Initial queue: ${queue.map(p => p.name).join(', ')}`);
        
        while (queue.length > 0) {
            const process = queue.shift();
            steps.push(`Selected process: ${process.name} with ${process.remainingTime}ms remaining`);
            
            const duration = Math.min(process.remainingTime, timeQuantum);
            steps.push(`Process ${process.name} executes for ${duration}ms`);
            
            process.remainingTime -= duration;
            currentTime += duration;
            
            if (process.remainingTime > 0) {
                steps.push(`Process ${process.name} still has ${process.remainingTime}ms remaining, added back to queue`);
                queue.push(process);
            } else {
                steps.push(`Process ${process.name} completed at time ${currentTime}`);
            }
            
            steps.push(`Current queue: ${queue.map(p => p.name).join(', ')}`);
        }
        
        return steps;
    },

    generatePrioritySteps: function(processes) {
        const sorted = [...processes].sort((a, b) => a.priority - b.priority);
        let steps = [];
        let currentTime = 0;
        
        steps.push('Sort processes by priority (lower number = higher priority)');
        
        sorted.forEach((process, index) => {
            steps.push(`Process ${process.name} has priority ${process.priority}`);
            const startTime = Math.max(currentTime, process.arrivalTime);
            steps.push(`Process ${process.name} starts execution at time ${startTime}`);
            steps.push(`Process ${process.name} runs for ${process.burstTime}ms`);
            currentTime = startTime + process.burstTime;
            steps.push(`Process ${process.name} completes at time ${currentTime}`);
            
            if (index < sorted.length - 1) {
                steps.push(`Next highest priority: ${sorted[index + 1].name} with priority ${sorted[index + 1].priority}`);
            }
        });
        
        return steps;
    }
};

// C Code Implementation for Scheduling Algorithms
const SchedulerCCode = {
    FIFO: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    int arrivalTime;
    int burstTime;
    int priority;
} Process;

void fifoScheduler(Process processes[], int n) {
    // Sort processes by arrival time
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (processes[j].arrivalTime > processes[j+1].arrivalTime) {
                Process temp = processes[j];
                processes[j] = processes[j+1];
                processes[j+1] = temp;
            }
        }
    }
    
    int currentTime = 0;
    printf("FIFO Scheduling:\\n");
    
    for (int i = 0; i < n; i++) {
        if (currentTime < processes[i].arrivalTime) {
            currentTime = processes[i].arrivalTime;
        }
        printf("Process %s starts at time %d\\n", processes[i].name, currentTime);
        currentTime += processes[i].burstTime;
        printf("Process %s completes at time %d\\n", processes[i].name, currentTime);
    }
}`,

    SJF: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    int arrivalTime;
    int burstTime;
    int priority;
} Process;

void sjfScheduler(Process processes[], int n) {
    // Sort processes by burst time
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (processes[j].burstTime > processes[j+1].burstTime) {
                Process temp = processes[j];
                processes[j] = processes[j+1];
                processes[j+1] = temp;
            }
        }
    }
    
    int currentTime = 0;
    printf("SJF Scheduling:\\n");
    
    for (int i = 0; i < n; i++) {
        if (currentTime < processes[i].arrivalTime) {
            currentTime = processes[i].arrivalTime;
        }
        printf("Process %s starts at time %d\\n", processes[i].name, currentTime);
        currentTime += processes[i].burstTime;
        printf("Process %s completes at time %d\\n", processes[i].name, currentTime);
    }
}`,

    RoundRobin: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int priority;
} Process;

void roundRobinScheduler(Process processes[], int n, int timeQuantum) {
    int currentTime = 0;
    int completed = 0;
    
    // Initialize remaining times
    for (int i = 0; i < n; i++) {
        processes[i].remainingTime = processes[i].burstTime;
    }
    
    printf("Round Robin Scheduling (Quantum=%d):\\n", timeQuantum);
    
    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (processes[i].remainingTime > 0) {
                int executionTime = (processes[i].remainingTime > timeQuantum) ? 
                                  timeQuantum : processes[i].remainingTime;
                
                printf("Process %s executes for %d units\\n", 
                       processes[i].name, executionTime);
                
                processes[i].remainingTime -= executionTime;
                currentTime += executionTime;
                
                if (processes[i].remainingTime == 0) {
                    completed++;
                    printf("Process %s completed at time %d\\n", 
                           processes[i].name, currentTime);
                }
            }
        }
    }
}`,

    Priority: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    int arrivalTime;
    int burstTime;
    int priority;
} Process;

void priorityScheduler(Process processes[], int n) {
    // Sort processes by priority (lower number = higher priority)
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (processes[j].priority > processes[j+1].priority) {
                Process temp = processes[j];
                processes[j] = processes[j+1];
                processes[j+1] = temp;
            }
        }
    }
    
    int currentTime = 0;
    printf("Priority Scheduling:\\n");
    
    for (int i = 0; i < n; i++) {
        if (currentTime < processes[i].arrivalTime) {
            currentTime = processes[i].arrivalTime;
        }
        printf("Process %s (Priority %d) starts at time %d\\n", 
               processes[i].name, processes[i].priority, currentTime);
        currentTime += processes[i].burstTime;
        printf("Process %s completes at time %d\\n", processes[i].name, currentTime);
    }
}`
};