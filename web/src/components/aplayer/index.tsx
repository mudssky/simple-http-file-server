import useSetupHook from "./hooks";

export interface AudioItem {
	name?: string;
	artist?: string;
	url: string;
	cover?: string;
	path: string;
}
export interface Props {
	playlist: AudioItem[];
	className?: string;
}

export default function Aplayer(props: Props) {
	const { className } = props;
	useSetupHook(props);
	return <div className={className} id="aplayer"></div>;
}
