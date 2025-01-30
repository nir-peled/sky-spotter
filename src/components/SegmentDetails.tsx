import { duration_to_text } from "../lib";
import { FlightSegment } from "../types";

interface Props {
	segment: FlightSegment;
}

export default function SegmentDetails({ segment }: Props) {
	const departure_time = segment.departure.toLocaleTimeString("en-UK");
	const arrival_time = segment.arrival.toLocaleTimeString("en-UK");
	return (
		<div className="flex flex-col align-around py-1">
			<span className="text-base">
				{departure_time} · {segment.origin}
			</span>
			<span className="text-sm text-gray-200">
				{duration_to_text(segment.duration_minutes)}
			</span>
			<span className="text-base">
				{arrival_time} · {segment.destination}
			</span>
		</div>
	);
}
