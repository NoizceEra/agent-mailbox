"use client";

import traitsData from "../traits.json";
import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const CATEGORIES = ["Background", "Skin", "Clothes", "Face", "Hats"] as const;
type Category = (typeof CATEGORIES)[number];

type Trait = {
  Category: Category;
  Name: string;
  FileName: string;
};

type SelectedTraits = {
  [K in Category]?: Trait;
};

function groupTraitsByCategory(traits: Trait[]): Record<Category, Trait[]> {
  const grouped: Record<Category, Trait[]> = {
    Background: [],
    Skin: [],
    Clothes: [],
    Face: [],
    Hats: [],
  };
  for (const t of traits) {
    if (grouped[t.Category]) grouped[t.Category].push(t);
  }
  return grouped;
}

function DoggoPreview({ selected }: { selected: SelectedTraits }) {
  const layers: Category[] = ["Background", "Skin", "Clothes", "Face", "Hats"];

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.previewInner}>
        {layers.map((category) => {
          const trait = selected[category];
          if (!trait || trait.Name === "None") return null;
          const src = `/traits/${trait.Category}/${encodeURIComponent(
            trait.FileName
          )}`;
          return (
            <Image
              key={`${category}-${trait.Name}`}
              src={src}
              alt={`${category} ${trait.Name}`}
              width={500}
              height={500}
              className={styles.layer}
              priority={true}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const traits = traitsData as Trait[];
  const traitsByCategory = useMemo(
    () => groupTraitsByCategory(traits),
    [traits]
  );

  const [selected, setSelected] = useState<SelectedTraits>(() => {
    const initial: SelectedTraits = {};
    for (const cat of CATEGORIES) {
      const list = traitsByCategory[cat] || [];
      const first = list.find((t) => t.Name !== "None") ?? list[0];
      if (first) initial[cat] = first;
    }
    return initial;
  });

  const handleSelect = (category: Category, trait: Trait) => {
    setSelected((prev) => ({ ...prev, [category]: trait }));
  };

  const handleRandom = () => {
    setSelected(() => {
      const next: SelectedTraits = {};
      for (const cat of CATEGORIES) {
        const list = traitsByCategory[cat] || [];
        if (!list.length) continue;
        const nonNone = list.filter((t) => t.Name !== "None");
        const pool = nonNone.length ? nonNone : list;
        const choice = pool[Math.floor(Math.random() * pool.length)];
        next[cat] = choice;
      }
      return next;
    });
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Doggos Builder</h1>
      
      <div className={styles.container}>
        {/* Left: preview container */}
        <section className={styles.previewSection}>
          <DoggoPreview selected={selected} />
          
          <button
            type="button"
            onClick={handleRandom}
            className={styles.randomButton}
          >
            Randomize Doggo
          </button>
          
          <p className={styles.layerInfo}>
            Render Order: Background → Skin → Clothes → Face → Hats
          </p>
        </section>

        {/* Right: trait selection blocks */}
        <section className={styles.controlsSection}>
          {CATEGORIES.map((category) => {
            const list = traitsByCategory[category] || [];
            return (
              <div
                key={category}
                className={styles.categoryCard}
              >
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category}</h2>
                  <span className={styles.categorySelected}>
                    {selected[category]?.Name ?? "None"}
                  </span>
                </div>
                
                <div className={styles.traitsGrid}>
                  {list.map((trait) => {
                    const isActive = selected[category]?.Name === trait.Name;
                    return (
                      <button
                        key={trait.Name}
                        type="button"
                        onClick={() => handleSelect(category, trait)}
                        className={`${styles.traitButton} ${
                          isActive ? styles.traitActive : ""
                        }`}
                      >
                        {trait.Name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

