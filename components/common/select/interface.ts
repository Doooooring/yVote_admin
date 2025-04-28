export interface SelectCompProps<T> {
  selected: number | null;
  setSelected: (i: number) => void;
  menus: Array<T>;
}
