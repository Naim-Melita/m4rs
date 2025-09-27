const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Explore */}
        <div>
          <h4 className="uppercase font-semibold mb-4 tracking-wide">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Hombres</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Mujeres</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Niños</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Estilo de vida</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Noticias</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Galería</a></li>
          </ul>
        </div>

        {/* Atención al Cliente */}
        <div>
          <h4 className="uppercase font-semibold mb-4 tracking-wide">Atención al Cliente</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Contáctenos</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Envíos</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Política de Devoluciones</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Política de Privacidad</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Política de Cookies</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white no-underline">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* Suscripción */}
        <div className="md:col-span-2">
          <h4 className="uppercase font-semibold mb-4 tracking-wide">Suscríbete</h4>
          <p className="text-gray-400 mb-4">
            Únete a nuestra lista de correo para recibir novedades y lanzamientos exclusivos.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Únete a nuestra lista de correo"
              className="flex-1 px-4 py-2 text-black rounded-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black px-6 py-2 uppercase font-semibold hover:bg-gray-200 transition"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      {/* Idioma y Moneda */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-800">
        <div className="flex gap-6 text-gray-400 text-xs uppercase">
          <button className="hover:text-white">Español</button>
          <button className="hover:text-white">USD $</button>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0 text-gray-400">
          <a href="#" className="hover:text-white no-underline">Instagram</a>
          <a href="#" className="hover:text-white no-underline">TikTok</a>
          <a href="#" className="hover:text-white no-underline">YouTube</a>
        </div>
      </div>

      {/* Links legales */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-6 text-gray-500 text-xs border-t border-gray-800">
        <a href="#" className="hover:text-white no-underline">Política de reembolso</a>
        <a href="#" className="hover:text-white no-underline">Política de privacidad</a>
        <a href="#" className="hover:text-white no-underline">Política de envío</a>
        <a href="#" className="hover:text-white no-underline">Términos del servicio</a>
        <a href="#" className="hover:text-white no-underline">Información de contacto</a>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs py-6 border-t border-gray-800">
        © 2025 M4RS - Tecnología de Shopify
      </div>
    </footer>
  );
};

export default Footer;
