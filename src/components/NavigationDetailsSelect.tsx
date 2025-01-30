import { Airport } from "../types";
import AirportSearchSelect from "./AirportSearchSelect";
import DateSelector from "./DateSelector";
import PersonCounter from "./PersonCounter";

interface Props {
	set_origin: (airport: Airport) => void;
	set_destination: (airport: Airport) => void;
	set_departure: (date: Date | null) => void;
	set_return_date: (date: Date | null) => void;
	adults: number;
	set_adults: (persons: number) => void;
	children: number;
	set_children: (persons: number) => void;
	infants: number;
	set_infants: (persons: number) => void;
	search?: () => void;
}

export default function NavigationDetailsSelect({
	set_origin,
	set_destination,
	set_departure,
	set_return_date,
	adults,
	set_adults,
	children,
	set_children,
	infants,
	set_infants,
	search,
}: Props) {
	return (
		<div className="flex flex-row align-center">
			<AirportSearchSelect title="Origin" set_airport={set_origin} />
			<AirportSearchSelect title="Destination" set_airport={set_destination} />
			<DateSelector title="Departure" set_date={set_departure} />
			<DateSelector title="Return" set_date={set_return_date} />
			<PersonCounter title="Adults" value={adults} set_value={set_adults} />
			<PersonCounter title="Children" value={children} set_value={set_children} />
			<PersonCounter title="Infants" value={infants} set_value={set_infants} />
			<button className="btn" onClick={search}>
				Search
			</button>
		</div>
	);
}
