'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, error: error.message }
  }

  // Comprobar si completó el onboarding
  const { data: userData } = await supabase.auth.getUser()
  if (userData?.user) {
    const { data: comercio } = await supabase
      .from('comercios')
      .select('id')
      .eq('id', userData.user.id)
      .single()

    if (!comercio) {
      redirect('/onboarding')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
        apellido,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Después del registro, redirigimos a onboarding
  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autorizado' }

  const lat = formData.get('latitude') as string
  const lng = formData.get('longitude') as string
  const postgisPoint = `POINT(${lng} ${lat})`

  const data = {
    id: user.id, // ID del comercio debe ser el mismo que el Auth UID
    nombre_comercial: formData.get('nombre_comercial') as string,
    descripcion: formData.get('descripcion') as string,
    categoria: formData.get('categoria') as string,
    direccion_texto: formData.get('direccion_texto') as string,
    ubicacion: postgisPoint, // Formato PostGIS (lon lat)
  }

  const { error } = await supabase
    .from('comercios')
    .insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getComercioProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autorizado' }

  const { data, error } = await supabase
    .from('comercios')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
