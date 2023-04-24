import { Container } from "./Container.js";

export interface PageProps {
  children: React.ReactNode;
}

export function Page(props: PageProps) {
  return <Container>{props.children}</Container>;
}
