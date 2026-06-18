-- =====================================================================
-- MIGRACIÓN DE BASE DE DATOS: SALEY MVP
-- Corrige incompatibilidades entre el Dashboard/Formulario y el esquema actual.
-- =====================================================================

-- 1. Actualizar la tabla de 'comercios'
ALTER TABLE comercios 
ADD COLUMN logo_url text;

COMMENT ON COLUMN comercios.logo_url IS 'URL del logo/avatar del comercio';

-- 2. Actualizar la tabla de 'promos'
ALTER TABLE promos 
ADD COLUMN imagen_url text,
ADD COLUMN categoria text,
ADD COLUMN hora_inicio time,
ADD COLUMN hora_fin time,
ADD COLUMN dias_semana integer[], -- Ej: {1,2,3,4,5} para Lunes a Viernes (1=Lunes, 7=Domingo)
ADD COLUMN radio_alcance_km numeric DEFAULT 1.2;

COMMENT ON COLUMN promos.imagen_url IS 'URL de la imagen del producto promocionado';
COMMENT ON COLUMN promos.categoria IS 'Categoría específica de la promoción';
COMMENT ON COLUMN promos.hora_inicio IS 'Hora del día en que se activa la promoción';
COMMENT ON COLUMN promos.hora_fin IS 'Hora del día en que finaliza la promoción';
COMMENT ON COLUMN promos.dias_semana IS 'Días de la semana activos para la promoción';
COMMENT ON COLUMN promos.radio_alcance_km IS 'Radio de geolocalización en kilómetros';

-- 3. Crear la tabla de 'interacciones' (para Métricas y Heatmap)
CREATE TABLE interacciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    oferta_id uuid REFERENCES promos(id) ON DELETE CASCADE,
    consumidor_id uuid REFERENCES consumidores(id) ON DELETE SET NULL, -- Puede ser nulo si es anónimo
    tipo_accion text NOT NULL CHECK (tipo_accion IN ('vista', 'interaccion')),
    ubicacion geography(Point, 4326), -- Punto desde donde interactuó el usuario
    creado_el timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice espacial GIST para consultas ultra rápidas en el mapa
CREATE INDEX interacciones_ubicacion_gist ON interacciones USING gist (ubicacion);

COMMENT ON TABLE interacciones IS 'Registro de visualizaciones y clicks de consumidores para estadísticas y mapa de calor';

-- 4. Crear Vista para consumir Promos Activas con Lat/Lng en el Frontend (Mobile App)
CREATE OR REPLACE VIEW vw_promos_activas AS
SELECT 
    p.id,
    p.comercio_id,
    p.titulo,
    p.descripcion,
    p.fecha_inicio,
    p.fecha_fin,
    p.activa,
    c.nombre_comercial,
    c.direccion_texto,
    c.categoria AS comercio_categoria,
    ST_Y(c.ubicacion::geometry) AS lat,
    ST_X(c.ubicacion::geometry) AS lng
FROM promos p
JOIN comercios c ON p.comercio_id = c.id
WHERE p.activa = true AND c.ubicacion IS NOT NULL;

-- Asignar permisos a la vista para acceso público
GRANT SELECT ON vw_promos_activas TO anon, authenticated;
