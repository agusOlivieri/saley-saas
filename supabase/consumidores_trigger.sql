-- =====================================================================
-- TRIGGER CONDICIONAL PARA CREACIÓN DE CONSUMIDORES
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_consumer()
RETURNS trigger AS $$
BEGIN
  -- Solo insertamos en la tabla consumidores si viene 'username' en la metadata de auth
  IF (NEW.raw_user_meta_data->>'username') IS NOT NULL THEN
    INSERT INTO public.consumidores (id, nombre_usuario, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'username',
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe para recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_consumer();
