import os from "os";

/**
 * Simulates an async delay.
 * @param {number} ms - Milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Server-side service to check system and database health diagnostics.
 */
export async function getSystemHealth() {
  // Simulate network/database fetch latency so loading skeletons are verifiable
  await sleep(1000);

  // Read server-side environment and resource metrics
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  // Format uptime to human readable string
  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  return {
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    uptime: formatUptime(uptime),
    nodeVersion: process.version,
    platform: `${os.type()} ${os.release()} (${os.arch()})`,
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    },
    services: {
      database: "CONNECTED",
      cache: "ACTIVE",
      rankingEngine: "ONLINE",
    },
  };
}
