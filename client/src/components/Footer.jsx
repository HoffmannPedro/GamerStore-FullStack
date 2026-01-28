import { Link } from 'react-router-dom';
import { TiSocialInstagram } from "react-icons/ti";
import { FaFacebookSquare } from "react-icons/fa";



export default function Footer() {
    return (
        <footer className="bg-pixel-card/50 backdrop-blur-lg border-t border-white/5 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* 1. Marca */}
                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col">
                            <span className="text-lg font-ethno font-good tracking-[0.2em] uppercase text-white">
                                Gamer<span className="text-pixel-teal">Store</span>
                            </span>
                        </div>
                    </div>
                    <p className="text-pixel-muted text-sm leading-relaxed font-light">
                        Elevando el estándar del rendimiento extremo. <br />
                        Hardware de élite para jugadores exigentes.
                    </p>
                </div>

                {/* 2. Explorar */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-b border-white/10 pb-2 inline-block">Navegación</h4>
                    <ul className="space-y-4 text-sm text-pixel-muted">
                        <li><Link to="/" className="hover:text-pixel-teal transition-colors flex items-center gap-2"><span>›</span> Colección</Link></li>
                        <li><Link to="/cart" className="hover:text-pixel-teal transition-colors flex items-center gap-2"><span>›</span> Carrito</Link></li>
                        <li><Link to="/login" className="hover:text-pixel-teal transition-colors flex items-center gap-2"><span>›</span> Mi Cuenta</Link></li>
                    </ul>
                </div>

                {/* 3. Soporte */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-b border-white/10 pb-2 inline-block">Ayuda</h4>
                    <ul className="space-y-4 text-sm text-pixel-muted">
                        <li><a href="#" className="hover:text-pixel-teal transition-colors">Envíos y Entregas</a></li>
                        <li><a href="#" className="hover:text-pixel-teal transition-colors">Cambios y Devoluciones</a></li>
                        <li><a href="#" className="hover:text-pixel-teal transition-colors">Términos del Servicio</a></li>
                    </ul>
                </div>

                {/* 4. Newsletter */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-b border-white/10 pb-2 inline-block">Newsletter</h4>
                    <p className="text-pixel-muted text-xs mb-4 leading-relaxed">Suscríbete para recibir lanzamientos exclusivos y descuentos.</p>
                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="bg-pixel-bg w-full px-4 py-3 rounded-lg text-white text-sm outline-none border border-white/10 focus:border-pixel-teal focus:ring-1 focus:ring-pixel-teal transition-all placeholder-gray-600"
                        />
                        <button className="bg-white text-black px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-pixel-teal transition-colors shadow-lg">
                            Suscribirse
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">© 2026 Pedro Hoffmann Dev. Todos los derechos reservados.</p>
                <div className="flex gap-4 opacity-50">
                    {/* Iconos decorativos */}
                    <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"><TiSocialInstagram className="w-8 h-6 mx-auto mt-1 text-white" /></div>
                    <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"><FaFacebookSquare className="w-8 h-5 mx-auto mt-1.5 text-white" /></div>
                </div>
            </div>
        </footer>
    );
}