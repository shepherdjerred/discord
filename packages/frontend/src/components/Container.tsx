export interface ContainerProps {
  children: React.ReactNode;
}

export function Container(props: ContainerProps) {
  return (
    <div className="flex items-center flex-col mt-10 mb-10">
      <div className="w-1/3">{props.children}</div>
    </div>
  );
}
