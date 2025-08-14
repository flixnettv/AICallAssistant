// ========================================
// Agent System Test
// Demonstrates how all agents work together
// ========================================

import {
  masterAgent,
  callAgent,
  messageAgent,
  contactAgent,
  securityAgent,
  backupAgent,
  aiAgent,
  integrationAgent,
  analyticsAgent,
} from './index';

import { generateTaskId, calculateTaskPriority, measureExecutionTime } from './utils';
import { AGENT_TYPES, TASK_PRIORITIES, TASK_TYPES } from './constants';

/**
 * Test the complete agent system
 */
export async function testAgentSystem(): Promise<void> {
  console.log('🚀 Starting Agent System Test...\n');

  try {
    // Start the master agent
    console.log('📡 Starting Master Agent...');
    await masterAgent.start();
    console.log('✅ Master Agent started successfully\n');

    // Test individual agents
    await testIndividualAgents();

    // Test agent coordination
    await testAgentCoordination();

    // Test workflow execution
    await testWorkflowExecution();

    // Test system monitoring
    await testSystemMonitoring();

    // Test analytics and reporting
    await testAnalyticsAndReporting();

    // Test security and backup
    await testSecurityAndBackup();

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Agent System Test failed:', error);
  } finally {
    // Stop the master agent
    console.log('\n🛑 Stopping Master Agent...');
    await masterAgent.stop();
    console.log('✅ Master Agent stopped successfully');
  }
}

/**
 * Test individual agent functionality
 */
async function testIndividualAgents(): Promise<void> {
  console.log('🧪 Testing Individual Agents...\n');

  // Test Call Agent
  console.log('📞 Testing Call Agent...');
  const callTask = {
    id: generateTaskId(),
    type: TASK_TYPES.USER,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test call functionality',
    data: { action: 'makeCall', phoneNumber: '+1234567890' },
    status: 'pending',
    createdAt: new Date(),
  };

  const callResult = await callAgent.executeTask(callTask);
  console.log('✅ Call Agent test completed:', callResult);

  // Test Message Agent
  console.log('\n💬 Testing Message Agent...');
  const messageTask = {
    id: generateTaskId(),
    type: TASK_TYPES.USER,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test message functionality',
    data: { action: 'sendSMS', phoneNumber: '+1234567890', message: 'Hello from Agent System!' },
    status: 'pending',
    createdAt: new Date(),
  };

  const messageResult = await messageAgent.executeTask(messageTask);
  console.log('✅ Message Agent test completed:', messageResult);

  // Test Contact Agent
  console.log('\n👥 Testing Contact Agent...');
  const contactTask = {
    id: generateTaskId(),
    type: TASK_TYPES.USER,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test contact functionality',
    data: { action: 'createContact', contact: { name: 'Test User', phoneNumber: '+1234567890' } },
    status: 'pending',
    createdAt: new Date(),
  };

  const contactResult = await contactAgent.executeTask(contactTask);
  console.log('✅ Contact Agent test completed:', contactResult);

  // Test AI Agent
  console.log('\n🧠 Testing AI Agent...');
  const aiTask = {
    id: generateTaskId(),
    type: TASK_TYPES.AI,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test AI functionality',
    data: { action: 'analyzeSentiment', text: 'I love this application!' },
    status: 'pending',
    createdAt: new Date(),
  };

  const aiResult = await aiAgent.executeTask(aiTask);
  console.log('✅ AI Agent test completed:', aiResult);

  // Test Security Agent
  console.log('\n🔒 Testing Security Agent...');
  const securityTask = {
    id: generateTaskId(),
    type: TASK_TYPES.SECURITY,
    priority: TASK_PRIORITIES.HIGH,
    description: 'Test security functionality',
    data: { action: 'checkSecurity' },
    status: 'pending',
    createdAt: new Date(),
  };

  const securityResult = await securityAgent.executeTask(securityTask);
  console.log('✅ Security Agent test completed:', securityResult);

  // Test Backup Agent
  console.log('\n💾 Testing Backup Agent...');
  const backupTask = {
    id: generateTaskId(),
    type: TASK_TYPES.BACKUP,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test backup functionality',
    data: { action: 'getBackupStatus' },
    status: 'pending',
    createdAt: new Date(),
  };

  const backupResult = await backupAgent.executeTask(backupTask);
  console.log('✅ Backup Agent test completed:', backupResult);

  // Test Integration Agent
  console.log('\n🔗 Testing Integration Agent...');
  const integrationTask = {
    id: generateTaskId(),
    type: TASK_TYPES.SYSTEM,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test integration functionality',
    data: { action: 'getSystemMetrics' },
    status: 'pending',
    createdAt: new Date(),
  };

  const integrationResult = await integrationAgent.executeTask(integrationTask);
  console.log('✅ Integration Agent test completed:', integrationResult);

  // Test Analytics Agent
  console.log('\n📊 Testing Analytics Agent...');
  const analyticsTask = {
    id: generateTaskId(),
    type: TASK_TYPES.ANALYTICS,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test analytics functionality',
    data: { action: 'getSystemHealth' },
    status: 'pending',
    createdAt: new Date(),
  };

  const analyticsResult = await analyticsAgent.executeTask(analyticsTask);
  console.log('✅ Analytics Agent test completed:', analyticsResult);
}

