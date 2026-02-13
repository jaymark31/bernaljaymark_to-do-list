-- lists table (matches server /api/lists)
CREATE TABLE IF NOT EXISTS lists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- items table (tasks under a list)
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_lists_status ON lists(status);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
