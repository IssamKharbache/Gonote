const EmptyTodoList = ({ text }: { text: string }) => {
  return (
    <div className="max-w-xl mx-auto mt-12  rounded-4xl p-5">
      <div className="flex flex-col md:flex-row  items-center  gap-5">
        <img src="/notask.png" alt="notaskfound" className="w-40 md:w-80" />
        <div className="w-full">
          <h1 className="text-4xl text-blue-400 dark:text-blue-500">
            HOORAY !
          </h1>
          <h3 className="text-2xl  text-muted-foreground">{text}</h3>
        </div>
      </div>
    </div>
  );
};

export default EmptyTodoList;
