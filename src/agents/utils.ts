// ========================================
// Agent Utilities
// Common utility functions for all agents
// ========================================

import { AgentTask, AgentTaskResult } from './MasterAgent';

/**
 * Generate a unique task ID
 */
export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate task priority score based on various factors
 */
export function calculateTaskPriority(task: AgentTask): number {
  let score = 0;
  
  // Base priority
  switch (task.priority) {
    case 'critical':
      score += 100;
      break;
    case 'high':
      score += 75;
      break;
    case 'medium':
      score += 50;
      break;
    case 'low':
      score += 25;
      break;
  }
  
  // Time-based priority (older tasks get higher priority)
  const age = Date.now() - task.createdAt.getTime();
  score += Math.min(age / 60000, 50); // Max 50 points for age
  
  // Type-based priority
  switch (task.type) {
    case 'emergency':
      score += 100;
      break;
    case 'security':
      score += 80;
      break;
    case 'system':
      score += 60;
      break;
    case 'user':
      score += 40;
      break;
    case 'maintenance':
      score += 20;
      break;
  }
  
  return Math.min(score, 200); // Cap at 200
}

/**
 * Format task result for logging
 */
export function formatTaskResult(result: AgentTaskResult): string {
  return `Task ${result.taskId}: ${result.status} - ${result.description}`;
}

/**
 * Validate task data structure
 */
export function validateTask(task: AgentTask): boolean {
  return !!(
    task.id &&
    task.type &&
    task.priority &&
    task.description &&
    task.data &&
    task.status &&
    task.createdAt
  );
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(taskId: string, error: Error): AgentTaskResult {
  return {
    taskId,
    status: 'failed',
    description: error.message,
    result: null,
    error: error.message,
    executionTime: 0,
    timestamp: new Date(),
  };
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(
  taskId: string,
  result: any,
  executionTime: number
): AgentTaskResult {
  return {
    taskId,
    status: 'completed',
    description: 'Task completed successfully',
    result,
    error: null,
    executionTime,
    timestamp: new Date(),
  };
}

/**
 * Measure execution time of an async function
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; executionTime: number }> {
  const startTime = Date.now();
  const result = await fn();
  const executionTime = Date.now() - startTime;
  
  return { result, executionTime };
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Batch process tasks for better performance
 */
export async function batchProcessTasks<T>(
  tasks: T[],
  processor: (task: T) => Promise<any>,
  batchSize: number = 10
): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(task => processor(task))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Merge multiple objects deeply
 */
export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  
  const source = sources.shift();
  if (source === undefined) return target;
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Check if value is an object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  if (ms < 86400000) return `${(ms / 3600000).toFixed(1)}h`;
  return `${(ms / 86400000).toFixed(1)}d`;
}

/**
 * Check if a value is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a promise that resolves after a delay
 */
export function delay<T>(ms: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/**
 * Create a promise that rejects after a timeout
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    ),
  ]);
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, any>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Create a queue for processing tasks
 */
export class TaskQueue<T> {
  private queue: T[] = [];
  private processing = false;
  private processor: (task: T) => Promise<any>;
  
  constructor(processor: (task: T) => Promise<any>) {
    this.processor = processor;
  }
  
  add(task: T): void {
    this.queue.push(task);
    this.process();
  }
  
  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      try {
        await this.processor(task);
      } catch (error) {
        console.error('Task processing error:', error);
      }
    }
    
    this.processing = false;
  }
  
  get length(): number {
    return this.queue.length;
  }
  
  clear(): void {
    this.queue = [];
  }
}

/**
 * Create a rate limiter
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;
  
  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }
  
  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }
    
    // Wait for next refill
    const waitTime = this.calculateWaitTime();
    await sleep(waitTime);
    return this.acquire();
  }
  
  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillRate);
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  private calculateWaitTime(): number {
    const now = Date.now();
    const timeSinceLastRefill = now - this.lastRefill;
    const nextRefill = this.refillRate - (timeSinceLastRefill % this.refillRate);
    return nextRefill;
  }
}