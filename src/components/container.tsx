const Container = ({ children }: any) => {
  return (
    <div className="flex items-center flex-col py-2">
      <div className="sm:min-w-[400px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1336px]">
        {children}
      </div>
    </div>
  );
};

export default Container;
