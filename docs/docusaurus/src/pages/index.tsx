import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import GitHubStats from "../components/GitHubStats";

import styles from "./index.module.css";

type HeroBadge = {
    readonly description: string;
    readonly icon: string;
    readonly label: string;
};

type HeroStat = {
    readonly description: string;
    readonly headline: string;
};

type HomeCard = {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
};

/**
 * Hero badges Note: These icons are from the "Nerd Font Symbols" font.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const heroBadges = [
    {
        description: "Drop-in config for ESLint v9+ and modern repos.",
        icon: "\uf013",
        label: "Flat Config native",
    },
    {
        description:
            "Works in JavaScript today and scales to type-aware analysis in TypeScript.",
        icon: "\ue628",
        label: "JavaScript + TypeScript",
    },
    {
        description:
            "Clear diagnostics with safe autofixes and practical migration guidance.",
        icon: "\uf0ad",
        label: "Actionable rule docs",
    },
] as const satisfies readonly HeroBadge[];

/**
 * Hero stats Note: These icons are from the "Nerd Font Symbols" font.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const heroStats = [
    {
        description: "Core immutable and functional rules for everyday code.",
        headline: "\uf0ca 14 Core Rules",
    },
    {
        description: "Start small, then scale to stricter coverage.",
        headline: "\ue690 5 Presets",
    },
    {
        description: "Safe rewrites where semantics are preserved.",
        headline: "\udb80\udc68 Safe Autofix & Suggestions",
    },
] as const satisfies readonly HeroStat[];

/**
 * Button icons Note: These icons are from the "Nerd Font Symbols" font.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const overviewButtonIcon = "\udb81\udf1d";
const comparePresetsButtonIcon = "\udb85\udc92";
const heroKickerIcon = "\uf0ad";
const heroKickerIcon2 = "\uf135";

/**
 * Home card icons Note: These icons are from the "Nerd Font Symbols" font,
 * which is included in the site styles. If you change these icons, make sure to
 * choose ones that exist in that font or adjust the font-family in the CSS
 * accordingly.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const homeCards = [
    {
        icon: "\uf135",
        title: "Get Started",
        description:
            "Install the plugin, enable a preset, and start enforcing immutable patterns in JavaScript or TypeScript.",
        to: "/docs/rules/getting-started",
    },
    {
        icon: "\ue690",
        title: "Presets",
        description:
            "Choose the right rollout path: functional-lite, functional, immutable, recommended, or all.",
        to: "/docs/rules/presets",
    },
    {
        icon: "\uf02d",
        title: "Rule Reference",
        description:
            "Browse every rule with concrete incorrect/correct examples and migration guidance.",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            title="eslint-plugin-immutable-2 docs"
            description="Documentation for eslint-plugin-immutable-2"
        >
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                {`${heroKickerIcon} ESLint plugin for modern JavaScript + TypeScript teams ${heroKickerIcon2}`}
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                eslint-plugin-immutable-2
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                ESLint rules that enforce immutable data and
                                functional constraints across JavaScript and
                                TypeScript codebases. Start with{" "}
                                <Link
                                    className={`${styles.heroInlineLink} ${styles.heroInlineLinkImmutable}`}
                                    to="/docs/rules/overview"
                                >
                                    the overview
                                </Link>{" "}
                                and pick a preset from{" "}
                                <Link
                                    className={`${styles.heroInlineLink} ${styles.heroInlineLinkTsExtras}`}
                                    to="/docs/rules/presets"
                                >
                                    the presets guide
                                </Link>
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.label}
                                        className={styles.heroBadge}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            <span
                                                aria-hidden="true"
                                                className={styles.heroBadgeIcon}
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    {overviewButtonIcon} Start with Overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/presets"
                                >
                                    {comparePresetsButtonIcon} Compare Presets
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt="eslint-plugin-immutable-2 logo"
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                key={stat.headline}
                                className={styles.heroStatCard}
                            >
                                <p className={styles.heroStatHeading}>
                                    {stat.headline}
                                </p>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article key={card.title} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <p className={styles.cardIcon}>
                                        {card.icon}
                                    </p>
                                    <Heading
                                        as="h2"
                                        className={styles.cardTitle}
                                    >
                                        {card.title}
                                    </Heading>
                                </div>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <Link className={styles.cardLink} to={card.to}>
                                    Open section →
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
