const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/subscribers.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create subscribers table
const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT
    )
  `;

  db.exec(sql);
  console.log('✅ Database initialized');
};

// Initialize database
createTable();

// Add a subscriber
const addSubscriber = (email, ipAddress = null, userAgent = null) => {
  const stmt = db.prepare(`
    INSERT INTO subscribers (email, subscribed_at, ip_address, user_agent)
    VALUES (?, datetime('now'), ?, ?)
  `);

  try {
    const result = stmt.run(email, ipAddress, userAgent);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Email already subscribed' };
    }
    throw error;
  }
};

// Get all subscribers
const getAllSubscribers = () => {
  const stmt = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
  return stmt.all();
};

// Get subscriber count
const getSubscriberCount = () => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM subscribers');
  return stmt.get().count;
};

// Export subscribers to CSV format
const exportToCSV = () => {
  const subscribers = getAllSubscribers();
  const csv = subscribers.map(s => `${s.email},${s.subscribed_at}`).join('\n');
  return `email,subscribed_at\n${csv}`;
};

module.exports = {
  db,
  addSubscriber,
  getAllSubscribers,
  getSubscriberCount,
  exportToCSV
};
