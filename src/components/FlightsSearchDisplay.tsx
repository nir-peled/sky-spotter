import { Flight } from "../types";
import FlightDetails from "./FlightDetails";

interface Props {
	flights?: Flight[];
	error: Error | null;
}

export default function FlightsSearchDisplay({ flights, error }: Props) {
	if (error) return <p>An error has occured: {error.message}</p>;

	return (
		<div>
			{flights?.map((flight, i) => (
				<FlightDetails key={i} flight={flight} />
			))}
		</div>
	);
}
