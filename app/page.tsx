import styles from "./page.module.css";

type PrimaryFrontPageProps = {};

const PrimaryHomePage = (props: PrimaryFrontPageProps) => {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<h1>Primary Homepage</h1>
			</div>
		</main>
	);
};

export default PrimaryHomePage;
