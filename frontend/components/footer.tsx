export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">SubsPlatform</h3>
            <p className="text-sm text-muted-foreground">La mejor plataforma de suscripciones para tu negocio.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Características</li>
              <li>Precios</li>
              <li>API</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Documentación</li>
              <li>Contacto</li>
              <li>Estado</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacidad</li>
              <li>Términos</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 SubsPlatform. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
