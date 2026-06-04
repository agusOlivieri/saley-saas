import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: NO uses getSession, usa getUser para chequear auth de forma segura
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Rutas públicas que no requieren autenticación
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/registro')
  
  if (
    !user &&
    !isAuthRoute
  ) {
    // Si no hay usuario y no es una ruta de auth, redirigir a login
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // Si hay usuario y está intentando ir a login/registro, redirigir al dashboard
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
