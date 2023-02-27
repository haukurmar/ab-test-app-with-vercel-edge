import { Fragment } from "react";
import styles from "@haukurmar/app/page.module.css";

type SecondaryFrontPageProps = {};

const SecondaryHomePage = (props: SecondaryFrontPageProps) => {
	return (
		<Fragment>
			<main className={styles.main}>
				<div className={styles.description}>
					<h1>Secondary Homepage</h1>
				</div>
			</main>
		</Fragment>
	);
};

export default SecondaryHomePage;
