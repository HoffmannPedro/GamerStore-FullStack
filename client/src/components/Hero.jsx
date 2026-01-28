import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import api from '../services/api';

export default function Hero() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroProduct = async () => {
            try {
                const data = await api.getProducts({ searchTerm: 'Zen' });
                if (data && data.length > 0) {
                    setProduct(data[0]);
                }
            } catch (error) {
                console.error("Error cargando producto del Hero:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeroProduct();
    }, []);

    const heroImage = "/imagen-prueba-hero.png";
    const heroName = product ? product.name : "Samsung Odyssey G7 27'";
    const heroPrice = product ? `$${product.price.toFixed(2)}` : "$650.00";
    const heroTag = product && product.stock < 5 ? "Últimas Unidades" : "Best Seller";

    return (
        /* CAMBIO 1: Quitamos 'border-b border-white/5' de las clases del div principal 
           para eliminar la línea física.
        */
        <div className="relative w-full min-h-[85vh] flex items-center bg-pixel-bg overflow-hidden">

            {/* --- FONDO: Luces Ambientales --- */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-pixel-teal/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>

            {/* CAMBIO 2: Modificamos la luz púrpura de abajo a la derecha.
               Aumentamos la opacidad y el tamaño para que "baje" más visualmente 
            */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-purple-900/30 rounded-full blur-[80px] md:blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                {/* ... (CONTENIDO DE TEXTO IGUAL QUE ANTES) ... */}
                <div className="space-y-8 text-center md:text-left pt-10 md:pt-0">
                    <div className="inline-block px-4 py-1.5 border border-pixel-teal/30 rounded-full bg-pixel-teal/5 backdrop-blur-md shadow-[0_0_15px_rgba(164,216,216,0.1)]">
                        <span className="text-pixel-teal text-xs font-bold tracking-[0.25em] uppercase">
                            Nueva Colección 2025
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] font-montserrat">
                        DOMINA LA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixel-teal via-white to-pixel-purple drop-shadow-lg">
                            PARTIDA
                        </span>
                    </h1>

                    <p className="text-pixel-muted text-base md:text-lg tracking-wide max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                        Lleva tu setup al siguiente nivel con el hardware más potente del mercado. Rendimiento <b className="text-white">extremo</b> para jugadores <b className="text-white">exigentes</b>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
                        <Link
                            to="catalogo"
                            smooth={true}
                            duration={700}
                            className="cursor-pointer px-8 py-4 bg-pixel-teal text-slate-200 font-bold rounded-xl hover:bg-white hover:text-black/90 transition-all shadow-[0_0_5px_rgba(164,216,216,0.3)] hover:shadow-[0_0_30px_rgba(164,216,216,0.5)] transform hover:-translate-y-1 text-sm uppercase tracking-widest text-center"
                        >
                            Ver Catálogo
                        </Link>
                        <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:border-white/40 transition-all text-sm uppercase tracking-widest backdrop-blur-sm">
                            Contactar
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: PRODUCTO DINÁMICO (IGUAL QUE ANTES) --- */}
                <div className={`relative h-[350px] md:h-[650px] flex items-center justify-center transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute w-[280px] h-[280px] md:w-[500px] md:h-[500px] border border-white/5 rounded-full"></div>
                    <div className="absolute w-[240px] h-[240px] md:w-[400px] md:h-[400px] border border-pixel-teal/10 rounded-full"></div>

                    <img
                        src={heroImage}
                        alt={heroName}
                        className="relative z-10 w-full md:w-auto h-[60%] md:h-[80%] object-contain drop-shadow-2xl filter brightness-110 contrast-125"
                        onError={(e) => e.target.src = "https://placehold.co/600x800/222/A4D8D8/png?text=Lámpara+Zen+Pro"}
                    />

                    <div className="absolute bottom-10 left-4 md:bottom-24 md:-left-10 bg-pixel-card/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/10 shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${product && product.stock > 0 ? 'bg-green-400' : 'bg-red-500'}`}></span>
                            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">{heroTag}</p>
                        </div>
                        <p className="text-sm font-bold text-white mb-1">{heroName}</p>
                        <p className="text-3xl font-mono font-bold text-pixel-teal">{heroPrice}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1E1E1E] to-transparent z-20 pointer-events-none"></div>
        </div>
    );
}