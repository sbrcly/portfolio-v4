import styles from "./plate.module.css";

type Props = {
  as?: "div" | "figure";
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/** A plate: media with a one-pixel rim. */
export default function Plate({
  as: Tag = "div",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={className ? `${styles.plate} ${className}` : styles.plate}
      {...rest}
    >
      {children}
    </Tag>
  );
}
