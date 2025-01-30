interface Props {
	title: string;
	set_date: (date: Date | null) => void;
}

export default function DateSelector({ title, set_date }: Props) {
	return (
		<label className="form-control max-w-xs px-1">
			<div className="label">
				<span className="label-text">{title}</span>
			</div>
			<input
				className="input input-bordered w-full max-w-xs"
				type="date"
				aria-label={title}
				onChange={(e) => set_date(e.target.valueAsDate)}
			/>
		</label>
	);
}
