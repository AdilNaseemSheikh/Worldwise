import { useSearchParams } from "react-router-dom";

function useUrlPosition() {
  const [searchParams] = useSearchParams();

  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  return [mapLat, mapLng];
}

export { useUrlPosition };
