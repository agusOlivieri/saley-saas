-- =====================================================================
-- CONFIGURACIÓN DE SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- Asegura que los comercios solo puedan ver y editar su propia data.
-- =====================================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- POLÍTICAS PARA: comercios
-- ---------------------------------------------------------------------

-- Cualquiera puede ver el perfil público de los comercios (necesario para la app de consumidores)
CREATE POLICY "Comercios son visibles para todos"
ON comercios FOR SELECT
USING (true);

-- Un comercio solo puede insertar su propio perfil (su ID debe coincidir con el UID de auth)
CREATE POLICY "Comercios pueden insertar su propio perfil"
ON comercios FOR INSERT
WITH CHECK (auth.uid() = id);

-- Un comercio solo puede actualizar su propio perfil
CREATE POLICY "Comercios pueden actualizar su propio perfil"
ON comercios FOR UPDATE
USING (auth.uid() = id);

-- ---------------------------------------------------------------------
-- POLÍTICAS PARA: promos
-- ---------------------------------------------------------------------

-- Las promos activas son visibles para todos (necesario para la app de consumidores)
CREATE POLICY "Promos activas son visibles para todos"
ON promos FOR SELECT
USING (true);

-- Un comercio solo puede crear promos vinculadas a su propio ID
CREATE POLICY "Comercios pueden crear sus propias promos"
ON promos FOR INSERT
WITH CHECK (auth.uid() = comercio_id);

-- Un comercio solo puede editar sus propias promos
CREATE POLICY "Comercios pueden actualizar sus propias promos"
ON promos FOR UPDATE
USING (auth.uid() = comercio_id);

-- Un comercio solo puede eliminar sus propias promos
CREATE POLICY "Comercios pueden eliminar sus propias promos"
ON promos FOR DELETE
USING (auth.uid() = comercio_id);

-- ---------------------------------------------------------------------
-- POLÍTICAS PARA: interacciones
-- ---------------------------------------------------------------------

-- Los comerciantes solo pueden leer interacciones de SUS propias promos
CREATE POLICY "Comerciantes ven interacciones de sus propias promos"
ON interacciones FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM promos 
    WHERE promos.id = interacciones.oferta_id 
    AND promos.comercio_id = auth.uid()
  )
);

-- Solo consumidores autenticados pueden crear interacciones (deben ser ellos mismos)
CREATE POLICY "Consumidores autenticados pueden crear interacciones"
ON interacciones FOR INSERT
WITH CHECK (auth.uid() = consumidor_id);

-- Permitir a usuarios autenticados y anon insertar en interacciones
GRANT INSERT ON interacciones TO authenticated;