/**
 * Test agent coordination through the master agent
 */
async function testAgentCoordination(): Promise<void> {
  console.log('\n🤝 Testing Agent Coordination...\n');

  // Test coordinating multiple agents for a complex task
  const coordinationTask = {
    id: generateTaskId(),
    type: TASK_TYPES.SYSTEM,
    priority: TASK_PRIORITIES.HIGH,
    description: 'Test agent coordination',
    data: {
      action: 'coordinateAgents',
      agents: ['call', 'message', 'contact', 'ai'],
      task: {
        type: 'user_communication',
        description: 'Process user communication request',
        data: {
          phoneNumber: '+1234567890',
          message: 'Hello from coordinated agents!',
          action: 'send_message_and_log',
        },
      },
    },
    status: 'pending',
    createdAt: new Date(),
  };

  const { result, executionTime } = await measureExecutionTime(() =>
    integrationAgent.executeTask(coordinationTask)
  );

  console.log('✅ Agent coordination test completed');
  console.log(`⏱️  Execution time: ${executionTime}ms`);
  console.log('📋 Result:', result);
}

/**
 * Test workflow execution
 */
async function testWorkflowExecution(): Promise<void> {
  console.log('\n🔄 Testing Workflow Execution...\n');

  // Test executing a predefined workflow
  const workflowTask = {
    id: generateTaskId(),
    type: TASK_TYPES.WORKFLOW,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test workflow execution',
    data: {
      action: 'executeWorkflow',
      workflowId: 'contact_management',
      data: {
        contactName: 'Workflow Test User',
        phoneNumber: '+1234567890',
        email: 'workflow@test.com',
      },
    },
    status: 'pending',
    createdAt: new Date(),
  };

  const { result, executionTime } = await measureExecutionTime(() =>
    integrationAgent.executeTask(workflowTask)
  );

  console.log('✅ Workflow execution test completed');
  console.log(`⏱️  Execution time: ${executionTime}ms`);
  console.log('📋 Result:', result);
}

/**
 * Test system monitoring
 */
async function testSystemMonitoring(): Promise<void> {
  console.log('\n📡 Testing System Monitoring...\n');

  // Test getting system metrics
  const metricsTask = {
    id: generateTaskId(),
    type: TASK_TYPES.SYSTEM,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test system monitoring',
    data: { action: 'getSystemMetrics' },
    status: 'pending',
    createdAt: new Date(),
  };

  const { result, executionTime } = await measureExecutionTime(() =>
    integrationAgent.executeTask(metricsTask)
  );

  console.log('✅ System monitoring test completed');
  console.log(`⏱️  Execution time: ${executionTime}ms`);
  console.log('📊 System Health:', result.overallHealth);
  console.log('🤖 Active Agents:', result.agentStatuses.length);
}

/**
 * Test analytics and reporting
 */
async function testAnalyticsAndReporting(): Promise<void> {
  console.log('\n📊 Testing Analytics and Reporting...\n');

  // Test generating a system report
  const reportTask = {
    id: generateTaskId(),
    type: TASK_TYPES.ANALYTICS,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test analytics reporting',
    data: {
      action: 'generateReport',
      reportType: 'system_overview',
      parameters: { timeRange: '24h' },
    },
    status: 'pending',
    createdAt: new Date(),
  };

  const { result, executionTime } = await measureExecutionTime(() =>
    analyticsAgent.executeTask(reportTask)
  );

  console.log('✅ Analytics and reporting test completed');
  console.log(`⏱️  Execution time: ${executionTime}ms`);
  console.log('📋 Report ID:', result.reportId);
  console.log('📊 Report Type:', result.type);
}

