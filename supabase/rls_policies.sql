-- =====================================================================
-- CONFIGURACIÓN DE SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- Asegura que los comercios solo puedan ver y editar su propia data.
-- =====================================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
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
-- POLÍTICAS PARA: ofertas
-- ---------------------------------------------------------------------

-- Las ofertas activas son visibles para todos (necesario para la app de consumidores)
CREATE POLICY "Ofertas activas son visibles para todos"
ON ofertas FOR SELECT
USING (true);

-- Un comercio solo puede crear ofertas vinculadas a su propio ID
CREATE POLICY "Comercios pueden crear sus propias ofertas"
ON ofertas FOR INSERT
WITH CHECK (auth.uid() = comercio_id);

-- Un comercio solo puede editar sus propias ofertas
CREATE POLICY "Comercios pueden actualizar sus propias ofertas"
ON ofertas FOR UPDATE
USING (auth.uid() = comercio_id);

-- Un comercio solo puede eliminar sus propias ofertas
CREATE POLICY "Comercios pueden eliminar sus propias ofertas"
ON ofertas FOR DELETE
USING (auth.uid() = comercio_id);

-- ---------------------------------------------------------------------
-- POLÍTICAS PARA: interacciones
-- ---------------------------------------------------------------------

-- Los comerciantes solo pueden leer interacciones de SUS propias ofertas
CREATE POLICY "Comerciantes ven interacciones de sus propias ofertas"
ON interacciones FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM ofertas 
    WHERE ofertas.id = interacciones.oferta_id 
    AND ofertas.comercio_id = auth.uid()
  )
);

-- Los consumidores (o anónimos) pueden crear interacciones libremente
CREATE POLICY "Cualquiera puede crear interacciones"
ON interacciones FOR INSERT
WITH CHECK (true);
