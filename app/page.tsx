import styles from "./page.module.css";
import { OptInOutButton } from "@haukurmar/app/components/OptInOutButton";

type PrimaryFrontPageProps = {};

const PrimaryHomePage = (props: PrimaryFrontPageProps) => {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<h1>Primary Homepage</h1>
				<OptInOutButton onClickSetBeta={true} />
			</div>
		</main>
	);
};

export default PrimaryHomePage;
