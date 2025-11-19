#!/usr/bin/env node

/**
 * Test Dashboard Generator
 * Generates a visual dashboard from Jest test results
 */

const fs = require('fs');
const path = require('path');

const TEST_RESULTS_DIR = path.join(__dirname, '../test-results');
const COVERAGE_DIR = path.join(__dirname, '../coverage');

function generateDashboard() {
  // Read test results
  const testReportPath = path.join(TEST_RESULTS_DIR, 'test-report.html');
  const junitPath = path.join(TEST_RESULTS_DIR, 'junit.xml');
  const coverageSummaryPath = path.join(COVERAGE_DIR, 'coverage-summary.json');

  let testData = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
  };

  let coverageData = {
    statements: 0,
    branches: 0,
    functions: 0,
    lines: 0,
  };

  // Read coverage summary if exists
  if (fs.existsSync(coverageSummaryPath)) {
    try {
      const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
      const total = coverageSummary.total;
      coverageData = {
        statements: total.statements.pct || 0,
        branches: total.branches.pct || 0,
        functions: total.functions.pct || 0,
        lines: total.lines.pct || 0,
      };
    } catch (error) {
      console.warn('Could not read coverage summary:', error.message);
    }
  }

  // Read JUnit XML if exists
  if (fs.existsSync(junitPath)) {
    try {
      const junitXml = fs.readFileSync(junitPath, 'utf8');
      const testMatch = junitXml.match(/tests="(\d+)"[^>]*failures="(\d+)"[^>]*errors="(\d+)"/);
      if (testMatch) {
        testData.total = parseInt(testMatch[1], 10);
        testData.failed = parseInt(testMatch[2], 10) + parseInt(testMatch[3], 10);
        testData.passed = testData.total - testData.failed;
      }
    } catch (error) {
      console.warn('Could not read JUnit XML:', error.message);
    }
  }

  // Generate dashboard HTML
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Dashboard - Cursor Raffle</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .header h1 {
      color: #333;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .header .timestamp {
      color: #666;
      font-size: 1em;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .metric-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-5px);
    }

    .metric-card.passed {
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    }

    .metric-card.failed {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .metric-card.coverage {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }

    .metric-label {
      font-size: 0.9em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .metric-value {
      font-size: 3em;
      font-weight: bold;
      color: #333;
    }

    .metric-unit {
      font-size: 0.5em;
      color: #666;
    }

    .progress-bar {
      width: 100%;
      height: 30px;
      background: #e0e0e0;
      border-radius: 15px;
      overflow: hidden;
      margin-top: 15px;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.9em;
    }

    .progress-fill.high {
      background: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
    }

    .progress-fill.medium {
      background: linear-gradient(90deg, #fee140 0%, #fa709a 100%);
    }

    .progress-fill.low {
      background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
    }

    .links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 30px;
    }

    .link-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      text-decoration: none;
      color: #333;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .link-card:hover {
      border-color: #667eea;
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .link-card h3 {
      margin-bottom: 10px;
      color: #667eea;
    }

    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: bold;
      margin-top: 10px;
    }

    .status-badge.success {
      background: #28a745;
      color: white;
    }

    .status-badge.warning {
      background: #ffc107;
      color: #333;
    }

    .status-badge.danger {
      background: #dc3545;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Test Dashboard</h1>
      <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card ${testData.failed === 0 ? 'passed' : 'failed'}">
        <div class="metric-label">Test Results</div>
        <div class="metric-value">
          ${testData.passed}<span class="metric-unit">/${testData.total}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${testData.failed === 0 ? 'high' : testData.failed < testData.total * 0.1 ? 'medium' : 'low'}" 
               style="width: ${testData.total > 0 ? (testData.passed / testData.total * 100) : 0}%">
            ${testData.total > 0 ? Math.round((testData.passed / testData.total) * 100) : 0}%
          </div>
        </div>
        <div class="status-badge ${testData.failed === 0 ? 'success' : 'danger'}">
          ${testData.failed === 0 ? 'All Tests Passed' : `${testData.failed} Failed`}
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Total Tests</div>
        <div class="metric-value">${testData.total}</div>
      </div>

      <div class="metric-card passed">
        <div class="metric-label">Passed</div>
        <div class="metric-value">${testData.passed}</div>
      </div>

      <div class="metric-card failed">
        <div class="metric-label">Failed</div>
        <div class="metric-value">${testData.failed}</div>
      </div>

      <div class="metric-card coverage">
        <div class="metric-label">Coverage - Statements</div>
        <div class="metric-value">${coverageData.statements.toFixed(1)}<span class="metric-unit">%</span></div>
        <div class="progress-bar">
          <div class="progress-fill ${coverageData.statements >= 80 ? 'high' : coverageData.statements >= 60 ? 'medium' : 'low'}" 
               style="width: ${coverageData.statements}%">
            ${coverageData.statements.toFixed(1)}%
          </div>
        </div>
      </div>

      <div class="metric-card coverage">
        <div class="metric-label">Coverage - Branches</div>
        <div class="metric-value">${coverageData.branches.toFixed(1)}<span class="metric-unit">%</span></div>
        <div class="progress-bar">
          <div class="progress-fill ${coverageData.branches >= 80 ? 'high' : coverageData.branches >= 60 ? 'medium' : 'low'}" 
               style="width: ${coverageData.branches}%">
            ${coverageData.branches.toFixed(1)}%
          </div>
        </div>
      </div>

      <div class="metric-card coverage">
        <div class="metric-label">Coverage - Functions</div>
        <div class="metric-value">${coverageData.functions.toFixed(1)}<span class="metric-unit">%</span></div>
        <div class="progress-bar">
          <div class="progress-fill ${coverageData.functions >= 80 ? 'high' : coverageData.functions >= 60 ? 'medium' : 'low'}" 
               style="width: ${coverageData.functions}%">
            ${coverageData.functions.toFixed(1)}%
          </div>
        </div>
      </div>

      <div class="metric-card coverage">
        <div class="metric-label">Coverage - Lines</div>
        <div class="metric-value">${coverageData.lines.toFixed(1)}<span class="metric-unit">%</span></div>
        <div class="progress-bar">
          <div class="progress-fill ${coverageData.lines >= 80 ? 'high' : coverageData.lines >= 60 ? 'medium' : 'low'}" 
               style="width: ${coverageData.lines}%">
            ${coverageData.lines.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>

    <div class="links">
      <a href="test-report.html" class="link-card" target="_blank">
        <h3>📊 Detailed Test Report</h3>
        <p>View full test results and failures</p>
      </a>
      <a href="../coverage/index.html" class="link-card" target="_blank">
        <h3>📈 Coverage Report</h3>
        <p>View code coverage details</p>
      </a>
      <a href="junit.xml" class="link-card" target="_blank">
        <h3>🔧 JUnit XML</h3>
        <p>CI/CD integration format</p>
      </a>
    </div>
  </div>
</body>
</html>
  `;

  // Ensure directory exists
  if (!fs.existsSync(TEST_RESULTS_DIR)) {
    fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
  }

  // Write dashboard
  const dashboardPath = path.join(TEST_RESULTS_DIR, 'dashboard.html');
  fs.writeFileSync(dashboardPath, dashboardHTML);
  console.log(`✅ Dashboard generated: ${dashboardPath}`);
  console.log(`📊 Open in browser: file:///${dashboardPath.replace(/\\/g, '/')}`);
}

// Run if called directly
if (require.main === module) {
  generateDashboard();
}

module.exports = { generateDashboard };

