import { duration_to_text } from "../lib";
import { Flight } from "../types";
import SegmentDetails from "./SegmentDetails";

interface Props {
	flight: Flight;
}

export default function FlightDetails({ flight }: Props) {
	return (
		<div className="collapse collapse-arrow border-base-300 bg-base-200 border my-1">
			<input type="checkbox" />
			<div className="flex flex-wrap lg:flex-nowrap collapse-title text-xl font-medium justify-between">
				<img src={flight.legs[0].carrier.logo} />
				<span className="font-bold mx-1">
					Departure: {flight.legs[0].departure.toLocaleTimeString("en-UK")} -
					{flight.legs[0].arrival.toLocaleTimeString("en-UK")} (
					{duration_to_text(flight.legs[0].duration_minutes)})
				</span>
				{flight.legs.length > 1 && (
					<span className="font-bold mx-1">
						Return: {flight.legs[1].departure.toLocaleTimeString("en-UK")} -
						{flight.legs[1].arrival.toLocaleTimeString("en-UK")} (
						{duration_to_text(flight.legs[1].duration_minutes)})
					</span>
				)}
				<span className="font-bold text-green-600">{flight.price}</span>
			</div>
			<div className="collapse-content flex justify-around">
				{flight.legs.map((leg, i) => (
					<div className="flex flex-col align-around mx-1" key={i}>
						{leg.segments.map((segment, j) => (
							<SegmentDetails segment={segment} key={j} />
						))}
					</div>
				))}
			</div>
		</div>
	);
}
