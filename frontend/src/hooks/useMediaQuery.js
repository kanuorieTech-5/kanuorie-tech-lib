import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
  const media = window.matchMedia(query);

  const [matches, setMatches] = useState(media.matches);

  useEffect(() => {
    const listener = (e) => setMatches(e.matches);

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return matches;
}