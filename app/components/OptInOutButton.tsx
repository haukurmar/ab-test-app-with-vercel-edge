"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type OptInOutButtonProps = {
	onClickSetBeta: boolean;
};

const OptInOutButton = (props: OptInOutButtonProps) => {
	const router = useRouter();
	const optInOut = () => {
		Cookies.set("beta", `${props.onClickSetBeta}`);
		router.refresh();
	};

	return (
		<button className="btn-opt" onClick={optInOut}>
			Opt {props.onClickSetBeta ? "into beta" : "out of beta"}
		</button>
	);
};

export { OptInOutButton };
export type { OptInOutButtonProps };
