-- Tabla de Calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id SERIAL PRIMARY KEY,
    mercado VARCHAR(50),
    instrumento VARCHAR(100),
    anio_comercial VARCHAR(10),
    secuencia_evento VARCHAR(50),
    numero_dividendo VARCHAR(50),
    valor_historico NUMERIC,
    fecha_pago DATE,
    descripcion TEXT,
    origen VARCHAR(50),
    fuente VARCHAR(50),
    acogido_isfut BOOLEAN DEFAULT FALSE,
    factors_json JSONB,
    montos_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Información Externa
CREATE TABLE IF NOT EXISTS informacion_externa (
    id SERIAL PRIMARY KEY,
    ejercicio VARCHAR(10),
    instrumento VARCHAR(100),
    fecha_pago DATE,
    descripcion_dividendo TEXT,
    secuencia_evento VARCHAR(50),
    acogido_isfut VARCHAR(10),
    origen VARCHAR(50),
    mercado VARCHAR(50),
    factor_actualizacion NUMERIC,
    factor8 NUMERIC,
    factor9 NUMERIC,
    factor10 NUMERIC,
    factor11 NUMERIC,
    factor12 NUMERIC,
    factor13 NUMERIC,
    factor14 NUMERIC,
    factor15 NUMERIC,
    factor16 NUMERIC,
    factor17 NUMERIC,
    factor18 NUMERIC,
    factor19 NUMERIC,
    factor20 NUMERIC,
    factor21 NUMERIC,
    factor22 NUMERIC,
    factor23 NUMERIC,
    factor24 NUMERIC,
    factor25 NUMERIC,
    factor26 NUMERIC,
    factor27 NUMERIC,
    factor28 NUMERIC,
    factor29 NUMERIC,
    factor30 NUMERIC,
    factor31 NUMERIC,
    factor32 NUMERIC,
    factor33 NUMERIC,
    factor34 NUMERIC,
    factor35 NUMERIC,
    factor36 NUMERIC,
    factor37 NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Corredor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario Admin por defecto (si no existe)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@admin.com', 'admin', 'Administrador')
ON CONFLICT (email) DO NOTHING;
