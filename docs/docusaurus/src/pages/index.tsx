import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import GitHubStats from "../components/GitHubStats";
import styles from "./index.module.css";

interface HeroBadge {
    readonly description: string;
    readonly icon: string;
    readonly label: string;
}

interface HeroStat {
    readonly description: string;
    readonly headline: string;
}

interface HomeCard {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
}

/**
 * Hero badges Note: These icons are from the "Nerd Font Symbols" font.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const heroBadges = [
    {
        description: "Drop-in config for ESLint v9+ and modern repos.",
        icon: "\u{F013}",
        label: "Flat Config native",
    },
    {
        description:
            "Works in JavaScript today and scales to type-aware analysis in TypeScript.",
        icon: "\u{E628}",
        label: "JavaScript + TypeScript",
    },
    {
        description:
            "Clear diagnostics with safe autofixes and practical migration guidance.",
        icon: "\u{F0AD}",
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
        headline: "\u{F0CA} 14 Core Rules",
    },
    {
        description: "Start small, then scale to stricter coverage.",
        headline: "\u{E690} 5 Presets",
    },
    {
        description: "Safe rewrites where semantics are preserved.",
        headline: "\u{F0068} Safe Autofix & Suggestions",
    },
] as const satisfies readonly HeroStat[];

/**
 * Button icons Note: These icons are from the "Nerd Font Symbols" font.
 *
 * @see https://www.nerdfonts.com/cheat-sheet for available icons in the "Nerd Font Symbols" font
 */
const overviewButtonIcon = "\u{F071D}";
const comparePresetsButtonIcon = "\u{F1492}";
const heroKickerIcon = "\u{F0AD}";
const heroKickerIcon2 = "\u{F135}";

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
        description:
            "Install the plugin, enable a preset, and start enforcing immutable patterns in JavaScript or TypeScript.",
        icon: "\u{F135}",
        title: "Get Started",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Choose the right rollout path: functional-lite, functional, immutable, recommended, or all.",
        icon: "\u{E690}",
        title: "Presets",
        to: "/docs/rules/presets",
    },
    {
        description:
            "Browse every rule with concrete incorrect/correct examples and migration guidance.",
        icon: "\u{F02D}",
        title: "Rule Reference",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

/**
 * Render the Docusaurus docs homepage.
 *
 * @returns Home page layout with hero content, badges, and navigation cards.
 */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            description="Documentation for eslint-plugin-immutable-2"
            title="eslint-plugin-immutable-2 docs"
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
                                    className={`${styles.heroInlineLink} ${styles.heroInlineLinkPresets}`}
                                    to="/docs/rules/presets"
                                >
                                    the presets guide
                                </Link>
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles.heroBadge}
                                        key={badge.label}
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
                                className={styles.heroStatCard}
                                key={stat.headline}
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
                            <article className={styles.card} key={card.title}>
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
