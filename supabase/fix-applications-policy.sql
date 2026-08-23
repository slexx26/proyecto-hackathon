-- ADAPTA — arreglo puntual: falta el permiso de escritura pública en
-- provider_applications y adaptation_requests.
--
-- Encontrado probando POST /providers/applications en vivo: dio 502.
-- La causa es RLS otra vez, igual que con la lectura de providers/products,
-- pero del lado de escritura. `policies.sql` ya tiene estas dos políticas,
-- pero por lo que sea no quedaron aplicadas — puede pasar si se corrió una
-- versión anterior del archivo, o si el editor cortó la selección antes de
-- llegar a este bloque. Este archivo es solo estas dos políticas, aisladas,
-- para no tener que volver a pegar las 51 líneas de policies.sql entero.
--
-- Aplicar en el SQL Editor. Se puede volver a correr sin romperse.

drop policy if exists "Cualquiera puede enviar una solicitud de negocio" on provider_applications;
create policy "Cualquiera puede enviar una solicitud de negocio"
  on provider_applications for insert
  with check (true);

drop policy if exists "Cualquiera puede pedir una adaptación" on adaptation_requests;
create policy "Cualquiera puede pedir una adaptación"
  on adaptation_requests for insert
  with check (true);

-- Verificación: esto tiene que insertar y devolver 1 fila. Si tira el mismo
-- error 42501 de antes, avisen antes de seguir — algo más está bloqueando.
insert into provider_applications (business_name, kind, location, email, description)
values ('Verificación de políticas', 'adaptive-apparel', 'San José', 'verificacion@ejemplo-test.com', 'Fila de prueba, se puede borrar después de confirmar que esto funciona.')
returning id;
