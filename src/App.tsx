import { useState } from "react";
import { Airport } from "./types";
import NavigationDetailsSelect from "./components/NavigationDetailsSelect";
import FlightsSearchDisplay from "./components/FlightsSearchDisplay";
import LoadingMarker from "./components/LoadingMarker";
import { useFetchFlights } from "./lib";

export default function App() {
	const [origin, set_origin] = useState<Airport | null>(null);
	const [destination, set_destination] = useState<Airport | null>(null);
	const [departure, set_departure] = useState<Date | null>(null);
	const [return_date, set_return_date] = useState<Date | null>(null);
	const [adults, set_adults] = useState<number>(1);
	const [children, set_children] = useState<number>(0);
	const [infants, set_infants] = useState<number>(0);
	const { flights, error, is_loading, search } = useFetchFlights({
		origin,
		destination,
		departure,
		return_date,
		adults,
		children,
		infants,
	});

	return (
		<div>
			<h1 className="text-3xl font-bold underline">Sky Spotter Assignment</h1>
			<NavigationDetailsSelect
				set_origin={set_origin}
				set_destination={set_destination}
				set_departure={set_departure}
				set_return_date={set_return_date}
				adults={adults}
				set_adults={set_adults}
				children={children}
				set_children={set_children}
				infants={infants}
				set_infants={set_infants}
				search={search}
			/>
			{is_loading ? (
				<LoadingMarker />
			) : (
				<FlightsSearchDisplay flights={flights} error={error} />
			)}
		</div>
	);
}