/**
 * Test security and backup functionality
 */
async function testSecurityAndBackup(): Promise<void> {
  console.log('\n🛡️ Testing Security and Backup...\n');

  // Test security scan
  const securityScanTask = {
    id: generateTaskId(),
    type: TASK_TYPES.SECURITY,
    priority: TASK_PRIORITIES.HIGH,
    description: 'Test security scanning',
    data: { action: 'scanForThreats' },
    status: 'pending',
    createdAt: new Date(),
  };

  const securityResult = await securityAgent.executeTask(securityScanTask);
  console.log('✅ Security scan completed:', securityResult);

  // Test backup creation
  const backupCreateTask = {
    id: generateTaskId(),
    type: TASK_TYPES.BACKUP,
    priority: TASK_PRIORITIES.MEDIUM,
    description: 'Test backup creation',
    data: { action: 'createBackup', type: 'selective', options: { dataTypes: ['contacts', 'messages'] } },
    status: 'pending',
    createdAt: new Date(),
  };

  const backupResult = await backupAgent.executeTask(backupCreateTask);
  console.log('✅ Backup creation completed:', backupResult);
}

/**
 * Test task priority calculation
 */
export function testTaskPriorityCalculation(): void {
  console.log('\n🎯 Testing Task Priority Calculation...\n');

  const testTasks = [
    {
      id: '1',
      type: TASK_TYPES.EMERGENCY,
      priority: TASK_PRIORITIES.CRITICAL,
      description: 'Emergency task',
      data: {},
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '2',
      type: TASK_TYPES.SECURITY,
      priority: TASK_PRIORITIES.HIGH,
      description: 'Security task',
      data: {},
      status: 'pending',
      createdAt: new Date(Date.now() - 60000), // 1 minute ago
    },
    {
      id: '3',
      type: TASK_TYPES.USER,
      priority: TASK_PRIORITIES.MEDIUM,
      description: 'User task',
      data: {},
      status: 'pending',
      createdAt: new Date(Date.now() - 300000), // 5 minutes ago
    },
  ];

  testTasks.forEach(task => {
    const priorityScore = calculateTaskPriority(task);
    console.log(`Task: ${task.description}`);
    console.log(`  Type: ${task.type}, Priority: ${task.priority}`);
    console.log(`  Priority Score: ${priorityScore}\n`);
  });
}

/**
 * Test agent status and health
 */
export async function testAgentStatus(): Promise<void> {
  console.log('\n🏥 Testing Agent Status and Health...\n');

  try {
    // Get agent status from master agent
    const agentStatuses = await masterAgent.getAgentStatus();
    
    console.log('📊 Agent Status Summary:');
    agentStatuses.forEach(agent => {
      console.log(`  🤖 ${agent.id}: ${agent.status}`);
      if (agent.memoryUsage) console.log(`    💾 Memory: ${agent.memoryUsage}%`);
      if (agent.cpuUsage) console.log(`    🔥 CPU: ${agent.cpuUsage}%`);
      if (agent.tasksCompleted) console.log(`    ✅ Tasks: ${agent.tasksCompleted}`);
      if (agent.errors) console.log(`    ❌ Errors: ${agent.errors}`);
    });

    // Get AI system status
    const aiSystemStatus = await masterAgent.getAISystemStatus();
    console.log('\n🧠 AI System Status:');
    console.log(`  Overall Status: ${aiSystemStatus.overallStatus}`);
    console.log(`  Active Agents: ${aiSystemStatus.activeAgents}`);
    console.log(`  Total Tasks: ${aiSystemStatus.totalTasks}`);
    console.log(`  System Health: ${aiSystemStatus.systemHealth}`);

  } catch (error) {
    console.error('❌ Failed to get agent status:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 Starting Comprehensive Agent System Tests...\n');

  // Run basic tests
  testTaskPriorityCalculation();
  await testAgentStatus();

  // Run full system test
  await testAgentSystem();

  console.log('\n🎉 All tests completed!');
}

// Export test functions for individual use
export {
  testAgentSystem,
  testIndividualAgents,
  testAgentCoordination,
  testWorkflowExecution,
  testSystemMonitoring,
  testAnalyticsAndReporting,
  testSecurityAndBackup,
};