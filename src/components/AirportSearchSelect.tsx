import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import Select, { ActionMeta, InputActionMeta } from "react-select";
import fetch_airport_list from "../lib";
import { Airport } from "../types";

interface Props {
	title: string;
	set_airport: (airport: Airport) => void;
}

export default function AirportSearchSelect({ title, set_airport }: Props) {
	// search_input is raw, search is debounced
	const [search_input, set_search_input] = useState<string>("");
	const [search, set_search_raw] = useState<string>("");

	const { isLoading, error, data } = useQuery({
		queryKey: ["countryData", search],
		queryFn: async () => await fetch_airport_list(search),
		enabled: !!search,
	});

	const set_search = useCallback(
		debounce(
			(new_search) => set_search_raw(new_search),
			Number(import.meta.env.VITE_REQUEST_DEBOUNCE)
		),
		[]
	);

	const handle_input_change = (input_text: string, meta: InputActionMeta) => {
		if (meta.action !== "input-blur" && meta.action !== "menu-close") {
			set_search_input(input_text);
			set_search(input_text);
		}
	};

	const no_option_message = ({ inputValue }: { inputValue: string }) => {
		if (error) return `An error has occured: ${error.name}: ${error.message}`;

		if (inputValue.trim().length == 0) return null;

		return "No matching airports";
	};

	const on_value_change = (new_value: Airport | null, meta: ActionMeta<Airport>) => {
		if (meta.action == "select-option" && new_value != null) set_airport(new_value);
	};

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">{title}</span>
			</div>
			<Select
				className="px-1"
				options={data}
				isClearable
				inputValue={search_input}
				onInputChange={handle_input_change}
				isLoading={!!search && isLoading}
				filterOption={null}
				noOptionsMessage={no_option_message}
				onChange={on_value_change}
				getOptionLabel={(option) => option.name}
			/>
		</label>
	);
}
