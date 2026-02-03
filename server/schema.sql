-- Create list table
CREATE TABLE IF NOT EXISTS list (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user_accounts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES list(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_status ON list(status);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
