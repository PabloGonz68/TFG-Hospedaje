import { Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className=" bg-negro text-gray-800 w-full">


            <div className="max-w-4xl text-blanco  mx-auto px-6 py-10 flex flex-col md:flex-row items-center  md:items-start justify-between gap-8">
                {/* Logo y descripción */}
                <div className="flex flex-col justify-center items-center md:items-start">
                    <div className="flex flex-col items-center md:items-start w-3xs">
                        <a href="/" className="w-48 relative group">
                            {/*<img
                                src="https://i.ibb.co/1YjMczHJ/logo-Hospeda-blanco.png"
                                alt="Logo Hospeda Hover"

                                className="max-w-50 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />*/}
                            <img
                                src="https://i.ibb.co/rKGbXzxS/logo-Hospeda-amarillo.png"
                                alt="Logo Hospeda"
                                className="max-w-50   transition-all duration-900 hover:scale-110 group-hover:opacity-1000"

                            />
                        </a>

                        <p className="mt-2 text-sm text-center md:text-left">
                            La mejor forma de hospedarte y conocer personas alrededor del mundo.
                        </p>
                        <div className="flex space-x-4 mt-4 text-principal">
                            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                {/* Navegación */}
                <div className="flex flex-col items-center md:items-start group">
                    <h3 className="text-md transition-all duration-300 group-hover:translate-y-2 font-semibold mb-4 bg-principal text-negro rounded-lg  p-2 w-fit  text-shadow-sm">Explorar</h3>
                    <ul className="space-y-1 text-sm text-center md:text-left">
                        <li><a href="/hospedajes" className="hover:underline">Hospedajes</a></li>
                        <li><a href="/grupoViaje/mis-grupos" className="hover:underline">Grupos de Viajes</a></li>
                        <li><a href="/reserva/mis-reservas" className="hover:underline">Reservas</a></li>
                        <li><a href="/" className="hover:underline">¿Cómo empezar?</a></li>
                    </ul>
                </div>

                {/* Legal y ayuda */}
                <div className="flex flex-col items-center md:items-start group">
                    <h3 className="text-md transition-all duration-300 group-hover:translate-y-2  font-semibold mb-4 bg-principal text-negro rounded-lg  p-2 w-fit  text-shadow-sm">Soporte</h3>
                    <ul className="space-y-1 text-sm text-center md:text-left">
                        <li><a href="#" className="hover:underline">Centro de ayuda</a></li>
                        <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
                        <li><a href="#" className="hover:underline">Política de privacidad</a></li>
                        <li><a href="#" className="hover:underline">Contactar</a></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div className="flex flex-col items-center md:items-start group">
                    <h3 className="text-md transition-all duration-300 group-hover:translate-y-2 font-semibold mb-4 bg-principal text-negro rounded-lg  p-2 w-fit  text-shadow-sm">Contáctanos</h3>
                    <ul className="space-y-1 text-sm text-center md:text-left">
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> <span>hola@hospeda.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> <span>Cádiz, España</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Línea inferior */}
            <div className="border-t border-blanco py-4 text-center text-sm text-blanco">
                © {new Date().getFullYear()} Hospeda. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
