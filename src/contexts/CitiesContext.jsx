import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [state.cities.filter((city) => city.id !== action.payload)],
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "rejected":
      return { ...state, error: action.payload, isLoading: false };

    default:
      return { ...state };
  }
};

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async function () {
      try {
        // setIsLoading(true);
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        // setIsLoading(false);
        dispatch({
          type: "rejected",
          payload: "Something went wrong while loading cities",
        });
      }
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;
      try {
        // setIsLoading(true);
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        // setCurrentCity(data);
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Something went wrong while loading the City",
        });
      }
    },
    [currentCity.id]
  );

  const createCity = async function (newCity) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // setCities((cities) => [...cities, data]);
      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong while adding the City",
      });
    }
  };

  const deleteCity = async function (id) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong while Deleting the City",
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        error,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const useCities = function () {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("Cities context was used outside of Cities Provider 🚫");
  }
  return context;
};

export { CitiesProvider, useCities };
