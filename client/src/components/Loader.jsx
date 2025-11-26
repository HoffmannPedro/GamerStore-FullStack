export default function Loader({ text = "Cargando..." }) {
    return (
        <div className="flex justify-center items-center py-20 w-full">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-btnGreen rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium animate-pulse">{text}</p>
            </div>
        </div>
    );
}