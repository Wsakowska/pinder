import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

interface LocationPickerProps {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (lat: number, lng: number) => void;
    onClose: () => void;
}

export default function LocationPicker({ latitude, longitude, onLocationChange, onClose }: LocationPickerProps) {
    const [selectedLat, setSelectedLat] = useState(latitude || 54.352); // Gdansk default
    const [selectedLng, setSelectedLng] = useState(longitude || 18.646);
    const [mapUrl, setMapUrl] = useState('');

    useEffect(() => {
        // Generate OpenStreetMap iframe URL
        const zoom = 13;
        const url = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedLng - 0.05},${selectedLat - 0.05},${selectedLng + 0.05},${selectedLat + 0.05}&layer=mapnik&marker=${selectedLat},${selectedLng}`;
        setMapUrl(url);
    }, [selectedLat, selectedLng]);

    const handleConfirm = () => {
        onLocationChange(selectedLat, selectedLng);
        onClose();
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolokalizacja nie jest obsługiwana przez twoją przeglądarkę');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSelectedLat(position.coords.latitude);
                setSelectedLng(position.coords.longitude);
            },
            (error) => {
                alert('Nie udało się pobrać lokalizacji');
                console.error(error);
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Wybierz lokalizację</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Manual Input */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Współrzędne GPS</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Szerokość geograficzna
                                </label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    value={selectedLat}
                                    onChange={(e) => setSelectedLat(parseFloat(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="54.352"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Długość geograficzna
                                </label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    value={selectedLng}
                                    onChange={(e) => setSelectedLng(parseFloat(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="18.646"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Current Location Button */}
                    <button
                        onClick={handleGetCurrentLocation}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition"
                    >
                        <MapPin className="w-5 h-5" />
                        Użyj mojej obecnej lokalizacji
                    </button>

                    {/* Map Preview */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Podgląd mapy</h3>
                        <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={mapUrl}
                                title="Location Map"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            📍 Wybrałeś: {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
                        </p>
                    </div>

                    {/* Popular Cities */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popularne miasta</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => { setSelectedLat(54.352); setSelectedLng(18.646); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Gdańsk
                            </button>
                            <button
                                onClick={() => { setSelectedLat(52.229); setSelectedLng(21.012); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Warszawa
                            </button>
                            <button
                                onClick={() => { setSelectedLat(50.064); setSelectedLng(19.945); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Kraków
                            </button>
                            <button
                                onClick={() => { setSelectedLat(51.107); setSelectedLng(17.038); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Wrocław
                            </button>
                            <button
                                onClick={() => { setSelectedLat(53.428); setSelectedLng(14.553); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Szczecin
                            </button>
                            <button
                                onClick={() => { setSelectedLat(51.246); setSelectedLng(22.568); }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                            >
                                Lublin
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex gap-4">
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                    >
                        Potwierdź lokalizację
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
}