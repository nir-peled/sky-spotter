interface Props {
	title: string;
	value: number;
	set_value: (new_value: number) => void;
}

export default function PersonCounter({ title, value, set_value }: Props) {
	return (
		<label className="form-control max-w-xs px-1">
			<div className="label">
				<span className="label-text">{title}</span>
			</div>
			<input
				className="input input-bordered w-full max-w-xs"
				type="number"
				aria-label={title}
				value={value}
				onChange={(e) => set_value(e.target.valueAsNumber)}
			/>
		</label>
	);
}
