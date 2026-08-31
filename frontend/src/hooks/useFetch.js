import { useEffect } from "react";
import useApi from "./useApi";

export default function useFetch(apiFunction, ...params) {
  const api = useApi(apiFunction);

  useEffect(() => {
    api.request(...params);
  }, []);

  return api;
}
