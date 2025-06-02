type MapaProps = {
    direccion: string;
};

const Map = ({ direccion }: MapaProps) => {
    const apiKey = 'AIzaSyCJX_y4slyMYZMo02W9GoT4mVXJEoVWLMI';
    const query = encodeURIComponent(direccion);
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;

    return (
        <iframe
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={src}
        />
    );
};

export default Map;