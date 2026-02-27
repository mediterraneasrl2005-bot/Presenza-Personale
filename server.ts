import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("presenze.db");

// Inizializzazione Database
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    pin TEXT UNIQUE NOT NULL,
    ore_g REAL DEFAULT 8,
    attivo INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    tipo TEXT CHECK(tipo IN ('entrata', 'uscita')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    gps TEXT,
    cantiere TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS calendar_overrides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    data TEXT, -- YYYY-MM-DD
    tipo TEXT, -- 'F', 'M', 'A', 'L104', 'ore'
    valore REAL,
    FOREIGN KEY(employee_id) REFERENCES employees(id),
    UNIQUE(employee_id, data)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    testo TEXT,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/employees", (req, res) => {
    const rows = db.prepare("SELECT * FROM employees WHERE attivo = 1 ORDER BY nome").all();
    res.json(rows);
  });

  app.post("/api/employees", (req, res) => {
    const { nome, pin, ore_g } = req.body;
    try {
      const info = db.prepare("INSERT INTO employees (nome, pin, ore_g) VALUES (?, ?, ?)").run(nome, pin, ore_g);
      res.json({ id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "PIN già esistente o dati non validi" });
    }
  });

  app.put("/api/employees/:id", (req, res) => {
    const { nome, pin, ore_g } = req.body;
    db.prepare("UPDATE employees SET nome = ?, pin = ?, ore_g = ? WHERE id = ?").run(nome, pin, ore_g, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/employees/:id", (req, res) => {
    db.prepare("UPDATE employees SET attivo = 0 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/attendance", (req, res) => {
    const rows = db.prepare(`
      SELECT a.*, e.nome 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      ORDER BY a.timestamp DESC 
      LIMIT 100
    `).all();
    res.json(rows);
  });

  app.post("/api/attendance", (req, res) => {
    const { pin, tipo, gps, cantiere } = req.body;
    const emp = db.prepare("SELECT id FROM employees WHERE pin = ? AND attivo = 1").get(pin);
    if (!emp) return res.status(401).json({ error: "PIN non valido" });

    db.prepare("INSERT INTO attendance (employee_id, tipo, gps, cantiere) VALUES (?, ?, ?, ?)")
      .run(emp.id, tipo, gps, cantiere);
    res.json({ success: true });
  });

  app.get("/api/calendar/:month", (req, res) => {
    // month format: YYYY-MM
    const rows = db.prepare("SELECT * FROM calendar_overrides WHERE data LIKE ?")
      .all(`${req.params.month}%`);
    res.json(rows);
  });

  app.post("/api/calendar", (req, res) => {
    const { employee_id, data, tipo, valore } = req.body;
    db.prepare(`
      INSERT INTO calendar_overrides (employee_id, data, tipo, valore) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(employee_id, data) DO UPDATE SET tipo=excluded.tipo, valore=excluded.valore
    `).run(employee_id, data, tipo, valore);
    res.json({ success: true });
  });

  app.get("/api/notes", (req, res) => {
    const rows = db.prepare("SELECT * FROM notes ORDER BY data_creazione DESC").all();
    res.json(rows);
  });

  app.post("/api/notes", (req, res) => {
    db.prepare("INSERT INTO notes (testo) VALUES (?)").run(req.body.testo);
    res.json({ success: true });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
