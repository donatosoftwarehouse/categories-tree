export type itemProps = {
  id: string;
  name: string;
  left: number;
  right: number;
  level: number;
  parent: string | null;
  children: itemProps[];
}