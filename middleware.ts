import { NextRequest, NextResponse } from "next/server";
import { GrowthBook } from "@growthbook/growthbook";
import sanityClient from "./config/sanity";
import { SanityClient } from "@sanity/client";
import { AppExperiment, ABTestSettings, Iso2CountryCode, LanguageCode } from "@haukurmar/types";
import groq from "groq";

export const config = {
	matcher: "/",
};

export async function middleware(req: NextRequest & { growthbook: any }, res: NextResponse) {
	const currentSlug = req.nextUrl.pathname;

	// Get abSettings from Sanity
	const abSettings = await getABTestSettings(sanityClient, "da", "DK");

	console.log("abSettings: ", abSettings);

	if (abSettings !== undefined) {
		// Check to see if we have any experiments enabled for this page
		const pageExperiment = getExperimentForPage(abSettings, currentSlug);

		if (pageExperiment) {
			let newPathName = currentSlug;
			// Get abFeatures from Growthbook
			const featureKeys = await getEnabledFeatureKeys(pageExperiment);

			if (pageExperiment.experimentType === "page" && pageExperiment.target) {
				newPathName = pageExperiment.target.slug;
			}

			newPathName = `${newPathName}?features=${featureKeys.join(",")}`;

			return NextResponse.rewrite(newPathName);
		}
	}

	return NextResponse.next();
}

export const getABTestSettings = async (
	client: SanityClient,
	locale: LanguageCode,
	countryCode: Iso2CountryCode,
): Promise<ABTestSettings | undefined> => {
	const result = await client.fetch(
		groq`*[_type == "settings" && _id == "${countryCode.toLowerCase()}-site-settings"] {
			abTestSetting->{
				pages[]->{
					"experimentType": "page",
					"source": {
						"pageId": _id,
						"slug": slug[$locale].current, 
					},
					"target": variant->{
						"pageId": _id,
						"slug": slug[$locale].current, 
					},
					"featureKeys":[]
				}
			}
		}[0]`,
		{
			locale,
			slug: "",
			lastSlug: "",
		},
	);
	return result?.abTestSetting as ABTestSettings;
};

const getExperimentForPage = (abSettings: ABTestSettings, pathname: string): AppExperiment | null => {
	// find AbSettings for a specific slug
	const testForPage = abSettings.pages.find((page) => page.source.slug === pathname);
	if (testForPage) {
		return testForPage;
	}

	return null;
};

const getEnabledFeatureKeys = async (pageExperiment: AppExperiment): Promise<string[]> => {
	const growthbook = new GrowthBook({
		apiHost: process.env.GROWTBOOK_API_HOST,
		clientKey: process.env.GROWTBOOK_CLIENT_KEY,
		enableDevMode: true,
		trackingCallback: (experiment, result) => {
			// TODO: Use your real analytics tracking system
			console.log("Viewed Experiment", {
				experimentId: experiment.key,
				variationId: result.key,
			});
		},
	});

	// Wait for features to load (will be cached in-memory for future requests)
	await growthbook.loadFeatures();

	const enabledFeatureKeys = pageExperiment.featureKeys.filter((featureKey) => growthbook.isOn(featureKey));

	// Clean up at the end of the request
	// TODO: Might not be needed
	growthbook.destroy();

	return enabledFeatureKeys;
};
