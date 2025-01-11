import { useState, useEffect } from "react";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return isMobile;
};

export default useIsMobile;
