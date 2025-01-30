import { useQuery } from "@tanstack/react-query";
import { Airport, Flight } from "./types";

interface FetchAirportSuccessResults {
	status: true;
	timestsamp: number;
	data: {
		presentation: {
			suggestionTitle: string;
		};
		navigation: {
			relevantFlightParams: { skyID: string; entityId: string };
		};
	}[];
}
interface FetchFailedResults {
	status: false;
	message: any;
}
type FetchAirportResults = FetchAirportSuccessResults | FetchFailedResults;

export default async function fetch_airport_list(query: string): Promise<Airport[]> {
	const search_params = new URLSearchParams({
		query,
		locale: "en-US",
	});
	const response = await fetch(
		"https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?" + search_params,
		{
			headers: {
				"x-rapidapi-key": import.meta.env.VITE_AIR_SCRAPER_API_KEY,
			},
		}
	);

	if (!response.ok) throw new Error(`request failed with status ${response.status}`);

	const details = (await response.json()) as FetchAirportResults;
	if (!details.status) throw new Error(`request failed: ${details.message}`);

	return details.data.map(({ presentation, navigation }) => ({
		name: presentation.suggestionTitle,
		skyID: navigation.relevantFlightParams.skyID,
		entityID: navigation.relevantFlightParams.entityId,
	}));
}

interface UseFetchFlightsParams {
	origin: Airport | null;
	destination: Airport | null;
	departure: Date | null;
	return_date: Date | null;
	adults: number;
	children: number;
	infants: number;
}

interface UseFetchFlightsReturn {
	flights?: Flight[];
	error: Error | null;
	is_loading: boolean;
	search?: () => void;
}

export function useFetchFlights({
	origin,
	destination,
	departure,
	return_date,
	adults,
	children,
	infants,
}: UseFetchFlightsParams): UseFetchFlightsReturn {
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: [
			"flights",
			origin?.skyID,
			destination?.skyID,
			departure && date_to_string(departure),
			return_date && date_to_string(return_date),
			adults,
			children,
			infants,
		],
		queryFn: fetch_flight_list({
			origin,
			destination,
			departure,
			return_date,
			adults,
			children,
			infants,
		}),
		enabled: false,
		refetchOnWindowFocus: false,
	});

	return {
		flights: data,
		error: error,
		is_loading: isLoading,
		search: refetch,
	};
}

interface FetchFlightsSuccessResults {
	status: true;
	data: {
		itineraries: {
			price: {
				raw: number;
				formatted: string;
			};
			legs: {
				origin: {
					name: string;
					country: string;
				};
				destination: {
					name: string;
					country: string;
				};
				departure: string;
				arrival: string;
				durationInMinutes: number;
				carriers: {
					marketing: {
						name: string;
						logoUrl: string;
					}[];
				};
				segments: {
					origin: {
						name: string;
						country: string;
					};
					destination: {
						name: string;
						country: string;
					};
					departure: string;
					arrival: string;
					durationInMinutes: number;
					operatingCarrier: {
						name: string;
					};
				}[];
			}[];
		}[];
	};
}

type FetchFlightsResults = FetchFlightsSuccessResults | FetchFailedResults;

function fetch_flight_list({
	origin,
	destination,
	departure,
	return_date,
	adults,
	children,
	infants,
}: UseFetchFlightsParams): () => Promise<Flight[]> {
	return async () => {
		if (!origin || !destination || !departure || !return_date) return [];
		if (return_date < departure) throw new Error("Invalid Dates");

		const params = new URLSearchParams({
			originSkyId: origin.skyID,
			originEntityId: origin.entityID,
			destinationSkyId: destination.skyID,
			destinationEntityId: destination.entityID,
			date: date_to_string(departure),
			returnDate: date_to_string(return_date),
			adults: adults.toString(),
			children: children.toString(),
			infants: infants.toString(),
		});
		const response = await fetch(
			"https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?" + params,
			{
				headers: {
					"x-rapidapi-key": import.meta.env.VITE_AIR_SCRAPER_API_KEY,
				},
			}
		);

		if (!response.ok) throw new Error(`request failed with status ${response.status}`);
		const details = (await response.json()) as FetchFlightsResults;
		if (!details.status) throw new Error(`request failed: ${details.message}`);

		return details.data.itineraries.map(({ price, legs }) => ({
			price: price.formatted,
			legs: legs.map((leg) => ({
				origin: leg.origin.name,
				destination: leg.destination.name,
				departure: new Date(leg.departure),
				arrival: new Date(leg.arrival),
				duration_minutes: leg.durationInMinutes,
				carrier: {
					name: leg.carriers.marketing[0].name,
					logo: leg.carriers.marketing[0].logoUrl,
				},
				segments: leg.segments.map((segment) => ({
					origin: segment.origin.name,
					destination: segment.destination.name,
					departure: new Date(segment.departure),
					arrival: new Date(segment.arrival),
					duration_minutes: segment.durationInMinutes,
					operating_carrier: segment.operatingCarrier.name,
				})),
			})),
		}));
	};
}

function date_to_string(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function duration_to_text(minutes: number): string {
	const MINUTES_IN_HOURS = 60;

	const hours = Math.floor(minutes / MINUTES_IN_HOURS);
	const leftover_minutes = minutes - hours * MINUTES_IN_HOURS;
	return `${hours} hr ${leftover_minutes} min`;
}
