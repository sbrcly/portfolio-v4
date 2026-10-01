import styles from "./plate.module.css";

type Props = {
  as?: "div" | "figure";
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/**
 * A work plate: media with the brass rim. Every plate is a candidate for
 * chapter III's light (data-light="iii"); plate-light.ts picks the lit one.
 */
export default function Plate({
  as: Tag = "div",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={className ? `${styles.plate} ${className}` : styles.plate}
      data-light="iii"
      {...rest}
    >
      {children}
    </Tag>
  );
}
