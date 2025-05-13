interface Params {
  title: string;
  highlighted: string;
  description: string;
  buttonChildren: any;
  action: any;
  straightTitle?: boolean;
}

export default function SectionMessage({
  title,
  highlighted,
  description,
  buttonChildren,
  action,
  straightTitle,
}: Params) {
  return (
    <div className="w-max max-w-full flex flex-col">
      <h3
        className={`section-tittle overflow-hidden large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] mb-7 large:mb-[38px] font-semibold large:leading-[64px] text-black`}
      >
        {title}
        {!straightTitle && <br />}{" "}
        <span className="text-background-darkYellow">{highlighted}</span>
      </h3>
      <p
        className={`text-primary-boulder400 mb-8 large:text-xl text-base leading-9 large:leading-[48px] font-normal `}
      >
        {description}
      </p>
      <button
        onClick={action}
        className={`flex hover-text-button gap-1 items-center py-2.5 h-12 large:h-14 px-12 bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold w-max `}
      >
        {buttonChildren}
      </button>
    </div>
  );
}
