import styles from "./plate.module.css";

type Props = {
  as?: "div" | "figure";
  /**
   * The chapter whose light this plate can take (see plate-light.ts).
   * null for a plate that always rests.
   */
  light?: string | null;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/** A plate: media with the brass rim. */
export default function Plate({
  as: Tag = "div",
  light = "iii",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={className ? `${styles.plate} ${className}` : styles.plate}
      data-light={light ?? undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
