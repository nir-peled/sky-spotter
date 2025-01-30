export interface Airport {
	name: string;
	skyID: string;
	entityID: string;
}

export interface FlightSegment {
	origin: string;
	destination: string;
	departure: Date;
	arrival: Date;
	duration_minutes: number;
	operating_carrier: string;
}

export interface Flight {
	price: string;
	legs: {
		origin: string;
		destination: string;
		departure: Date;
		arrival: Date;
		duration_minutes: number;
		carrier: {
			name: string;
			logo: string;
		};
		segments: FlightSegment[];
	}[];
}
