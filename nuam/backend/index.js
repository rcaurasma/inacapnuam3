const express = require('express');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializar base de datos
async function initDB() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schema);
    console.log('Base de datos inicializada correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
}

initDB();

// === AUTH ENDPOINTS ===

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // En producción, usar JWT aquí
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
});

// === CALIFICACIONES ENDPOINTS ===

// Endpoint para obtener calificaciones
app.get('/api/calificaciones', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM calificaciones ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint para crear calificación
app.post('/api/calificaciones', async (req, res) => {
  const {
    mercado, instrumento, anioComercial, secuenciaEvento, numeroDividendo,
    valorHistorico, fechaPago, descripcion, origen, fuente, acogidoIsfut,
    factors, montos
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO calificaciones (
        mercado, instrumento, anio_comercial, secuencia_evento, numero_dividendo,
        valor_historico, fecha_pago, descripcion, origen, fuente, acogido_isfut,
        factors_json, montos_json, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *`,
      [
        mercado, instrumento, anioComercial, secuenciaEvento, numeroDividendo,
        valorHistorico, fechaPago, descripcion, origen, fuente, acogidoIsfut,
        JSON.stringify(factors), JSON.stringify(montos)
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar');
  }
});

// Endpoint para eliminar calificación
app.delete('/api/calificaciones/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM calificaciones WHERE id = $1', [req.params.id]);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar');
  }
});

// Endpoint para actualizar calificación
app.put('/api/calificaciones/:id', async (req, res) => {
  const {
    mercado, instrumento, anioComercial, secuenciaEvento, numeroDividendo,
    valorHistorico, fechaPago, descripcion, origen, fuente, acogidoIsfut,
    factors, montos
  } = req.body;

  try {
    await db.query(
      `UPDATE calificaciones
       SET mercado=$1, instrumento=$2, anio_comercial=$3, secuencia_evento=$4,
           numero_dividendo=$5, valor_historico=$6, fecha_pago=$7, descripcion=$8,
           origen=$9, fuente=$10, acogido_isfut=$11, factors_json=$12, montos_json=$13,
           updated_at=NOW()
       WHERE id=$14`,
      [
        mercado, instrumento, anioComercial, secuenciaEvento, numeroDividendo,
        valorHistorico, fechaPago, descripcion, origen, fuente, acogidoIsfut,
        JSON.stringify(factors), JSON.stringify(montos),
        req.params.id
      ]
    );
    res.json({ message: 'Actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar');
  }
});

// Endpoint para verificar existencia
app.get('/api/calificaciones/existe', async (req, res) => {
  const { fechaPago, instrumento } = req.query;
  try {
    const result = await db.query(
      'SELECT id FROM calificaciones WHERE fecha_pago = $1 AND instrumento = $2 LIMIT 1',
      [fechaPago, instrumento]
    );
    res.json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al verificar');
  }
});

// Endpoint para obtener información externa
app.get('/api/info-externa', async (req, res) => {
  const { mercado, origen, ejercicio } = req.query;
  let query = 'SELECT * FROM informacion_externa WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (mercado) {
    query += ` AND mercado = $${paramCount++}`;
    params.push(mercado);
  }
  if (origen) {
    query += ` AND origen = $${paramCount++}`;
    params.push(origen);
  }
  if (ejercicio) {
    query += ` AND ejercicio LIKE $${paramCount++}`;
    params.push(`%${ejercicio}%`);
  }

  query += ' ORDER BY id DESC';

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener información externa');
  }
});

// Endpoint para crear información externa
app.post('/api/info-externa', async (req, res) => {
  const data = req.body;
  const fields = Object.keys(data).map(k => k.replace(/([A-Z])/g, '_$1').toLowerCase()); // camelCase to snake_case simple
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  // Nota: Esto es simplificado. En producción deberías validar los campos permitidos.
  // Mapeo manual de campos si es necesario para coincidir con schema.sql
  // Por ahora asumimos que el frontend envía los nombres correctos o hacemos un mapeo aquí.
  // Dado que el frontend envía camelCase (ej: factorActualizacion) y la DB usa snake_case (factor_actualizacion),
  // necesitamos un mapeo o cambiar el frontend.
  // Vamos a hacer un mapeo simple aquí para los campos conocidos.

  const mapField = (field) => {
    const map = {
      'factorActualizacion': 'factor_actualizacion',
      'fechaPago': 'fecha_pago',
      'descripcionDividendo': 'descripcion_dividendo',
      'secuenciaEvento': 'secuencia_evento',
      'acogidoIsfut': 'acogido_isfut',
      // Los factor8...factor37 coinciden si son minúsculas, pero en JS son camelCase? No, son factor8.
    };
    return map[field] || field;
  };

  const dbFields = Object.keys(data).map(mapField);
  
  try {
    const query = `INSERT INTO informacion_externa (${dbFields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear información externa');
  }
});

// Endpoint para actualizar información externa
app.put('/api/info-externa/:id', async (req, res) => {
  const data = req.body;
  const values = Object.values(data);
  const id = req.params.id;
  
  const mapField = (field) => {
    const map = {
      'factorActualizacion': 'factor_actualizacion',
      'fechaPago': 'fecha_pago',
      'descripcionDividendo': 'descripcion_dividendo',
      'secuenciaEvento': 'secuencia_evento',
      'acogidoIsfut': 'acogido_isfut',
    };
    return map[field] || field;
  };

  const setClause = Object.keys(data).map((key, i) => `${mapField(key)} = $${i + 1}`).join(', ');

  try {
    await db.query(`UPDATE informacion_externa SET ${setClause} WHERE id = $${values.length + 1}`, [...values, id]);
    res.json({ message: 'Actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar información externa');
  }
});

// Endpoint para eliminar información externa
app.delete('/api/info-externa/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM informacion_externa WHERE id = $1', [req.params.id]);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar información externa');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

